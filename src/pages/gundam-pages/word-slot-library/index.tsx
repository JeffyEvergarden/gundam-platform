import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Space, Popconfirm } from 'antd';
import { wordSlotTableList, soltTableFakeData } from './comps/config';
import OperateSlotModal from './comps/operateSlotModal';
import RobotChatModal from './robotManage';

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const [operModalVisible, handleOperModalVisible] = useState<boolean>(false);
  const [operModalData, handleOperModalData] = useState<any>({});
  const [operModalTitle, handleOperModalTitle] = useState<string>('');

  useEffect(() => {}, []);

  const getInitTable = async (p?: any) => {
    const [pageData] = p;
    let data = [];
    try {
      // const res =
      return {
        data: soltTableFakeData,
        total: 10,
        current: pageData.current || 1,
        pageSize: pageData.pageSize,
      };
    } catch {
      return {
        data: [],
        total: 10,
        current: pageData.current || 1,
        pageSize: pageData.pageSize,
      };
    }
  };

  const operateSlotSuccess = () => {
    handleOperModalVisible(false);
  };

  const operateSlotCancel = () => {
    handleOperModalVisible(false);
  };

  const operate = (data: any, type: string) => {
    handleOperModalVisible(true);
    handleOperModalData(data);
    handleOperModalTitle(type);
  };

  const deleteSlot = (data: any) => {};

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

  const [robotChatModalVisible, handleRobotChatModalVisible] = useState<boolean>(false);

  const jumpToRobotChat = () => {
    handleRobotChatModalVisible(true);
  };

  const closeRobotModal = () => {
    handleRobotChatModalVisible(false);
  };

  return (
    <React.Fragment>
      <RobotChatModal visible={robotChatModalVisible} closeModal={closeRobotModal} />
      {/* <ProTable
        headerTitle={
          <Space>
            <Button onClick={() => operate({}, 'add')}>新增词槽</Button>
            <Button onClick={jumpToRobotChat}>机器人模拟</Button>
          </Space>
        }
        rowKey={(record) => Math.random()}
        columns={[...wordSlotTableList, operationList]}
        options={false}
        search={false}
        request={async (...params) => {
          return getInitTable(params);
        }}
      /> */}

      <OperateSlotModal
        visible={operModalVisible}
        title={operModalTitle}
        modalData={operModalData}
        onSubmit={operateSlotSuccess}
        onCancel={operateSlotCancel}
      />
    </React.Fragment>
  );
};

export default DetailPages;
