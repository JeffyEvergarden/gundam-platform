import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useTableModel } from './model';
import { Table, Button, Tooltip } from 'antd';
import {} from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './style.less';

// 机器人列表
const UserManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { tableList, getTableList, tableLoading } = useTableModel();

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const goToNewSystem = () => {
    history.push('/gundamPages');
  };

  const columns: any[] = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '部门',
      dataIndex: 'departName',
      width: 200,
    },
    {
      title: '账号',
      dataIndex: 'account',
      width: 200,
    },
    {
      title: '角色名称',
      dataIndex: 'roles',
      ellipsis: true,
      width: 200,
      render: (val: any, row: any) => {
        if (Array.isArray(val)) {
          const title: any = val.map((item: any) => item.name).join('、');
          return <Tooltip title={title}>{title}</Tooltip>;
        } else {
          return '';
        }
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
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
              编辑权限
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
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getTableList({ page: params.current, ...params });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="index"
        search={{
          labelWidth: 'auto',
          // optionRender: false,
          // collapsed: false,
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          // 查询参数转化
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle=""
        toolBarRender={() => []}
      />
    </div>
  );
};

export default UserManagement;
