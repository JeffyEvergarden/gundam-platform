import { useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import { Drawer, Form, Input, Select, Button, Tag, Table, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../style.less';
import LabelSelectModal from './label-select-modal';
import { values } from 'lodash';
import WordSlotModal from './word-slot-modal';

const { Option } = Select;

const WordSlotTable: React.FC<any> = (props: any) => {
  const { value, onChange, list } = props;

  const [num, setNum] = useState<number>(1);

  const modalRef = useRef<any>(null);

  const confirm = (val: any) => {
    onChange(val);
  };

  const openEditModal = () => {
    let vals: any = value || [];
    (modalRef.current as any).open(
      vals.map((item: any) => {
        return item.id;
      }),
    );
  };

  const computeValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((item: any, i: number) => {
        return {
          ...item,
          index: i + 1,
        };
      });
    } else {
      return [];
    }
  }, [value]);

  const columns: any[] = [
    {
      title: '词槽名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
    },
    {
      title: '词槽描述',
      dataIndex: 'label',
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
      title: '词槽必填',
      dataIndex: 'desc',
      width: 80,
    },
    {
      title: '澄清话术',
      dataIndex: 'desc',
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
      title: '结束话术',
      dataIndex: 'desc',
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
      title: '澄清顺序',
      dataIndex: 'index',
      width: 60,
    },
    {
      title: '操作',
      dataIndex: 'index',
      fixed: 'right',
      width: 80,
      render: (val: any, row: any, index: number) => {
        return (
          <div>
            <Button type="link" size="small">
              上移
            </Button>
            <Button type="link" size="small">
              下移
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles['table-box']}>
      <div className={styles['zy-row']} style={{ padding: '10px 0' }}>
        <div className={styles['left']}>设置关联词槽</div>
        <Button type="link" size="small" icon={<PlusOutlined />} onClick={openEditModal}>
          新增词槽
        </Button>
      </div>
      <Table
        size="small"
        bordered={true}
        pagination={false}
        dataSource={computeValue}
        columns={columns}
        scroll={{ x: columns.length * 150 }}
        rowKey="index"
        locale={{
          emptyText: '暂无数据',
        }}
        // loading={tableLoading}
      />

      <WordSlotModal cref={modalRef} list={list} confirm={confirm} />
    </div>
  );
};

export default WordSlotTable;
