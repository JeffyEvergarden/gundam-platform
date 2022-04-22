import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';
import { wordSlotSourceMap } from '../const';

const WordSlotSelectModal: React.FC<any> = (props: any) => {
  const { cref, onConfirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(1);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);

  const [selectRow, setSelectRow] = useState<any>(null);

  const onChange = (val: any) => {
    setCurrent(val);
  };

  const { wordSlotList } = useModel('drawer' as any, (model: any) => ({
    wordSlotList: model._wordSlotList || [],
  }));

  const tableList: any[] = useMemo(() => {
    return wordSlotList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [wordSlotList]);

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
      title: '词槽ID',
      dataIndex: 'slot',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '词槽名称',
      dataIndex: 'slotName',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '词槽描述',
      dataIndex: 'slotDesc',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (val: any) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '来源',
      dataIndex: 'slotSource',
      width: 90,
      ellipsis: {
        showTitle: false,
      },
      render: (val: any) => {
        return wordSlotSourceMap[val] || '';
      },
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
      width={750}
      title={'选择词槽'}
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

export default WordSlotSelectModal;
