import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default (props: any) => {
  const [form] = Form.useForm();
  const { ruleVisible, ruleEditData, operate, closeRuleDecri, handle } = props;

  useEffect(() => {
    form.setFieldsValue({
      entityValueName: ruleEditData.entityValueName,
      entityValue: ruleEditData.entityValue,
    });
  }, [ruleVisible]);

  const cancelRule = () => {
    closeRuleDecri();
    // form.resetFields();
  };

  const handleOver = async () => {
    const values = await form.validateFields();
    if (operate === 'edit') {
      handle(values);
    }
    if (operate === 'add') {
      handle(values);
    }
    closeRuleDecri();
    form.resetFields();
  };

  return (
    <Modal
      visible={ruleVisible}
      title={null}
      okText={'提交'}
      onOk={handleOver}
      destroyOnClose={true}
      onCancel={cancelRule}
    >
      <Form name="userForm" form={form} {...layout}>
        <Form.Item
          name={'entityValueName'}
          label={'规则名称'}
          rules={[{ required: true, message: '请输入规则名称' }]}
        >
          <Input placeholder={'请输入规则名称'} maxLength={150} />
        </Form.Item>
        <Form.Item
          name={'entityValue'}
          label={'规则内容'}
          // rules={[{ required: true, message: '请输入规则内容' }]}
        >
          <TextArea rows={4} placeholder={'请输入规则内容'} maxLength={150} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
