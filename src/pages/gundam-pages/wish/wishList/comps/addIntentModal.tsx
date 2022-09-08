import config from '@/config/index';
import { Form, Input, message, Modal, Radio, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntentModel } from '../model';
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
        onCancel={operCancel}
        onOk={operSubmit}
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

                  {item.name == 'headIntent' && (
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Radio.Group disabled={title == 'edit'}>
                        <Radio value={0}>头部意图</Radio>
                        <Radio value={1}>辅助意图</Radio>
                      </Radio.Group>
                    </Form.Item>
                  )}

                  {item.type == 'radio2' && (
                    <Form.Item name={item.name} label={item.label} initialValue={1}>
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  )}
                </React.Fragment>
              );
            })}
          </Form>
        </Spin>
      </Modal>
    </React.Fragment>
  );
};
