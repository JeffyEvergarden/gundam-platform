import { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GlobalVarModal from './global-var-Modal';
import styles from './style.less';
import { useModel } from '@/.umi/plugin-model/useModel';

const { Option } = Select;

const GlobalVarButton: React.FC<any> = (props: any) => {
  const { onConfirm } = props;

  const [num, setNum] = useState<number>(1);

  const modalRef = useRef<any>(null);

  const openModal = () => {
    (modalRef.current as any).open();
  };

  return (
    <>
      <Button type="link" icon={<PlusOutlined />} onClick={openModal}>
        选择变量
      </Button>

      <GlobalVarModal cref={modalRef}></GlobalVarModal>
    </>
  );
};

export default GlobalVarButton;
