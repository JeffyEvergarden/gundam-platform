import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import ProTable from '@ant-design/pro-table';
import { Modal } from 'antd';
import { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import { useSessionList } from './model';

export default (props: any) => {
  const { visible, onCancel, modalData } = props;
  const { getSessionList } = useSessionList();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { channelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
  }));

  const chatRecordModalRef = useRef<any>({});
  const actionRef = useRef<any>();

  useEffect(() => {
    visible && actionRef?.current?.reloadAndRest();
  }, [visible, modalData]);

  const sessionList = async (payload: any) => {
    let params = {
      page: payload.current,
      pageSize: payload.pageSize,
      robotId: info.id,
      unknownId: modalData?.id,
    };

    let res = await getSessionList(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  const columns: any = [
    {
      dataIndex: 'question',
      title: '客户问题',
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'createTime',
      title: '时间',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      dataIndex: 'channelCode',
      title: '渠道',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return (
          <span>{channelList?.find((item: any) => item.value == r.channelCode)?.label || ''}</span>
        );
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

  const exportList = () => {};

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'会话明细'}
      footer={null}
      width={600}
      wrapClassName={styles.sessionListModal}
    >
      <ProTable
        rowKey={(record: any) => record.id}
        headerTitle={false}
        // toolBarRender={() => [
        //   <Button key="exportBtn" onClick={exportList}>
        //     导出
        //   </Button>,
        // ]}
        options={false}
        bordered
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        search={false}
        columns={columns}
        request={async (params = {}) => {
          return sessionList(params);
        }}
      />
      <ChatRecordModal cref={chatRecordModalRef} pageType={'unknownQuestion'} />
    </Modal>
  );
};
