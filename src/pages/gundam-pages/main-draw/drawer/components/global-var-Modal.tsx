import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';
import GlobalVarButton from './global-var-button';

const GlobalVarModal: React.FC<any> = (props: any) => {
  const { cref, onConfirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(1);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);

  const [selectRow, setSelectRow] = useState<any>(null);

  const onChange = (val: any) => {
    setCurrent(val);
  };

  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList || [],
  }));

  const tableList: any[] = useMemo(() => {
    return globalVarList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [globalVarList]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.name,
    }),
  };

  const columns: any[] = [
    {
      title: '变量值',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '变量名称',
      dataIndex: 'label',
      width: 200,
    },
    {
      title: '变量描述',
      dataIndex: 'desc',
    },
  ];

  useImperativeHandle(cref, () => ({
    open: (val: any[]) => {
      setCurrent(1);
      setSelectedRowKeys(val || null);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    onConfirm?.(selectRow);
    console.log(selectRow);
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
      <div className={style['table-box']}>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
            selectedRowKeys,
          }}
          size="small"
          pagination={{ current, onChange }}
          dataSource={tableList}
          columns={columns}
          rowKey="index"
          // loading={tableLoading}
        />
      </div>
    </Modal>
  );
};

export default GlobalVarModal;
