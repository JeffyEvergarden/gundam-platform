//版本2
import { useState, useRef, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button, message } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ConversationConfig from './child/conversation-config';
import { useModel } from 'umi';
import { useNodeOpsModel } from '../model';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

import WordSlotTable from '../drawer/components/word-slot-table';

const DrawerForm = (props: any) => {
  const { cref, type, wishList, wordSlotList } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [nodetype, setNodetype] = useState<string>('');

  const { info, flowList, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    flowList: model.flowList, // 业务流程列表
    businessFlowId: model.businessFlowId,
  }));
  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };
  const recordInfo = useRef<any>({});

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
          <FormItem name="nodeSlots">
            <WordSlotTable list={wordSlotList} />
          </FormItem>

          <FormList name="list">
            {(outFields, { add: _add, remove: _remove }) => {
              const addOutNew = () => {
                // console.log(fields);
                let length = outFields.length;
                _add(
                  {
                    ruleList: [
                      {
                        ruleType: undefined,
                        ruleKey: undefined,
                        condition: undefined,
                        value: undefined,
                      },
                    ],
                  },
                  length,
                );
              };

              return (
                <div>
                  <div className={styles['zy-row']}>
                    <div className={styles['title']}>对话回应</div>
                    <Button
                      type="link"
                      icon={<AppstoreAddOutlined />}
                      style={{ marginLeft: '10px' }}
                      onClick={addOutNew}
                    >
                      新增回应策略
                    </Button>
                  </div>
                  <div>
                    {outFields.map((outFields: any, i: number) => {
                      return (
                        <div key={outFields.key} className={styles['module-box']}>
                          <div style={{ paddingLeft: '12px' }}>
                            <div className={styles['zy-row']} style={{ paddingBottom: '6px' }}>
                              <Button
                                type="text"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => {
                                  _remove(i);
                                }}
                              ></Button>
                              <span className={styles['title_sec']}>回应策略 {i + 1}</span>
                            </div>

                            {/* 内容组 */}
                            <div>
                              {/* 答复内容 */}
                              <ConversationConfig name={[outFields.name, 'conversationList']} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </FormList>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
