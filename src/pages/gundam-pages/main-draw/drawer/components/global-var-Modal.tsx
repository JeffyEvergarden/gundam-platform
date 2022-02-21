import { useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from '@/.umi/plugin-model/useModel';

const GlobalVarModal: React.FC<any> = (props: any) => {
  const { onConfirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(1);

  const onChange = (val: any) => {
    setCurrent(val);
  };

  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList || [],
  }));

  const columns: any[] = [
    {
      title: '变量值',
      dataIndex: '',
    },
  ];

  const openModal = () => {
    setVisible(false);
  };

  const submit = () => {};

  return (
    <Modal
      width={700}
      title={'选择变量'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['table-box']}>
        <Table
          pagination={{ current, onChange }}
          dataSource={globalVarList}
          columns={columns}
          rowKey="index"
          // loading={tableLoading}
        />
      </div>
    </Modal>
  );
};

export default GlobalVarModal;
