import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Input, InputNumber, message } from 'antd';

const GlobalVarModal: React.FC<any> = (props: any) => {
  const { cref, onConfirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [insertFormList, setInsertFormList] = useState<any>('');

  const [millisecond, setMillisecond] = useState<any>('');

  useImperativeHandle(cref, () => ({
    open: (val: any[], index: any) => {
      console.log(index);

      setMillisecond('');
      setInsertFormList(index);
      setVisible(true);
    },
    close: () => {
      setInsertFormList(null);
      setVisible(false);
    },
  }));

  const submit = () => {
    if (!millisecond) {
      message.warning('请输入停顿时长');
      return;
    }
    if (insertFormList == 0 || insertFormList) {
      console.log(insertFormList);

      onConfirm?.(millisecond, insertFormList);
    } else {
      onConfirm?.(millisecond);
    }

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
          min={1}
          max={10000}
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
