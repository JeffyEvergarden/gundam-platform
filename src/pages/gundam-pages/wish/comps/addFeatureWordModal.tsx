//  规则模版新增单个 特征值
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

export default (props: any) => {
  const { visible, onSubmit, onCancel } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);
  const cancel = () => {
    onCancel();
  };
  const submit = () => {
    const values = form.getFieldValue('newWord');
    onSubmit(values);
  };

  return (
    <Modal title="新增特征词" visible={visible} footer={null} onCancel={cancel}>
      <Form form={form}>
        <Form.Item name="newWord" rules={[{ required: true, message: '请输入特征词' }]}>
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={cancel}>取消</Button>
            <Button onClick={submit}>确认</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
