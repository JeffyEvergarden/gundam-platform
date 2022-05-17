import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { addFeatureFormList } from './config';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};
export default (props: any) => {
  const { visible, title, modalData, onSubmit, onCancel } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (title == 'edit') {
        form.setFieldsValue({
          ...modalData,
        });
      }
    }
  }, [visible]);

  const cancel = () => {
    onCancel();
  };
  const submit = async () => {
    const values = await form.validateFields();
    let newValues = form.getFieldsValue();
    onSubmit(newValues);
  };

  return (
    <Modal
      title={title == 'add' ? '新增特征词' : '编辑特征词'}
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Form form={form} {...layout}>
        {addFeatureFormList?.map((item) => {
          return (
            <React.Fragment key={item.name}>
              {item.type == 'input' && (
                <Form.Item name={item.name} label={item.label} rules={item.rules}>
                  <Input
                    placeholder={item.placeholder}
                    readOnly={item.readonly && title == 'edit'}
                    maxLength={200}
                  />
                </Form.Item>
              )}
              {item.type == 'text' && (
                <Form.Item name={item.name} label={item.label} rules={item.rules}>
                  <TextArea placeholder={item.placeholder} />
                </Form.Item>
              )}
            </React.Fragment>
          );
        })}

        <Form.Item {...tailLayout}>
          <Space>
            <Button onClick={cancel}>取消</Button>
            <Button onClick={submit} type="primary">
              确认
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
