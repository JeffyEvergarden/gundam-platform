import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { useModel } from 'umi';

const LabelSelectModal: React.FC<any> = (props: any) => {
  const { cref, confirm, list, type = 'radio' } = props;

  const { labelList } = useModel('gundam' as any, (model: any) => ({
    labelList: model.labelList,
  }));

  const [visible, setVisible] = useState<boolean>(false);
  // 页码
  const [current, setCurrent] = useState<number>(1);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);

  const [selectRow, setSelectRow] = useState<any>(null);

  const onChange = (val: any) => {
    setCurrent(val);
  };

  const tableList: any[] = useMemo(() => {
    return labelList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [labelList]);

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
      title: '标签名称',
      dataIndex: 'actionLabel',
      width: 200,
    },
    {
      title: '标签描述',
      dataIndex: 'labelDesc',
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
      title: '创建者',
      dataIndex: 'creator',
      width: 180,
    },
  ];

  useImperativeHandle(cref, () => ({
    open: (val: any[]) => {
      setCurrent(1);
      setSelectedRowKeys(val || []);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    let list: any = tableList
      .filter((item: any) => {
        return selectedRowKeys.includes(item.actionLabel);
      })
      .map((item: any) => item.actionLabel);
    confirm?.(list);
    setVisible(false);
  };

  return (
    <Modal
      width={700}
      title={'选择标签'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['table-box']}>
        <Table
          rowSelection={{
            type: type === 'radio' ? 'radio' : 'checkbox',
            ...rowSelection,
            selectedRowKeys,
          }}
          size="small"
          pagination={{ current, onChange }}
          dataSource={tableList}
          columns={columns}
          rowKey="actionLabel"
          // loading={tableLoading}
        />
      </div>
    </Modal>
  );
};

export default LabelSelectModal;
