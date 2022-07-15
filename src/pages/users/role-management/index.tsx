import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useRoleModel } from './model';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import config from '@/config/index';
import style from './style.less';
import RoleModal from './components/role-modal';
import AuthModal from './components/auth-modal';
import { addRoleInfo } from './model/api';

// 机器人列表
const RoleManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { roleList, getRoleList, tableLoading, addRole, opLoading, updateRole } = useRoleModel();

  const goToEdit = (row: any) => {
    const roleId = row.code;
    history.push(`/users/roleManagement/edit?roleCode=${roleId}&name=${row.name}`);
  };

  const goToUsers = (row: any) => {
    const roleId = row.code;
    history.push(`/users/userManagement?roleCode=${roleId}`);
  };

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const drawerRef = useRef<any>({});

  const openEditModal = (row: any) => {
    (modalRef.current as any)?.open(row);
  };

  const { getRole, updateAuth, opLoading: roleOpLoading } = useRoleModel();

  const openAuthModal = async (row: any) => {
    if (roleOpLoading) {
      return;
    }
    const roleId = row.code;
    let res: any = await getRole({ roleCode: roleId });

    let selectKey: any[] = Array.isArray(res) ? res : [];
    selectKey = selectKey?.map((item: any) => {
      return item.operationCode;
    });

    (drawerRef.current as any)?.open({
      ...row,
      selectKey,
    });
  };

  const onConfirmAuth = async (obj: any) => {
    let value = obj.value || [];

    let submitObj = {
      root: value.map((item: any) => {
        return {
          operationCode: item,
          roleCode: obj.code,
        };
      }),
    };
    let res = await updateAuth(submitObj);
    if (res) {
      // 操作成功返回列表
      drawerRef.current?.close?.();
      (tableRef.current as any).reload();
    }
  };

  const columns: any[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入角色名称',
      },
      ellipsis: true,
      width: 200,
    },
    // {
    //   title: '角色描述',
    //   dataIndex: 'roleDesc',
    //   search: false,
    //   width: 200,
    //   ellipsis: true,
    //   render: (val: any, row: any) => {
    //     return val;
    //   },
    // },
    {
      title: '用户数',
      dataIndex: 'userCount',
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
      width: 120,
      search: false,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            {/* <Button
              type="text"
              onClick={() => {
                console.log(row);
                openEditModal(row);
              }}
              style={{ marginRight: '6px' }}
            >
              编辑
            </Button> */}

            <Button
              type="text"
              onClick={() => {
                openAuthModal(row);
              }}
            >
              权限设置
            </Button>

            <Button
              type="link"
              onClick={() => {
                // console.log(row);
                goToEdit(row);
              }}
              style={{ marginRight: '6px' }}
            >
              详情设置
            </Button>

            <Button
              type="link"
              onClick={() => {
                goToUsers(row);
              }}
              className={style['btn-success']}
              style={{ marginRight: '6px' }}
            >
              查看用户
            </Button>
          </div>
        );
      },
    },
  ];

  const onConfirm = async (row: any) => {
    console.log(row);
    let res: any = false;
    if (row._openType === 'new') {
      res = await addRole({
        ...row.form,
      });
    } else if (row._openType === 'edit') {
      const roleId = row?._originInfo?.id;
      if (!roleId) {
        message.warning('获取不到角色ID');
        return;
      }
      res = await updateRole({
        id: roleId,
        ...row.form,
      });
    }
    if (res) {
      (modalRef.current as any).close();
      (tableRef.current as any).reload();
    }
  };

  useEffect(() => {
    (tableRef.current as any).reload();
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
          // <Button
          //   key="button"
          //   icon={<PlusOutlined />}
          //   type="primary"
          //   onClick={() => {
          //     (modalRef.current as any)?.open({});
          //   }}
          // >
          //   新建角色
          // </Button>,
        ]}
      />

      <RoleModal cref={modalRef} confirm={onConfirm} loading={opLoading}></RoleModal>

      <AuthModal cref={drawerRef} confirm={onConfirmAuth} loading={roleOpLoading} />
    </div>
  );
};

export default RoleManagement;
