import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';
import RulesConfig from '../child/rules-config';

const RuleModal: React.FC<any> = (props: any) => {
  const { cref, onConfirm, wishList } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (val: any[]) => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    console.log(form.getFieldsValue());
    console.log(form.validateFields());
    onConfirm?.();
    setVisible(false);
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
        <RulesConfig form={form} wishList={wishList} />
      </div>
    </Modal>
  );
};

export default RuleModal;
