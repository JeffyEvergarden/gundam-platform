import { Modal } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import TablePage from '../tablePage';

const SoundListModal: React.FC<any> = (props: any) => {
  const { cref, confirm, type } = props;
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState<any>(false);
  const [activeKey, setActiveKey] = useState<any>(1);

  useImperativeHandle(cref, () => ({
    open: (list: any, num?: any) => {
      // tableRef?.current?.refresh();
      tableRef?.current?.setSelectedRowKeys(list.map((item: any) => item.id) || []);
      tableRef?.current?.setSelectRow(list || []);
      setVisible(true);
      setActiveKey(num || 1);
    },
  }));

  return (
    <Modal
      width={'80%'}
      title={'试听录音'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      onOk={() => {
        confirm(tableRef?.current?.getSelect() || []);
        setVisible(false);
      }}
      maskClosable={false}
    >
      <div className="list-page">
        <TablePage cref={tableRef} activeKey={activeKey} select={true} type={type}></TablePage>
      </div>
    </Modal>
  );
};

export default SoundListModal;
