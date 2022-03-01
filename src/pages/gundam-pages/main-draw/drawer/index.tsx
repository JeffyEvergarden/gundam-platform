import { useState, useImperativeHandle, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { useModel } from 'umi';
import ConversationConfig from './child/conversation-config';
import HighConfig from './child/high-config';
import WordSlotTable from './components/word-slot-table';

import { useSelectModel, useNodeOpsModel } from '../model';
import { useEffect } from 'react';
import Condition from '@/components/Condition';

import LabelSelect from './components/label-select';
import GlobalVarButton from './components/global-var-button';
import config from '@/config';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [nodetype, setNodetype] = useState<string>('');

  const { info, flowList } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    flowList: model.flowList, // 业务流程列表
  }));
  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: info.flowId, //流程id
  };
  const recordInfo = useRef<any>({});

  // 意图列表、词槽列表
  const { wishList, wordSlotList, getWishList, getWordSlotList } = useSelectModel();

  const { saveNode: _saveNode } = useNodeOpsModel();

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      console.log(info);

      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      setNodetype(info._nodetype || 'normal');
      form.resetFields();
      form.setFieldsValue(info);
      setVisible(true);
    },
    close: onClose,
  }));

  const saveNode = async () => {
    // console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (res === false) {
      return;
    } else {
      let result: any = await _saveNode({
        ...res,
        nodeName: res.name,
        ...preParams,
        id: recordInfo.current.info?._id,
        nodeType: recordInfo.current.info?.nodeType,
      });
      if (result === true) {
        recordInfo.current?.callback?.(res?.name); // 成功回调修改名称
        onClose();
      }
    }
  };

  useEffect(() => {
    getWishList(info.id);
    getWordSlotList(info.id);
  }, []);

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveNode}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title="节点配置"
      width={850}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      <Form form={form}>
        <div className={styles['antd-form']}>
          <FormItem
            rules={[{ required: true, message: '请输入节点名称' }]}
            name="name"
            label="节点名称"
            style={{ width: '400px' }}
          >
            <Input placeholder="请输入节点名称" maxLength={150} autoComplete="off" />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请输入节点描述' }]}
            name="nodeDesc"
            label="节点描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入流程描述" maxLength={200} />
          </FormItem>
        </div>

        {/* 普通节点 */}

        <Condition r-if={nodetype === 'normal'}>
          <FormItem name="nodeSlots">
            <WordSlotTable list={wordSlotList} />
          </FormItem>

          <ConversationConfig
            form={form}
            wishList={wishList}
            wordSlotList={wordSlotList}
          ></ConversationConfig>

          <HighConfig form={form} wishList={wishList} bussinessList={flowList}></HighConfig>
        </Condition>

        {/* 业务节点 */}
        <Condition r-if={nodetype === 'business'}>
          <div className={styles['antd-form']}>
            <FormItem label="业务流程" name="business" style={{ width: '400px' }}>
              <Select placeholder="请选择业务流程">
                {flowList.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.name} opt={item}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </Condition>

        {/* 开始节点 */}
        <Condition r-if={nodetype === 'start'}>
          <ConversationConfig
            form={form}
            wishList={wishList}
            wordSlotList={wordSlotList}
          ></ConversationConfig>

          <HighConfig form={form} wishList={wishList} bussinessList={flowList}></HighConfig>
        </Condition>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
