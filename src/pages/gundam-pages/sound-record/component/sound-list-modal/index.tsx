import { Modal } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import TablePage from '../tablePage';

const SoundListModal: React.FC = (props: any) => {
  const { cref, confirm } = props;
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState<any>(false);

  useImperativeHandle(cref, () => ({
    open: (list: any) => {
      // tableRef?.current?.refresh();
      tableRef?.current?.setSelectedRowKeys(list.map((item: any) => item.id) || []);
      tableRef?.current?.setSelectRow(list || []);
      setVisible(true);
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
        <TablePage cref={tableRef} activeKey={1} select={true}></TablePage>
      </div>
    </Modal>
  );
};

export default SoundListModal;
