import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message } from 'antd';
import { operateFlowFormList } from '../config';
import { useTableModel } from '../model';
import { useIntentModel } from '../../wish/model';

const { Option } = Select;
const selectOptList = [
  {
    name: '意图',
    value: 'intent',
  },
];

export default (props: any) => {
  const { visible, title, modalData, operateFunc } = props;
  const [form] = Form.useForm();
  const { editFlowData, addFlowData } = useTableModel();
  const { getIntentInfoList, getIntentTableList } = useIntentModel();

  const [triggerIntentList, setTriggerIntentList] = useState<any>([]);
  useEffect(() => {
    if (visible) {
      getIntentSelList();
      if (title == 'edit') {
        form.setFieldsValue({ ...modalData });
      }
    }
  }, [visible]);
  const closeModal = () => {
    operateFunc();
    form.resetFields();
  };

  const submit = async () => {
    const values = form.validateFields();
    const data = form.getFieldsValue();
    let params = {
      ...data,
      robotId: modalData.robotId,
    };
    let res: any;
    if (title == 'edit') {
      res = await editFlowData({ ...params, id: modalData.id });
    } else {
      res = await addFlowData({ ...params, flowType: 1 });
    }
    if (res?.resultCode == '100') {
      message.info(res?.resultDesc || '正在处理');
      operateFunc();
      form.resetFields();
    }
  };

  //  获取触发意图
  const getIntentSelList = async () => {
    const res: any = await getIntentInfoList({
      robotId: modalData?.robotId,
      headIntent: 0,
    });
    console.log(res?.datas);
    if (res?.datas) {
      let newData = [...res?.datas];
      setTriggerIntentList(newData);
    } else {
      setTriggerIntentList([]);
    }
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={title == 'edit' ? '编辑' : '新增'}
        footer={null}
        onCancel={closeModal}
      >
        <Form form={form}>
          {operateFlowFormList?.map((item: any) => {
            return (
              <React.Fragment key={item.name}>
                {item.type == 'input' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Input />
                  </Form.Item>
                )}
                {item.type == 'select' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Select>
                      {triggerIntentList?.map((itex: any) => {
                        return (
                          <Option key={itex.id || itex.intentName} value={itex.intentName}>
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

          <Form.Item>
            <Space>
              <Button onClick={closeModal}>取消</Button>
              <Button type="primary" onClick={submit}>
                确认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
