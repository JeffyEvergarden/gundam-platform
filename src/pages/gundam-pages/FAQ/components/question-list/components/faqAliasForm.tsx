import React, { useState, useImperativeHandle } from 'react';
import { Modal, Form, Input } from 'antd';

const { Item: FormItem } = Form;

// 创建链接
const FaqAliasModal: React.FC<any> = (props: any) => {
  const { cref } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      ...values,
    };
    console.log(obj);
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      form.setFieldsValue({ faqAlias: row?.faqAlias });
      setVisible(true);
    },
    close,
    submit,
  }));

  const close = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      width={650}
      title={'标准问简称编辑'}
      visible={visible}
      onCancel={close}
      okText={'确定'}
      onOk={submit}
      // confirmLoading={loading}
    >
      <div style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          {/* 标准问简称 */}
          <FormItem name="faqAlias" label="标准问简称" style={{ width: '360px' }}>
            <Input placeholder={'请输入标准问简称'} autoComplete="off" maxLength={20} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default FaqAliasModal;
