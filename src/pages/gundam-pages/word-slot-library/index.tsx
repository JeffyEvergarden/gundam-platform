import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Space, Popconfirm, message } from 'antd';
import { wordSlotTableList } from './comps/config';
import OperateSlotModal from './comps/operateSlotModal';
import { useTableModel } from './model';

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [operModalVisible, handleOperModalVisible] = useState<boolean>(false);
  const [operModalData, handleOperModalData] = useState<any>({});
  const [operModalTitle, handleOperModalTitle] = useState<string>('');

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));
  const { getWordSlotTable, deleteWordSlot } = useTableModel();

  const getInitTable = async (p?: any) => {
    let newData = new Date().toLocaleString();
    let occurTime = newData.replace(/\//g, '-');
    const [pageData] = p;
    let data: any = [];
    try {
      let params = {
        robotId: info.id,
        occurTime,
        page: pageData?.current,
        ...pageData,
      };
      delete params?.current;
      const res = await getWordSlotTable(params);
      console.log(params, res);
      return {
        data: res?.data || data,
        total: 10,
        current: pageData.current || 1,
        pageSize: pageData.pageSize,
      };
    } catch {
      return {
        data: data,
        total: 10,
        current: pageData.current || 1,
        pageSize: pageData.pageSize,
      };
    }
  };

  const operateSlotSuccess = () => {
    handleOperModalVisible(false);
    refreshTable();
  };

  const operateSlotCancel = () => {
    handleOperModalVisible(false);
    refreshTable();
  };

  const operate = (data: any, type: string) => {
    handleOperModalVisible(true);
    handleOperModalData(data);
    handleOperModalTitle(type);
  };

  const deleteSlot = async (data: any) => {
    const res: any = await deleteWordSlot({ robot: info.id, id: data.id });
    message.info(res?.resultDesc);
    refreshTable();
  };

  const operationList = {
    dataIndex: 'operation',
    title: '操作',
    render: (text: any, record: any) => {
      return (
        <Space>
          <a onClick={() => operate(record, 'edit')}>编辑</a>
          <Popconfirm
            title="确认删除该条词槽吗?"
            okText="是"
            cancelText="否"
            onCancel={() => {}}
            onConfirm={() => deleteSlot(record)}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      );
    },
  };

  const refreshTable = () => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  };

  return (
    <React.Fragment>
      <ProTable
        headerTitle={
          <Space>
            <Button onClick={() => operate({}, 'add')}>新增词槽</Button>
          </Space>
        }
        actionRef={actionRef}
        rowKey={(record) => Math.random()}
        columns={[...wordSlotTableList, operationList]}
        options={false}
        search={false}
        request={async (...params) => {
          return getInitTable(params);
        }}
      />

      <OperateSlotModal
        visible={operModalVisible}
        title={operModalTitle}
        modalData={{ ...operModalData, robotId: info.id }}
        onSubmit={operateSlotSuccess}
        onCancel={operateSlotCancel}
      />
    </React.Fragment>
  );
};

export default DetailPages;
