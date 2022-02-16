import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, InputNumber, Radio, Select, Input, Upload, message } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';

const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

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

  const [showRobotType, setShowRobotType] = useState<number>();

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
      if (!row?.actionLabel) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        console.log(row);
        // form.resetFields();
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

  const changeSoundType = () => {
    let val = form.getFieldValue('soundType');
    setShowRobotType(val);
    console.log(val);
  };

  return (
    <Modal
      width={650}
      title={(openType === 'new' ? '添加新' : '编辑') + '话术标签'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          {/* 标签名称 */}
          <FormItem
            rules={[
              { required: true, message: '请填写标签名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="actionLabel"
            label="标签名称"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写标签名称" {...extra} maxLength={150} />
          </FormItem>

          <FormItem name="labelDesc" label="标签描述" style={{ width: '360px' }}>
            <TextArea rows={4} placeholder="请填写标签描述" {...extra} maxLength={200} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
