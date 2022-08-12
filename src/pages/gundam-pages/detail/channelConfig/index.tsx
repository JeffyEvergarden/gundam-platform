import Condition from '@/components/Condition';
import config from '@/config/index';
import useUpdateModel from '@/models';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useEffect, useRef } from 'react';
import { history, useAccess, useModel } from 'umi';
import style from '../style.less';

import InfoModal from './components/info-modal';
import { useChannelConfigModel } from '../model';

// 机器人列表
const ChannelConfig: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const {
    tableList,
    getChannelList,
    tableLoading,
    opLoading,
    addNewChannel,
    editChannel,
    deleteChannel,
  } = useChannelConfigModel();

  const access = useAccess();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const robotId = info?.id || '';

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const deleteRow = async (row: any) => {
    if (row?.status == 0) {
      message.warning('请先停用该机器人');
      return;
    }

    let params: any = {
      id: row.id,
      robotId,
    };
    let res: any = await deleteChannel(params);
    if (res) {
      tableRef.current.reload();
    }
  };

  const confirmInfo = async (info: any) => {
    let res: any = null;
    if (info._openType === 'new') {
      let params: any = {
        ...info?.form,
        robotId,
      };
      res = await addNewChannel(params);

      if (res === true) {
        modalRef.current?.close?.();
        tableRef.current.reload();
      }
    } else if (info._openType === 'edit') {
      let params: any = {
        id: info?._originInfo?.id,
        channelName: info?.form?.channelName,
        channelCode: info?.form?.channelCode,
        robotId,
      };
      res = await editChannel(params);
      if (res === true) {
        modalRef.current?.close?.();
        tableRef.current.reload();
      }
    }
  };

  const columns: any[] = [
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入渠道名称',
      },
      ellipsis: true,
      width: 300,
    },
    {
      title: '渠道code',
      dataIndex: 'channelCode',
      width: 300,
      ellipsis: true,
      fieldProps: {
        placeholder: '请输入渠道code',
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 180,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  modalRef.current?.open?.(row);
                }}
              >
                编辑
              </Button>

              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  deleteRow(row);
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        loading={tableLoading}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getChannelList({ ...params, page: 1, pageSize: 1000, current: 1, robotId });
        }}
        editable={{
          type: 'multiple',
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
            新建
          </Button>,
        ]}
      />

      <InfoModal cref={modalRef} confirm={confirmInfo} loading={opLoading} list={tableList} />
    </div>
  );
};

export default ChannelConfig;
