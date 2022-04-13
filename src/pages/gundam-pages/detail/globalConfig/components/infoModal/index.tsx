import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
  Modal,
  Form,
  Button,
  InputNumber,
  Radio,
  Select,
  Input,
  Upload,
  message,
  Divider,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { scopeList, dataTypeList } from '../../const';

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

  const handleVarInterface = () => {
    let val = form.getFieldValue('interfaceName');
    setVarInterface(val);
    console.log(val);
  };

  const addInParams = () => {
    const tempChildrenList = form.getFieldValue('inParams') || [];
    tempChildrenList.push({
      inParam: undefined,
    });
    form.setFieldsValue({
      inParams: [...tempChildrenList],
    });
  };
  const addOutParams = () => {
    const tempChildrenList = form.getFieldValue('outParams') || [];
    tempChildrenList.push({
      outParam: undefined,
    });
    form.setFieldsValue({
      outParams: [...tempChildrenList],
    });
  };

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
                pattern: /^[A-Za-z0-9_\-]+$/g,
                message: '请输入字母、下划线、数字',
              },
            ]}
            name="configKey"
            label="变量ID"
            style={{ width: '460px' }}
          >
            <Input placeholder="请填写变量ID" {...extra} maxLength={50} />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请填写变量名称' }]}
            name="configName"
            label="变量名称"
            style={{ width: '460px' }}
          >
            <Input placeholder="请填写变量名称" {...extra} maxLength={50} />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请选择数据类型' }]}
            name="dataType"
            label="数据类型"
            style={{ width: '460px' }}
            initialValue={0}
          >
            <Select placeholder={'请输入'} defaultValue={0}>
              {dataTypeList.map((item: any) => {
                return (
                  <Option key={item.name} value={item.name}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem name="configDesc" label="变量说明" style={{ width: '460px' }}>
            <TextArea placeholder="请填写变量说明" {...extra} maxLength={150} />
          </FormItem>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormItem
              rules={[{ required: true, message: '请选择' }]}
              name="interfaceName"
              label="接口名称"
              style={{ width: '460px' }}
            >
              <Select onChange={handleVarInterface} placeholder={'请选择'}>
                {scopeList.map((item: any) => {
                  return (
                    <Option key={item.name} value={item.name}>
                      {item.label}
                    </Option>
                  );
                })}
                <Option key={'custom'} value={'custom'}>
                  自定义
                </Option>
              </Select>
            </FormItem>
            <Tooltip title={'接口说明'}>
              <QuestionCircleOutlined style={{ marginBottom: '24px', marginLeft: '6px' }} />
            </Tooltip>
          </div>
          <FormItem
            rules={[{ required: true, message: '请选择入参字段名' }]}
            name="req"
            label="入参字段名"
            style={{ width: '460px' }}
            initialValue={0}
          >
            <Select placeholder={'请输入'} defaultValue={0}>
              {dataTypeList.map((item: any) => {
                return (
                  <Option key={item.name} value={item.name}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请选择入参值' }]}
            name="reqValue"
            label="入参值"
            style={{ width: '460px' }}
            initialValue={0}
          >
            <Select placeholder={'请输入'} defaultValue={0}>
              {dataTypeList.map((item: any) => {
                return (
                  <Option key={item.name} value={item.name}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <Divider />
          <FormItem
            rules={[{ required: true, message: '请选择出参字段名' }]}
            name="res"
            label="出参字段名"
            style={{ width: '460px' }}
            initialValue={0}
          >
            <Select placeholder={'请输入'} defaultValue={0}>
              {dataTypeList.map((item: any) => {
                return (
                  <Option key={item.name} value={item.name}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>

          {/* <Condition r-if={varInterface != 'custom'}>
            <div
              style={{
                maxHeight: '200px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Form.List name="inParams">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={index}>
                        <Space align="baseline" style={{ display: 'flex' }}>
                          <FormItem
                            label={`传入参数${index + 1}`}
                            name={[field.name, `inParam`]}
                            key={field.fieldKey + `inParam`}
                            fieldKey={[field.fieldKey, `inParam`]}
                          >
                            <Input
                              style={{ width: '320px' }}
                              maxLength={200}
                              placeholder="证件号后8位"
                            />
                          </FormItem>
                          <Popconfirm
                            title="确定要删除该参数吗?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                              remove(index);
                            }}
                          >
                            <MinusCircleFilled style={{ marginLeft: '8px' }} />
                          </Popconfirm>
                        </Space>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
              <Button icon={<PlusCircleFilled />} onClick={addInParams}>
                新增入参
              </Button>
              <Divider />
              <Form.List name="outParams">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={index}>
                        <Space align="baseline" style={{ display: 'flex' }}>
                          <FormItem
                            label={`传出参数${index + 1}`}
                            name={[field.name, `outParam`]}
                            key={field.fieldKey + `outParam`}
                            fieldKey={[field.fieldKey, `outParam`]}
                          >
                            <Input
                              style={{ width: '320px' }}
                              maxLength={200}
                              placeholder="证件号后8位"
                            />
                          </FormItem>
                          <Popconfirm
                            title="确定要删除该参数吗?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                              remove(index);
                            }}
                          >
                            <MinusCircleFilled style={{ marginLeft: '8px' }} />
                          </Popconfirm>
                        </Space>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
              <Button icon={<PlusCircleFilled />} onClick={addOutParams}>
                新增出参
              </Button>
            </div>
          </Condition> */}
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
