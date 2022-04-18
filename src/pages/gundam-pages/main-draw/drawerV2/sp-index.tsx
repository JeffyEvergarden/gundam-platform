import { useState, useImperativeHandle, useRef } from 'react';
import { Modal, Drawer, Form, Input, Select, Button, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { useModel } from 'umi';

import { useNodeOpsModel } from '../model';
import { useEffect } from 'react';
import Condition from '@/components/Condition';
import config from '@/config';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref, type } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [autoCloseTipsFlag, setAutoCloseTipsFlag] = useState<boolean>(false);
  const onValuesChange = () => {
    setAutoCloseTipsFlag(true);
  };

  const [nodetype, setNodetype] = useState<string>('');

  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  const { flowList } = useModel('drawer' as any, (model: any) => ({
    flowList: model._flowList, // 业务流程列表
  }));

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };
  const recordInfo = useRef<any>({});

  const { saveNode: _saveNode } = useNodeOpsModel();

  const onClose = () => {
    if (autoCloseTipsFlag) {
      Modal.confirm({
        title: '温馨提示',
        content: '已对内容进行修改,若不保存将丢失编辑信息',
        onOk: () => {
          setVisible(false);
        },
      });
    } else {
      setVisible(false);
    }
  };

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      // console.log(info);
      setAutoCloseTipsFlag(false);
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
        id: recordInfo.current.info?.id,
        nodeType: recordInfo.current.info?.nodeType,
      });
      if (result === true) {
        setAutoCloseTipsFlag(false);
        recordInfo.current?.callback?.(res?.name); // 成功回调修改名称
        onClose();
      }
    }
  };

  useEffect(() => {}, []);

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
      <Form form={form} onValuesChange={onValuesChange}>
        <div className={styles['antd-form']}>
          <div className={styles['title']} style={{ marginTop: 0 }}>
            基本信息
          </div>
          <FormItem
            rules={[
              { required: true, message: '请输入节点名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="name"
            label="节点名称"
            style={{ width: '400px' }}
          >
            <Input
              placeholder="请输入节点名称"
              maxLength={150}
              disabled={nodetype === 'start'}
              autoComplete="off"
            />
          </FormItem>
          <FormItem
            // rules={[{ required: true, message: '请输入节点描述' }]}
            name="nodeDesc"
            label="节点描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入节点描述" maxLength={150} />
          </FormItem>
        </div>

        {/* 业务节点 */}
        <Condition r-if={nodetype === 'business'}>
          <div className={styles['antd-form']}>
            <FormItem label="业务流程" name="nodeFlowId" style={{ width: '400px' }}>
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
      </Form>
    </Drawer>
  );
};

export default DrawerForm;