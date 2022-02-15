import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, InputNumber, Radio, Select, Input, Upload, message } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';

const { Item: FormItem } = Form;
const { Option } = Select;

const linkTypeList: any = [
  {
    name: '只有领导可以使用',
    value: 'leader',
  },
  {
    name: '领导和普通用户都可以使用',
    value: 'all',
  },
  {
    name: '只有普通用户可以使用',
    value: 'employee',
  },
];

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

// 图片格式
const validSuffixList = ['.jpg', '.png', '.jpeg', '.svg', '.gif'];

const extra = {
  autoComplete: 'off',
};

// 创建链接
const InfoModal: React.FC<any> = (props: any) => {
  const { cref, confirm, loading } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  // const [loading, setLoading] = useState<boolean>(false);

  const [openType, setOpenType] = useState<'new' | 'edit'>('new');

  const [originInfo, setOriginInfo] = useState<any>({});

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      _originInfo: originInfo,
      _openType: openType,
      form: {
        ...values,
      },
    };
    // setVisible(false);
    confirm?.(obj);
    return obj;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      if (!row?.key && !row?.id) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        console.log(row);
        form.resetFields();
        setOpenType('edit');
        setOriginInfo(row);
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  return (
    <Modal
      width={700}
      title={(openType === 'new' ? '添加新' : '编辑') + '机器人'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          {/* 机器人名称 */}
          <FormItem
            rules={[{ required: true, message: '请填写机器人名称' }]}
            name="robotName"
            label="机器人名称"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写机器人名称" {...extra} />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请填写机器人描述' }]}
            name="robotDesc"
            label="机器人描述"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写机器人描述" {...extra} />
          </FormItem>

          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请选择业务类型' }]}
            name="businessCode"
            label="业务类型"
            style={{ width: '360px' }}
          >
            <Radio.Group>
              <Radio value={0}>呼入</Radio>
              <Radio value={1}>呼出</Radio>
            </Radio.Group>
          </FormItem>

          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请选择机器人类型' }]}
            name="robotType"
            label="机器人类型"
            style={{ width: '360px' }}
          >
            <Radio.Group>
              <Radio value={0}>文本</Radio>
              <Radio value={1}>语音</Radio>
            </Radio.Group>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
