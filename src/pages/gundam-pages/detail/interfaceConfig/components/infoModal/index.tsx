import ProTable from '@ant-design/pro-table';
import { Button, Divider, Form, Input, Modal, Radio, Select, InputNumber, Space } from 'antd';
import React, { useImperativeHandle, useState, useRef } from 'react';
import { useModel } from 'umi';
import FormList from '../formList';
import style from './style.less';
import { useInterfaceModel } from '../../model';
import SubTestModal from './sub-modal';

const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

const extra = {
  autoComplete: 'off',
};

const InfoModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const testModalRef = useRef<any>({});

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  // const [loading, setLoading] = useState<boolean>(false);

  const [openType, setOpenType] = useState<'new' | 'edit'>('new');

  const [originInfo, setOriginInfo] = useState<any>({});

  const { postAddInterface, postSaveInterface, btLoading, getInterfaceDetail } =
    useInterfaceModel();

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      ...values,
      id: originInfo?.id,
    };
    let res: any = null;
    if (openType === 'new') {
      res = await postAddInterface(obj);
    } else {
      res = await postSaveInterface(obj);
    }
    if (res) {
      setVisible(false);
    }
    return obj;
  };

  const getInfoDetail = async (row: any) => {
    let params = {
      robotId: info.id,
      id: row.id,
      interfaceId: row.id,
    };
    let res = await getInterfaceDetail(params);
    // console.log(res);
    if (res) {
      form.setFieldsValue({ ...res });
    }
    return res;
  };

  const test = async () => {
    const values = await form.validateFields();
    testModalRef.current.open?.(values);
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      console.log(row);
      if (!row?.id) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        getInfoDetail(row);
        setOpenType('edit');
        setOriginInfo(row);
      }
      setVisible(true);
    },
    close: onclose,
    submit,
  }));

  const onclose = () => {
    setVisible(false);

    form.resetFields();
  };

  return (
    <>
      <Modal
        width={1000}
        title={(openType === 'new' ? '添加新' : '查看') + '接口配置'}
        visible={visible}
        onCancel={onclose}
        // okText={null}
        // onOk={submit}
        // confirmLoading={loading}
        footer={
          <div className={style['zy-row']}>
            <Button onClick={test}>接口测试</Button>

            <span style={{ flex: 1 }}></span>

            <Button key="back" onClick={onclose}>
              取消
            </Button>

            <Button
              type="primary"
              loading={btLoading}
              onClick={() => {
                submit();
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <div className={style['modal_bg']} style={{ paddingLeft: '12px' }}>
          <Form form={form} style={{ width: '640px' }}>
            {/* 接口名称 */}
            <FormItem
              rules={[{ required: true, message: '请填写接口名称' }]}
              name="interfaceName"
              label="接口名称"
              style={{ width: '580px' }}
            >
              <Input placeholder="请填写接口名称" {...extra} maxLength={50} />
            </FormItem>

            <FormItem
              rules={[{ required: true, message: '请填写接口描述' }]}
              name="interfaceDesc"
              label="接口名称"
              style={{ width: '580px' }}
            >
              <Input.TextArea placeholder="请填写接口名称" {...extra} rows={4} maxLength={200} />
            </FormItem>

            <FormItem
              rules={[{ required: true, message: '请填写URL' }]}
              name="interfaceUrl"
              label="URL"
              style={{ width: '580px' }}
            >
              <Input placeholder="请填写URL" {...extra} maxLength={200} />
            </FormItem>

            <FormItem
              rules={[{ required: true, message: '请选择接口类型' }]}
              name="interfaceType"
              label="接口类型"
              style={{ width: '580px' }}
            >
              <Radio.Group>
                <Radio value={'post'}>post</Radio>
                <Radio value={'get'}>get</Radio>
              </Radio.Group>
            </FormItem>

            <Space align="baseline">
              <FormItem
                rules={[{ required: true, message: '请输入超时时间' }]}
                name="readTimeOut"
                label="超时时间"
              >
                <InputNumber
                  placeholder="请输入超时时间"
                  {...extra}
                  min={1}
                  max={99}
                  // defaultValue={3}
                  style={{ width: '180px' }}
                />
              </FormItem>
              <span style={{ marginLeft: '8px' }}>秒</span>
            </Space>

            <FormItem rules={[]} name="requestHeader" label="请求头" style={{ width: '580px' }}>
              <Input.TextArea
                placeholder="请填写请求头(json格式)"
                {...extra}
                rows={4}
                maxLength={200}
                showCount
              />
            </FormItem>

            <FormList form={form} />

            {/* 请求参数 */}

            <FormItem rules={[]} name="requestBody" label="请求体" style={{ width: '580px' }}>
              <Input.TextArea
                placeholder="请填写请求体(json格式)"
                {...extra}
                rows={4}
                maxLength={1000}
                showCount
              />
            </FormItem>

            <div className={style['zy-row']} style={{ lineHeight: '32px' }}>
              <div
                className="ant-col ant-form-item-label"
                style={{ width: '90px', marginRight: '10px', flexShrink: 0 }}
              >
                <label className="ant-form-item-required" title="响应参数">
                  响应参数
                </label>
              </div>
              <span className={style['mr8']} style={{ width: '180px' }}>
                参数名称
              </span>
              <span className={style['mr8']} style={{ width: '180px' }}>
                参数ID
              </span>
              <span className={style['mr8']} style={{ width: '220px' }}>
                响应参数报文
              </span>
            </div>

            <div className={style['zy-row']} style={{ paddingLeft: '96px' }}>
              <FormItem
                className={style['mr8']}
                rules={[{ required: true, message: '请输入参数名称' }]}
                name={['responseParam', 'paramName']}
              >
                <Input placeholder="请填写参数名称" maxLength={50} style={{ width: '180px' }} />
              </FormItem>
              <FormItem
                className={style['mr8']}
                rules={[{ required: true, message: '请输入参数ID' }]}
                name={['responseParam', 'paramKey']}
              >
                <Input placeholder="请填写参数ID" maxLength={50} style={{ width: '180px' }} />
              </FormItem>
              <FormItem
                className={style['mr8']}
                rules={[{ required: true, message: '请输入响应参数报文' }]}
                name={['responseParam', 'paramMapKey']}
              >
                <Input
                  placeholder="请填写响应参数报文"
                  maxLength={200}
                  style={{ width: '220px' }}
                />
              </FormItem>
            </div>
          </Form>
        </div>
      </Modal>

      <SubTestModal cref={testModalRef}></SubTestModal>
    </>
  );
};

export default InfoModal;
