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
  Checkbox,
} from 'antd';
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
  const { cref, confirm, loading, list } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [originInfo, setOriginInfo] = useState<any>({});

  const submit = async () => {
    const values = await form.validateFields();
    const roles = values.roles || [];
    const rolesDetail = list.map((item: any) => {
      return roles.includes(item.id);
    });
    let obj: any = {
      _originInfo: originInfo,
      form: {
        ...values,
        rolesDetail,
      },
    };
    // setVisible(false);
    confirm?.(obj);
    return obj;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      console.log(row);
      setOriginInfo(row);
      let keys = row.roles?.map?.((item: any) => item.id) || [];
      form.setFieldsValue({
        roles: keys,
      });
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  return (
    <Modal
      width={680}
      title={'设置用户权限'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']}>
        <Form form={form}>
          {/* 用户权限 */}
          <FormItem name="roles" style={{ width: '660px' }}>
            <Checkbox.Group>
              <div className={style['desc']}>
                {list.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <Checkbox value={item.id}>
                        <div className={style['desc_block']}>{item.roleName}</div>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </Checkbox.Group>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default InfoModal;
