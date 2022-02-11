import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, Switch, Select, Input, message } from 'antd';
import style from './style.less';
import { useFormModel } from '../../model';

const { Item: FormItem } = Form;
const { Option } = Select;

const extra = {
  autoComplete: 'off',
};
// # todo
// 创建链接
const FormModal: React.FC<any> = (props: any) => {
  const { cref, type = 1, confirm, loading } = props;

  const [form] = Form.useForm();

  const [url, setUrl] = useState<string>('');

  const [visible, setVisible] = useState<boolean>(false);

  const [originInfo, setOriginInfo] = useState<any>({});

  const { getFormInfo, updateMenuForm } = useFormModel();

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      isDisplay: values?.flag,
      oldUrl: values?.url,
    };
    // TODO
    await updateMenuForm(obj);
    // setVisible(false);
    confirm?.(obj);
    setVisible(false);
    return obj;
  };

  useImperativeHandle(cref, () => ({
    open: async (row: any) => {
      form.resetFields();
      setVisible(true);
      // todo 可能需要加工数据
      let formInfo: any = await getFormInfo();
      if (formInfo) {
        form.setFieldsValue(formInfo);
      }
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  return (
    <Modal
      width={700}
      title={'通用配置'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '80px' }}>
        <Form form={form} style={{ width: '360px' }}>
          {/* 是否开启旧统一门户显示 */}
          <FormItem
            rules={[{ required: true, message: '请选择是否开启旧统一门户显示' }]}
            valuePropName="checked"
            name="flag"
            label="旧统一门户链接开关"
            style={{ width: '360px' }}
          >
            <Switch />
          </FormItem>

          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请填写链接路径' }]}
            name="url"
            label="链接路径"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写链接路径" {...extra} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default FormModal;
