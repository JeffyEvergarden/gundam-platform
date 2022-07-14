import { useEffect, useRef, useState } from 'react';
import { Modal, Space } from 'antd';
import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import ProTable from '@ant-design/pro-table';
import { channelMap } from '@/pages/gundam-pages/FAQ/const';

export const CODE = {
  ...channelMap,
};

export default (props: any) => {
  const { visible, onCancel } = props;

  const chatRecordModalRef = useRef<any>({});

  const sessionList = (payload: any) => {
    let res: any;
    return {
      data: res?.data?.list || [],
      total: res?.data?.total,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  const columns: any = [
    {
      dataIndex: 'message',
      title: '客户问题',
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'createTime',
      title: '时间',
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'channelCode',
      title: '渠道',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return <span>{CODE[r.channelCode]}</span>;
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return <a onClick={() => toRecord(r)}>会话记录</a>;
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'会话明细'}
      footer={null}
    >
      <ProTable
        rowKey={(record: any) => record.dayId}
        headerTitle={false}
        toolBarRender={false}
        bordered
        pagination={{
          pageSize: 10,
        }}
        search={false}
        columns={columns}
        request={async (params = {}) => {
          return sessionList(params);
        }}
      />
      <ChatRecordModal cref={chatRecordModalRef} />
    </Modal>
  );
};
