import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default (props: any) => {
  const { visible, type, enumData, closeEnum, save } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    visible &&
      form.setFieldsValue({
        entityName: enumData?.entityName,
        entityValue: enumData?.entityValue,
      });
  }, [visible]);

  const cancel = () => {
    closeEnum();
  };

  const submit = async () => {
    const values = await form.validateFields();
    save(values, 0, type);
  };
  return (
    <Modal
      visible={visible}
      title={type === 'edit' ? '编辑枚举实体' : '新增枚举实体'}
      okText={'提交'}
      onCancel={cancel}
      destroyOnClose={true}
      onOk={submit}
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
          name={'entityValue'}
          label={'实体值'}
          rules={[{ required: true, message: '请输入实体值,多个枚举实体以英文逗号分隔' }]}
        >
          <TextArea
            placeholder={'请输入实体值,多个枚举实体以英文逗号分隔'}
            maxLength={1000}
            rows={6}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
