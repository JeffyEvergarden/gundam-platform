import Tip from '@/components/Tip';
import ProTable from '@ant-design/pro-table';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useInterfaceModel } from '../model';

import { useInterfaceModel as useSubInterfaceModel } from './model';
import InfoModal from './components/infoModal';
import style from './style.less';

const InterfaceConfig: React.FC = (props: any) => {
  const { getTableList, configLoading } = useInterfaceModel();

  const { btLoading, deleteInterface } = useSubInterfaceModel();

  const interfaceTableRef = useRef<any>({});
  const interfaceModalRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const columns: any[] = [
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入接口名称',
      },

      width: 180,
      render: (val: any, row: any, index: number) => {
        return (
          <a
            type="link"
            onClick={() => {
              interfaceModalRef.current?.open?.(row);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: '接口URL',
      dataIndex: 'interfaceUrl',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '接口类型',
      dataIndex: 'interfaceType',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '接口描述',
      dataIndex: 'interfaceDesc',
      search: false,
      width: 200,
    },
    {
      title: '关联词槽数量',
      dataIndex: 'connectTimes',
      search: false,
      width: 200,
    },
    {
      title: '更新人',
      dataIndex: 'creator',
      search: false,
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 200,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  interfaceModalRef.current?.open?.(row);
                }}
              >
                编辑
              </Button>

              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={async () => {
                  if (btLoading) {
                    return;
                  }
                  let res = await deleteInterface({ id: row.id, robotId: info.id });
                  res && interfaceTableRef.current.reload();
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

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        columns={columns}
        actionRef={interfaceTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getTableList({
            robotId: info.id,
            page: params.current,
            ...params,
          });
          return {};
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-interface-list',
          persistenceType: 'localStorage',
        }}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 'auto',
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
        headerTitle={
          <>
            {'接口管理列表'}
            <Tip
              title={
                '查看可用的接口，词槽配置来自于接口时，传入特定变量或词槽，可以调用接口获取结果。接口列表不可修改，需要开发同事进行维护。'
              }
            />
          </>
        }
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              interfaceModalRef.current?.open?.();
            }}
          >
            新建
          </Button>,
        ]}
      />

      <InfoModal
        cref={interfaceModalRef}
        // confirm={confirmInfo}
        loading={configLoading}
        refresh={() => {
          interfaceTableRef?.current?.reload();
        }}
      />
    </div>
  );
};

export default InterfaceConfig;
