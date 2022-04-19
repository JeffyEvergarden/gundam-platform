import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';

import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { businessTableColumnsList } from './config';
import { Button, message, Space, Popconfirm } from 'antd';
import { useTableModel } from './model';
import OperateFlowModal from './comps/operateFlowModal';
import { InfoCircleFilled } from '@ant-design/icons';

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [loading, handleLoading] = useState<boolean>(false);

  const [operFlowVisible, handleOperFlowVisible] = useState<boolean>(false); // 新增、编辑 弹窗框是否可见
  const [operFlowTitle, handleOperFlowTitle] = useState<string>('');
  const [operFlowData, handleOperFlowData] = useState<any>({}); //

  const { getFlowTableList, deleteFlowData } = useTableModel(); // 接口 mock

  const { info, setBusinessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setBusinessFlowId: model.setBusinessFlowId,
  }));

  const getTables = async (p?: any) => {
    console.log(p);
    let params = {
      robotId: info?.id,
      page: p.current,
      ...p,
    };
    let res: any;
    handleLoading(true);
    res = await getFlowTableList(params);
    console.log(res);
    try {
      return {
        data: res?.data?.list || [],
        total: res?.data?.totalPage,
      };
    } catch {
      return {
        data: [],
        total: 1,
      };
    } finally {
      handleLoading(false);
    }
  };
  const operateBusiness = (data: any, type: string) => {
    handleOperFlowVisible(true);
    handleOperFlowTitle(type);
    handleOperFlowData(data);
  };

  const goToConfig = (record: any) => {
    localStorage.setItem('businessFlowId', record?.id || record?.flowId || '');
    sessionStorage.setItem('businessFlowId', record?.id || record?.flowId || '');
    setBusinessFlowId(record?.id || record?.flowId || '');
    setTimeout(() => {
      history.push('/gundamPages/businessDraw/detail');
    }, 300);
  };

  const operateColumn = {
    title: '操作',
    dataIndex: 'operate',
    search: false,
    fixed: 'right',
    render: (text: any, record: any) => (
      <Space>
        <a
          onClick={() => {
            operateBusiness(record, 'edit');
          }}
        >
          编辑
        </a>
        <a
          onClick={() => {
            goToConfig(record);
          }}
        >
          配置
        </a>
        <Popconfirm
          title="删除将不可恢复，确认删除？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            deleteFlowFunc(record);
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      </Space>
    ),
  };
  // 刷新列表
  const refreshTable = () => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  };

  // 新增、编辑 弹窗框 传递的方法
  const operateFunc = () => {
    handleOperFlowVisible(false);
    refreshTable();
  };

  const deleteFlowFunc = async (data: any) => {
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    let params = {
      occurTime: occurDay + ' ' + newTime,
      id: data.id,
      robotId: localStorage.getItem('robot_id'),
    };
    const res: any = await deleteFlowData(params);
    message.info(res?.resultDesc || '失败');
    if (res?.resultCode == '0000') {
      refreshTable();
    }
  };

  return (
    <React.Fragment>
      <ProTable<any>
        loading={loading}
        headerTitle={'业务流程管理'}
        rowKey={(record) => record?.id}
        columns={[...businessTableColumnsList, operateColumn]}
        actionRef={actionRef}
        scroll={{ x: businessTableColumnsList.length * 200 }}
        style={{ backgroundColor: 'white' }}
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => operateBusiness({}, 'add')}>
            新增业务流程
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
        search={{
          // defaultCollapsed: false,
          labelWidth: 'auto',
        }}
        request={async (params) => {
          return getTables(params);
        }}
      />

      <OperateFlowModal
        visible={operFlowVisible}
        title={operFlowTitle}
        modalData={{ ...operFlowData, robotId: info.id }}
        operateFunc={operateFunc}
      />
    </React.Fragment>
  );
};

export default DetailPages;
