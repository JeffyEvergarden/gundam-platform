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
} from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import { getInterfaceDetail } from '../../../model/api';
import ProTable from '@ant-design/pro-table';

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

  const [reqList, setReqList] = useState<any>([]);
  const [resList, setResList] = useState<any>([]);

  const columns: any = [
    {
      title: '参数名称',
      dataIndex: 'paramName',
      search: false,
    },
    {
      title: '参数ID',
      dataIndex: 'paramKey',
      search: false,
    },
  ];

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

  const getDetail = async (row: any) => {
    let params = {
      interfaceId: row.id,
      paramType: null,
    };
    await getInterfaceDetail(params).then((res) => {
      console.log(res);
      setReqList(
        res?.data?.filter((item: any) => {
          return item?.paramType == 0;
        }),
      );
      setResList(
        res?.data?.filter((item: any) => {
          return item?.paramType == 1;
        }),
      );
      form.setFieldsValue({ ...res?.data?.[0], ...row });
    });
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      console.log(row);
      if (!row?.id) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        console.log(row);
        getDetail(row);
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
      title={(openType === 'new' ? '添加新' : '查看') + '接口配置'}
      visible={visible}
      onCancel={() => setVisible(false)}
      // okText={null}
      // onOk={submit}
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          取消
        </Button>,
      ]}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '55px' }}>
        <Form form={form} style={{ width: '480px' }}>
          {/* 接口名称 */}
          <FormItem
            rules={[
              { required: true, message: '请填写接口名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="interfaceName"
            label="接口名称"
            style={{ width: '480px' }}
          >
            <Input placeholder="请填写接口名称" {...extra} maxLength={150} />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请填写URL' }]}
            name="interfaceUrl"
            label="URL"
            style={{ width: '480px' }}
          >
            <Input placeholder="请填写URL" {...extra} maxLength={200} />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请选择接口类型' }]}
            name="interfaceType"
            label="接口类型"
            style={{ width: '480px' }}
          >
            <Radio.Group defaultValue={0}>
              <Radio value={'post'}>post</Radio>
              <Radio value={'get'}>get</Radio>
            </Radio.Group>
          </FormItem>

          <Divider plain style={{ margin: '5px 0' }}>
            入参管理
          </Divider>

          <ProTable
            dataSource={reqList}
            columns={columns}
            search={false}
            toolBarRender={false}
            pagination={false}
            rowKey={(record: any) => record.id}
          ></ProTable>

          <Divider plain>出参管理</Divider>
          <ProTable
            dataSource={resList}
            columns={columns}
            search={false}
            toolBarRender={false}
            pagination={false}
            rowKey={(record: any) => record.id}
          ></ProTable>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
