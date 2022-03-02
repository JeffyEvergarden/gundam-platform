import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';
import RulesConfig from '../child/rules-config';

const RuleModal: React.FC<any> = (props: any) => {
  const { cref, confirm, wishList, wordSlotList } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (info: any) => {
      setVisible(true);
      form.resetFields();
      form.setFieldsValue(info);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = async () => {
    try {
      let values: any = await form.validateFields();
      console.log(values);
      confirm?.(
        values?.list?.map((item: any) => {
          return item?.ruleList || [];
        }) || [],
      );
      setVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      width={900}
      title={'添加规则'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['form-box']}>
        <RulesConfig form={form} wishList={wishList} wordSlotList={wordSlotList} />
      </div>
    </Modal>
  );
};

export default RuleModal;
