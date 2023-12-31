import { Form, Input, Modal, Select, Space } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import style from './style.less';

import Tip from '@/components/Tip';
import { dataTypeList } from '../../const';

const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

const extra = {
  autoComplete: 'off',
};

const InfoModal: React.FC<any> = (props: any) => {
  const { cref, confirm, loading } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  // const [loading, setLoading] = useState<boolean>(false);

  const [openType, setOpenType] = useState<'new' | 'edit'>('new');

  const [originInfo, setOriginInfo] = useState<any>({});

  const [varInterface, setVarInterface] = useState<any>('');

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
      if (!row?.configKey) {
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

  return (
    <Modal
      width={650}
      title={(openType === 'new' ? '添加新' : '编辑') + '变量配置'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '65px' }}>
        <Form form={form} style={{ width: '480px' }}>
          {/* 变量配置 */}
          <FormItem
            rules={[
              { required: true, message: '请填写变量ID' },
              {
                pattern: /^[A-Za-z0-9_]+$/g,
                message: '请输入字母、下划线、数字',
              },
            ]}
            name="configKey"
            label="变量ID"
            style={{ width: '460px' }}
          >
            <Input
              placeholder="请填写变量ID"
              {...extra}
              maxLength={50}
              disabled={openType == 'edit'}
            />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请填写变量名称' }]}
            name="configName"
            label="变量名称"
            style={{ width: '460px' }}
          >
            <Input placeholder="请填写变量名称" {...extra} maxLength={50} />
          </FormItem>
          <FormItem label="数据类型" style={{ width: '460px' }}>
            <Space align="baseline">
              <FormItem
                rules={[{ required: true, message: '请选择数据类型' }]}
                name="dataType"
                noStyle
                initialValue={0}
              >
                <Select placeholder={'请输入'}>
                  {dataTypeList.map((item: any) => {
                    return (
                      <Option key={item.name} value={item.name}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
              <Tip
                title={
                  <>
                    用于定义变量的类型，在连线或对话回应规则中，变量类型会影响可用的比较逻辑。
                    <br />
                    例如，创建一个数值类型的“money”变量，在连线规则中会相应出现“大于、小于、等于”的比较逻辑；创建一个字符类型的“city”变量，在连线规则中会相应出现“包含、不包含”的比较逻辑；创建一个时间类型的“time”变量，在连线规则中可以出现时间选择的组件。
                  </>
                }
              />
            </Space>
          </FormItem>

          <FormItem name="configDesc" label="变量说明" style={{ width: '460px' }}>
            <TextArea placeholder="请填写变量说明" {...extra} maxLength={150} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
