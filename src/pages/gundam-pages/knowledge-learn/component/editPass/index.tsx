import { useEffect, useRef, useState } from 'react';
import { Form, Modal, Space, Input } from 'antd';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

export default (props: any) => {
  const { visible, onCancel, modalData, save } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    visible &&
      form.setFieldsValue({
        prequestion: modalData?.recommendName,
        nowquestion: modalData?.question,
      });
  }, [visible, modalData]);

  const submit = () => {
    let val = form.getFieldsValue();
    save(val);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'编辑通过'}
      // footer={null}
      width={600}
      okText={'通过'}
      onOk={submit}
    >
      <Form form={form} {...layout} layout={'vertical'}>
        <Form.Item
          name={'prequestion'}
          label={`推荐${modalData?.recommendType == '1' ? '标准问' : '样本'}`}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item name={'nowquestion'} label={''}>
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
