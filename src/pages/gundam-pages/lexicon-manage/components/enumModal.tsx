import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { visible, type, closeEnum, save } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    visible && form.setFieldsValue({});
  }, [visible]);

  const cancel = () => {
    closeEnum();
  };

  const submit = async () => {
    const values = await form.validateFields();
    save(values);
  };
  return (
    <Modal
      visible={visible}
      title={type === 'edit' ? '编辑枚举实体' : '新增枚举实体'}
      footer={null}
      onCancel={cancel}
      destroyOnClose={true}
    >
      <Form form={form} {...layout}>
        <Form.Item
          name={'entityName'}
          label={'实体名称'}
          rules={[{ required: true, message: '请输入实体名称' }]}
        >
          <Input placeholder={'请输入实体名称'} maxLength={150} />
        </Form.Item>
        <Form.Item
          name={'entityval'}
          label={'实体值'}
          rules={[{ required: true, message: '请输入实体值' }]}
        >
          <TextArea placeholder={'请输入实体值'} maxLength={1000} rows={6} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" onClick={submit}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
