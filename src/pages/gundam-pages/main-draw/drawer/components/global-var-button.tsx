import { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GlobalVarModal from './global-var-modal';
import styles from './style.less';
import { useModel } from '@/.umi/plugin-model/useModel';

const { Option } = Select;

const GlobalVarButton: React.FC<any> = (props: any) => {
  const { value, onChange, style, ...res } = props;

  const modalRef = useRef<any>(null);

  const openModal = () => {
    (modalRef.current as any).open();
  };

  const changeVal = (e: any) => {
    onChange(e.target.value);
  };

  const confirm = (val: any) => {
    let tmp: any = value || '';
    tmp = tmp + (val?.[0]?.name ? `\$\{${val[0].name}\}` : '');
    onChange(tmp);
  };

  return (
    <div className={styles['zy-row']}>
      <Input
        value={value}
        onChange={changeVal}
        placeholder={props.placeholder}
        style={style}
        {...res}
      />

      <Button type="link" icon={<PlusOutlined />} onClick={openModal}>
        选择变量
      </Button>

      <GlobalVarModal cref={modalRef} onConfirm={confirm}></GlobalVarModal>
    </div>
  );
};

export default GlobalVarButton;
