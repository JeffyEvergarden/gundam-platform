import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message } from 'antd';
import { operateFlowFormList } from '../config';
import { useTableModel } from '../model';
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
  useEffect(() => {
    if (visible) {
      if (title == 'edit') {
        form.setFieldsValue({ ...modalData });
      }
    }
  }, [visible]);
  const closeModal = () => {
    operateFunc('close');
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
      res = await addFlowData(params);
    }
    message.info(res?.resultDesc || '正在处理');
    operateFunc('submit');
    form.resetFields();
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
                      {selectOptList?.map((item: any) => {
                        return <Option value={item.value}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                )}
              </React.Fragment>
            );
          })}

          <Form.Item>
            <Space>
              <Button onClick={close}>取消</Button>
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
