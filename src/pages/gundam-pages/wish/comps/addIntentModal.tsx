import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Button, Select, Radio, Space, message, Spin } from 'antd';
import { operateFormList } from './config';
import { useIntentModel } from '../model';
import config from '@/config/index';
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
  const [spinning, handleSpinning] = useState<boolean>(false);
  const { addIntentItem, editIntentItem } = useIntentModel();
  useEffect(() => {
    if (visible) {
      if (title == 'edit') {
        form.setFieldsValue({ ...modalData });
      } else if (title == 'add') {
        form.resetFields();
      }
    }
  }, [visible]);

  const operCancel = () => {
    cancel();
  };

  const operSubmit = async () => {
    const values = await form.validateFields();
    let res: any;
    handleSpinning(true);
    if (title == 'edit') {
      res = await editIntentItem({ ...values, id: modalData.id, robotId: modalData.robotId });
    } else if (title == 'add') {
      res = await addIntentItem({ robotId: modalData.robotId, ...values });
    }

    if (res?.resultCode == config.successCode) {
      message.success(res?.resultDesc);
      submit();
    } else {
      message.error(res?.resultDesc || '失败');
    }
    handleSpinning(false);
  };

  return (
    <React.Fragment>
      <Modal
        title={title == 'add' ? '新增' : '编辑'}
        visible={visible}
        footer={null}
        onCancel={operCancel}
      >
        <Spin spinning={spinning}>
          <Form form={form} {...layout}>
            {operateFormList.map((item: any) => {
              return (
                <React.Fragment key={item.name}>
                  {item.type == 'input' && (
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Input maxLength={200} placeholder={item.placeholder} />
                    </Form.Item>
                  )}

                  {item.type == 'radio' && (
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Radio.Group disabled={title == 'edit'}>
                        <Radio value={0}>头部意图</Radio>
                        <Radio value={1}>辅助意图</Radio>
                      </Radio.Group>
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
        </Spin>
      </Modal>
    </React.Fragment>
  );
};
