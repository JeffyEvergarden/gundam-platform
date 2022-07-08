import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useRoleModel } from './model';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import config from '@/config/index';
import style from './style.less';

// 机器人列表
const RoleManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { roleList, getRoleList, tableLoading } = useRoleModel();

  const goToEdit = (row: any) => {
    const roleId = row.id;
    history.push(`/users/roleManagement/edit?roleId=${roleId}`);
  };

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const columns: any[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入角色名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '用户数',
      dataIndex: 'roleNum',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 130,
      search: false,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                console.log(row);
                goToEdit(row);
              }}
              style={{ marginRight: '6px' }}
            >
              编辑
            </Button>

            <Button
              type="link"
              onClick={() => {
                // goToEdit(row);
              }}
              className={style['btn-success']}
              style={{ marginRight: '6px' }}
            >
              查看用户
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
    getRoleList();
  }, []);

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getRoleList({ page: params.current, ...params });
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              modalRef.current?.open?.();
            }}
          >
            新建角色
          </Button>,
        ]}
      />
    </div>
  );
};

export default RoleManagement;
