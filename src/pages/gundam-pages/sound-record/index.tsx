import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import { useSoundModel } from './model';

const { TabPane } = Tabs;

const SoundRecord: React.FC = (props: any) => {
  const [activeKey, setActiveKey] = useState('1');
  const tableRef = useRef();
  const tableRef2 = useRef();
  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { getTableList, loading, opLoading, tableList } = useSoundModel();

  const columns: any = [
    {
      title: '录音名称',
      dataIndex: 'name',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入录音名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: activeKey == '1' ? '应用节点' : '应用FAQ',
      dataIndex: 'applyNames',
      fieldProps: {
        placeholder: activeKey == '1' ? '请输入应用节点' : '请输入应用FAQ',
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: '转写文本',
      dataIndex: 'text',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      width: 200,
      render: (v: any, r: any, i: any) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                // labelModalRef.current?.open?.(row);
              }}
            >
              试听
            </Button>

            <Button
              type="link"
              onClick={() => {
                // labelModalRef.current?.open?.(row);
              }}
            >
              下载
            </Button>

            <Button
              type="link"
              onClick={() => {
                // labelModalRef.current?.open?.(row);
              }}
            >
              替换
            </Button>

            <Popconfirm
              title="删除将不可恢复，确认删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                // deleteRow(row);
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        style={{ width: '100%', backgroundColor: '#fff', paddingLeft: '10px', marginBottom: 0 }}
        onChange={setActiveKey}
        activeKey={activeKey}
      >
        <TabPane tab="流程节点录音" key="1">
          <ProTable<any>
            columns={columns}
            actionRef={tableRef}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              return getTableList({
                robotId: info.id,
                page: params.current,
                ...params,
              });
              // return {};
            }}
            editable={{
              type: 'multiple',
            }}
            columnsState={{
              persistenceKey: 'pro-table-machine-list',
              persistenceType: 'localStorage',
            }}
            rowKey="id"
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
            toolBarRender={() => []}
          />
        </TabPane>
        <TabPane tab="FAQ录音" key="2">
          <ProTable<any>
            columns={columns}
            actionRef={tableRef2}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              // return getList({
              //   source: 0,
              //   robotId: info.id,
              //   page: params.current,
              //   batchId: detailInfo?.batchId || history?.location?.query?.batchId,
              //   ...params,
              // });
              return {};
            }}
            editable={{
              type: 'multiple',
            }}
            columnsState={{
              persistenceKey: 'pro-table-machine-list',
              persistenceType: 'localStorage',
            }}
            rowKey="id"
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
            toolBarRender={() => []}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SoundRecord;
