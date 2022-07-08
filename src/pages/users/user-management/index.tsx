import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useTableModel } from './model';
import { useRoleModel } from '../role-management/model';
import { Table, Button, Tooltip } from 'antd';
import {} from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './style.less';
import RoleModal from './role-modal';

// 机器人列表
const UserManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { tableList, getTableList, tableLoading, updateAuth } = useTableModel();

  const { roleList, getRoleList } = useRoleModel();

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const openAuthModal = (row: any) => {
    modalRef.current.open(row);
  };

  const onConfirm = async (obj: any) => {
    console.log(obj);
    let res = await updateAuth({
      id: obj._originInfo.id,
      roles: obj.form.roles,
    });
    if (res) {
      modalRef.current.close();
      tableRef.current.reload();
    }
  };
  const columns: any[] = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入用户姓名',
      },
    },
    {
      title: '部门',
      dataIndex: 'departName',
      width: 180,
      fieldProps: {
        placeholder: '请输入部门',
      },
    },
    {
      title: '账号',
      dataIndex: 'account',
      search: false,
      width: 200,
    },
    {
      title: '角色名称',
      dataIndex: 'roles',
      width: 200,
      search: false,
      render: (value: any, row: any) => {
        const val = row.roles || [];
        if (Array.isArray(val)) {
          const title: any = val.map((item: any) => item.name).join('、');
          return (
            <Tooltip title={title}>
              <div className={style['row_hide']}>{title}</div>
            </Tooltip>
          );
        } else {
          return '';
        }
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 130,
      search: false,
      fixed: 'right',
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                openAuthModal(row);
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
    tableRef.current.reload();
    getRoleList({
      page: 1,
      pageSize: 1000,
    });
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

      <RoleModal cref={modalRef} confirm={onConfirm} list={roleList} />
    </div>
  );
};

export default UserManagement;
