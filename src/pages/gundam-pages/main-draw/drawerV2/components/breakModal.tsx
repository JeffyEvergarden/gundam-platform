import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Input, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';
import GlobalVarButton from './global-var-button';

const GlobalVarModal: React.FC<any> = (props: any) => {
  const { cref, onConfirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [millisecond, setMillisecond] = useState<any>('');

  useImperativeHandle(cref, () => ({
    open: (val: any[]) => {
      setMillisecond('');
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    if (!millisecond) {
      message.warning('请输入停顿时长');
      return;
    }
    onConfirm?.(millisecond);
    setVisible(false);
  };

  return (
    <Modal
      width={700}
      title={'选择变量'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '130px', marginLeft: '24px' }}>{'停顿时长(ms)'}：</span>
        <InputNumber
          style={{ width: '100%' }}
          step={1}
          precision={0}
          value={millisecond}
          onChange={(e: any) => {
            setMillisecond(e);
          }}
        />
      </div>
    </Modal>
  );
};

export default GlobalVarModal;
