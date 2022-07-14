import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, InputNumber, Radio, Select, Input, Upload, message } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';

const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

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
      console.log(row);
      if (!row?.roleName) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        // console.log(row);
        form.resetFields();
        form.setFieldsValue(row);
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
      width={550}
      title={(openType === 'new' ? '添加新' : '编辑') + '角色'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      maskClosable={false}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']}>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} autoComplete="off">
          {/* 机器人名称 */}
          <FormItem
            rules={[
              { required: true, message: '请填写角色名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="roleName"
            label="角色名称"
          >
            <Input placeholder="请填写角色名称" {...extra} maxLength={30} />
          </FormItem>

          <FormItem name="roleDesc" label="角色描述">
            <TextArea rows={4} placeholder="请填写角色描述" {...extra} maxLength={200} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
