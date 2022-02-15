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

const businessCodeList = ['营销', '催收', '客服', '风险', '审批'];

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
      if (!row?.robotName) {
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
            rules={[
              { required: true, message: '请填写机器人名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="robotName"
            label="机器人名称"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写机器人名称" {...extra} maxLength={150} />
          </FormItem>

          <FormItem name="robotDesc" label="机器人描述" style={{ width: '360px' }}>
            <TextArea rows={4} placeholder="请填写机器人描述" {...extra} maxLength={200} />
          </FormItem>

          {/* 链接路径 */}
          <Condition r-if={openType == 'new'}>
            <FormItem
              rules={[{ required: true, message: '请选择业务编码' }]}
              name="businessCode"
              label="业务编码"
              style={{ width: '360px' }}
            >
              <Select>
                {businessCodeList.map((item) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>

            <FormItem
              rules={[{ required: true, message: '请选择语音类型' }]}
              name="soundType"
              label="语音类型"
              style={{ width: '360px' }}
            >
              <Radio.Group onChange={changeSoundType}>
                <Radio value={0}>呼入</Radio>
                <Radio value={1}>呼出</Radio>
              </Radio.Group>
            </FormItem>

            {/* 链接路径 */}
            <Condition r-if={!showRobotType}>
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
            </Condition>
          </Condition>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
