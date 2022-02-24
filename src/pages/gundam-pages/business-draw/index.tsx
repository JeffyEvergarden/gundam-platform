import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';

import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { businessTableColumnsList } from './config';
import { Button, message, Space } from 'antd';
import { useTableModel } from './model';
import OperateFlowModal from './comps/operateFlowModal';
import { InfoCircleFilled } from '_@ant-design_icons@4.7.0@@ant-design/icons';

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [loading, handleLoading] = useState<boolean>(false);

  const [operFlowVisible, handleOperFlowVisible] = useState<boolean>(false); // 新增、编辑 弹窗框是否可见
  const [operFlowTitle, handleOperFlowTitle] = useState<string>('');
  const [operFlowData, handleOperFlowData] = useState<any>({}); //

  const { getFlowTableList, deleteFlowData } = useTableModel(); // 接口 mock
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));
  const getTables = async (p?: any) => {
    const [pageData] = p;
    let data: any = [];
    let params = {
      occurTime: '',
      page: pageData.current,
      ...pageData,
    };
    delete params.current;
    let res: any;
    handleLoading(true);
    res = await getFlowTableList(params);
    console.log(res);
    try {
      return {
        data: res?.datas || data,
        total: res?.totalSize,
        current: pageData?.current,
        pageSize: pageData?.pageSize,
      };
    } catch {
      return {
        data: [],
        total: 1,
        current: pageData?.current,
        pageSize: pageData?.pageSize,
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

  const operateColumn = {
    title: '操作',
    dataIndex: 'operate',
    search: false,
    render: (text: any, record: any) => (
      <Space>
        <a onClick={() => operateBusiness(record, 'edit')}>编辑</a>
        <a>配置</a>
        <a onClick={() => deleteFlowFunc(record)}>删除</a>
      </Space>
    ),
  };

  // 新增、编辑 弹窗框 传递的方法
  const operateFunc = (type: string) => {
    handleOperFlowVisible(false);
  };

  const deleteFlowFunc = async (data: any) => {
    let params = {
      occurTime: '',
      id: data.id,
    };
    const res: any = await deleteFlowData(params);
    message.info(res?.resultDesc);
  };

  return (
    <React.Fragment>
      <ProTable<any>
        loading={loading}
        headerTitle={'业务流程管理'}
        rowKey={(record) => record?.id}
        columns={[...businessTableColumnsList, operateColumn]}
        actionRef={actionRef}
        style={{ backgroundColor: 'white' }}
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => operateBusiness({}, 'add')}>
            新增业务流程
          </Button>,
        ]}
        search={{
          // defaultCollapsed: false,
          labelWidth: 'auto',
        }}
        request={async (...params) => {
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
