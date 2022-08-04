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
  const { cref, confirm, loading, list = [] } = props;

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
      if (!row?.channelCode) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
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
      width={650}
      title={(openType === 'new' ? '添加新' : '编辑') + '渠道信息'}
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
              { required: true, message: '请输入渠道名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="channelName"
            label="渠道名称"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写渠道名称" {...extra} maxLength={150} />
          </FormItem>

          <Condition r-if={openType === 'new'}>
            <FormItem
              rules={[
                { required: true, message: '请输入渠道名称' },
                {
                  pattern: /^[A-Za-z0-9_]+$/g,
                  message: '请输入汉字、字母、下划线、数字、横杠',
                },
              ]}
              name="channelCode"
              label="渠道 code"
              style={{ width: '360px' }}
            >
              <Input placeholder="请填写渠道 code" {...extra} maxLength={20} minLength={2} />
            </FormItem>

            {/* 业务编码 */}
            <Condition r-if={list.length > 0}>
              <FormItem name="copyCode" label="复制渠道" style={{ width: '460px' }}>
                <Radio.Group>
                  {list?.map?.((item: any, index: number) => {
                    return (
                      <Radio value={item.channelCode} key={index}>
                        {item.channelName}
                      </Radio>
                    );
                  })}
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
