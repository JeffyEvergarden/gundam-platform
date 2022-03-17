import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message, Spin } from 'antd';
import { operateFlowFormList } from '../config';
import { useTableModel } from '../model';
import style from './style.less';
import { useIntentModel } from '../../wish/model';

const { Option } = Select;
const selectOptList = [
  {
    name: '意图',
    value: 'intent',
  },
];

const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { visible, title, modalData, operateFunc } = props;
  const [form] = Form.useForm();
  const [spinning, handleSpinning] = useState<boolean>(false);

  const { editFlowData, addFlowData } = useTableModel();
  const { getIntentInfoList, getIntentTableList } = useIntentModel();

  const [triggerIntentList, setTriggerIntentList] = useState<any>([]);
  useEffect(() => {
    if (visible) {
      getIntentSelList();
      if (title == 'edit') {
        handleSpinning(true);
        let headIntent = modalData?.headIntent;
        form.setFieldsValue({ ...modalData, headIntent });
        handleSpinning(false);
      }
    }
  }, [visible]);
  const closeModal = () => {
    operateFunc();
    form.resetFields();
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (!values) {
      return;
    }
    const data = form.getFieldsValue();
    let params = {
      ...data,
      robotId: modalData.robotId,
    };
    let res: any;
    handleSpinning(true);
    if (title == 'edit') {
      res = await editFlowData({ ...params, id: modalData.id });
    } else {
      res = await addFlowData({ ...params, flowType: 1 });
    }
    if (res?.resultCode == '100') {
      message.info(res?.resultDesc);
      operateFunc();
      form.resetFields();
    } else {
      message.info(res?.resultDesc || '失败');
    }
    handleSpinning(false);
  };

  //  获取触发意图
  const getIntentSelList = async () => {
    const res: any = await getIntentInfoList({
      robotId: modalData?.robotId,
      headIntent: 0,
    });
    console.log(res?.datas);
    if (res?.datas) {
      let newData = res?.datas?.filter((item: any) => {
        return item.isInvokeByFlow == '0';
      });
      if (title == 'edit') {
        let newArray = [
          ...newData,
          { id: modalData?.headIntent, intentName: modalData?.headIntentName },
        ];
        setTriggerIntentList(newArray);
      } else {
        setTriggerIntentList(newData);
      }
    } else {
      setTriggerIntentList([]);
    }
  };

  return (
    <React.Fragment>
      <Modal
        width={650}
        visible={visible}
        title={title == 'edit' ? '编辑' : '新增'}
        onCancel={closeModal}
        onOk={submit}
        footer={null}
      >
        <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
          <Spin spinning={spinning}>
            <Form form={form} style={{ width: '360px' }}>
              {operateFlowFormList?.map((item: any) => {
                return (
                  <React.Fragment key={item.name}>
                    {item.type == 'input' && (
                      <Form.Item
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={{ width: '360px' }}
                      >
                        <Input maxLength={150} />
                      </Form.Item>
                    )}
                    {item.type == 'select' && (
                      <Form.Item
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={{ width: '360px' }}
                      >
                        <Select>
                          {triggerIntentList?.map((itex: any) => {
                            return (
                              <Option key={itex.id || itex.intentName} value={itex.id}>
                                {itex.intentName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  </React.Fragment>
                );
              })}

              <Form.Item {...tailLayout}>
                <Space>
                  <Button onClick={closeModal}>取消</Button>
                  <Button type="primary" onClick={submit}>
                    确认
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </React.Fragment>
  );
};
