import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Button, Select, Radio, Space, message } from 'antd';
import { operateFormList } from './config';
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default (props: any) => {
  const { visible, title, modalData, submit, cancel } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...modalData });
      // title == '编辑' && form.setFieldsValue({ ...modalData });
      // title == '新增' && form.resetFields();
    }
  }, [visible]);

  const operCancel = () => {
    cancel();
  };

  const operSubmit = async () => {
    const values = await form.validateFields();
    console.log('value', values);
    submit();
  };

  return (
    <React.Fragment>
      <Modal title={title} visible={visible} footer={null} onCancel={operCancel}>
        <Form form={form} {...layout}>
          {operateFormList.map((item: any) => {
            return (
              <React.Fragment key={item.name}>
                {item.type == 'input' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Input />
                  </Form.Item>
                )}

                {item.type == 'radio' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Select>
                      <Option value="0">1</Option>
                    </Select>
                  </Form.Item>
                )}
              </React.Fragment>
            );
          })}
          <Form.Item {...tailLayout}>
            <Space>
              <Button onClick={operCancel}>取消</Button>
              <Button type="primary" onClick={operSubmit}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
