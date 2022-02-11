import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, InputNumber, Select, Input, Upload, message } from 'antd';
import style from './style.less';
import Condition from '../Condition';

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
const LinkModal: React.FC<any> = (props: any) => {
  const { cref, type = 1, confirm, loading } = props;

  const [form] = Form.useForm();

  const [url, setUrl] = useState<string>('');

  const [visible, setVisible] = useState<boolean>(false);

  // const [loading, setLoading] = useState<boolean>(false);

  const [openType, setOpenType] = useState<'new' | 'edit'>('new');

  const [originInfo, setOriginInfo] = useState<any>({});

  // const fakelist = form.getFieldValue('icon');
  // console.log(fakelist);

  const beforeUpload = (file: any, files: any) => {
    console.log('输出图片', file, files);
    const fileSuffix = /.[^.]+$/.exec(file.name)?.[0].toLowerCase() || '';
    if (!validSuffixList.includes(fileSuffix)) {
      message.warning(`请上传后缀为${validSuffixList?.join('、')}的图片`);
      return Promise.reject();
    }

    return file;
    // 校验图片大小
    //return new Promise((resolve, reject) => {
    // if (width || height) {
    //   const image = new Image();
    //   image.src = window.URL.createObjectURL(file);
    //   image.onload = () => {
    //   };
    // }
    // resolve(file as Blob);
    // });
  };

  const setPic = async (...args: any[]) => {
    console.log('输出pic:', args);
    let res: any = args?.[0]?.file?.response?.data || {};
    console.log(res);
    setUrl(res.url || '');
  };

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      _originInfo: originInfo,
      _openType: openType,
      form: {
        ...values,
        icon: url,
      },
    };
    // setVisible(false);
    confirm?.(obj);
    return obj;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setUrl('');
      if (!row?.key && !row?.id) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        console.log(row);
        form.resetFields();
        setOpenType('edit');
        setOriginInfo(row);
        if (row.form) {
          form.setFieldsValue(row.form);
          setUrl(row?.form?.icon || row?.icon || '');
        } else {
          form.setFieldsValue(row);
          setUrl(row?.icon || '');
        }
        if (row?.icon) {
          setUrl(row.icon);
        }
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
      title={(openType === 'new' ? '添加新' : '编辑') + (type === 1 ? `模块` : `链接`)}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          <div className={style['icon-box']}>
            <div className={'ant-form-item-label'} style={{ paddingRight: '8px' }}>
              图标上传:
            </div>
            <Upload.Dragger
              name="file"
              action="/bdp/unifyportal/menuFile/add"
              maxCount={1}
              progress={{
                strokeColor: {
                  '0%': '#1890FF',
                  '100%': '#1890FF',
                },
                strokeWidth: 3,
                format: (percent) => `${parseFloat((percent as number).toFixed(2))}%`,
              }}
              multiple={false}
              beforeUpload={beforeUpload}
              onChange={setPic}
              style={{ width: '180px' }}
            >
              {!url && <div className={style['upload-box']}>上传图标 +</div>}
              {url && <img src={url} className={style['upload-box']} alt="上传图片"></img>}
            </Upload.Dragger>
          </div>

          {/* 链接名称 */}
          <FormItem
            rules={[{ required: true, message: '请填写链接名称' }]}
            name="name"
            label="链接名称"
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写链接名称" {...extra} />
          </FormItem>

          <Condition r-if={type !== 1}>
            {/* 链接路径 */}
            <FormItem
              rules={[{ required: true, message: '请填写链接路径' }]}
              name="url"
              label="链接路径"
              style={{ width: '360px' }}
            >
              <Input placeholder="请填写链接路径" {...extra} />
            </FormItem>
          </Condition>
          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请填写排位序列' }]}
            name="sort"
            label="排位序列"
            style={{ width: '360px' }}
          >
            <InputNumber
              min={0}
              placeholder="请填写排位序列,模块显示将以降序排列"
              style={{ width: '270px' }}
            />
          </FormItem>

          {/* 二级筛选 */}
          <Condition r-if={type !== 1}>
            <FormItem
              rules={[{ required: true, message: '请选择使用用户类型' }]}
              name="showType"
              label="用户类型"
              style={{ width: '360px' }}
            >
              <Select placeholder="请选择使用用户类型">
                {linkTypeList.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.value} opt={item}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Condition>
        </Form>
      </div>
    </Modal>
  );
};

export default LinkModal;
