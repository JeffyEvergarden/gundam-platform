import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useTableModel } from './model';
import { Table, Button } from 'antd';
import {} from 'antd';
import style from './style.less';

// 机器人列表
const MachineManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { tableList, getTableList, tableLoading } = useTableModel();

  // 分页相关 ---
  const [current, setCurrent] = useState<number>(1);

  const onChange = (val: number) => {
    setCurrent(val);
  };

  const goToNewSystem = () => {
    history.push('/gundamPages');
  };

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '缩略图',
      dataIndex: 'icon',
      width: 120,
      render: (val: any, row: any) => {
        if (!row.icon) {
          return null;
        } else {
          return <img src={row.icon} className={style['icon']} alt="无法识别" />;
        }
      },
    },
    {
      title: '链接名称',
      dataIndex: 'url',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 130,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                goToNewSystem();
              }}
              style={{ marginRight: '6px' }}
            >
              编辑
            </Button>
            <Button type="link" danger onClick={() => {}}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getTableList();
  }, []);

  return (
    <div className={style['machine-page']}>
      <Table
        pagination={{ current, onChange }}
        dataSource={tableList}
        columns={columns}
        rowKey="index"
        loading={tableLoading}
      />
    </div>
  );
};

export default MachineManagement;
