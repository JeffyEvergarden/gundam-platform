import { useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import { Drawer, Form, Input, Select, Button, Tag, Table, Tooltip } from 'antd';
import {
  PlusOutlined,
  AppstoreAddOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import styles from '../style.less';
import WordSlotModal from './word-slot-modal';

const { Option } = Select;

const WordSlotTable: React.FC<any> = (props: any) => {
  const { value, onChange, list } = props;

  const modalRef = useRef<any>(null);

  const [selectIndex, setSelectIndex] = useState<any>(-1);

  const confirm = (val: any) => {
    let list: any[] = Array.isArray(value) ? value : [];
    if (selectIndex >= 0) {
      list[selectIndex] = val;
      list = [...list];
    } else {
      list = [...list, val];
    }
    onChange?.(list);
  };

  const openEditModal = (item?: any, index: number = -1) => {
    console.log(index);
    console.log(item);

    if (index >= 0) {
      setSelectIndex(index);
    } else {
      setSelectIndex(-1);
    }
    (modalRef.current as any).open(item);
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

  const upPos = (index: number) => {
    if (index < 1) {
      return;
    }
    let list = Array.isArray(value) ? value : [];
    let tmp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = tmp;
    onChange?.([...list]);
  };

  const downPos = (index: number) => {
    if (index > computeValue.length - 2) {
      return;
    }
    let list = Array.isArray(value) ? value : [];
    let tmp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = tmp;
    onChange?.([...list]);
  };

  // 删除
  const remove = (index: number) => {
    let list = Array.isArray(value) ? value : [];
    list.splice(index, 1);
    onChange?.([...list]);
  };

  const columns: any[] = [
    {
      title: '词槽名称',
      dataIndex: 'slotName',
      fixed: 'left',
      width: 80,
    },
    {
      title: '词槽描述',
      dataIndex: 'slotDesc',
      width: 90,
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
      dataIndex: 'required',
      width: 70,
      render: (val: any) => {
        return val == '1' ? '是' : '否';
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 80,
      ellipsis: {
        showTitle: false,
      },
      render: (val: any) => val,
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 80,
      render: (val: any, row: any, index: number) => {
        return (
          <div>
            {index > 0 && (
              <Button
                type="link"
                icon={<ArrowUpOutlined />}
                size="small"
                onClick={() => {
                  upPos(index);
                }}
              ></Button>
            )}
            {index < computeValue.length - 1 && (
              <Button
                type="link"
                size="small"
                icon={<ArrowDownOutlined />}
                onClick={() => {
                  downPos(index);
                }}
              ></Button>
            )}

            <Button
              type="text"
              size="small"
              onClick={() => {
                openEditModal(row, index);
              }}
            >
              编辑
            </Button>

            <Button
              type="link"
              size="small"
              danger
              onClick={() => {
                remove(index);
              }}
            >
              删除
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
        <Button
          type="link"
          size="small"
          icon={<AppstoreAddOutlined />}
          onClick={() => {
            openEditModal({}, -1);
          }}
        >
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
