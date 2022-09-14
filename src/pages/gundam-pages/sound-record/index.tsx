import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Tabs, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import AuditionModal from './component/auditionModal';
import ReplaceModal from './component/replaceModal';
import { useSoundModel } from './model';
import style from './style.less';

const { TabPane } = Tabs;

const SoundRecord: React.FC = (props: any) => {
  const [activeKey, setActiveKey] = useState('1');
  const tableRef = useRef<any>();
  const tableRef2 = useRef<any>();
  const tableRef3 = useRef<any>();
  const tableRef4 = useRef<any>();
  const auditionRef = useRef<any>();
  const replaceRef = useRef<any>();

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
      title: activeKey == '1' || activeKey == '3' ? '应用节点' : '应用FAQ',
      dataIndex: 'applyNames',
      fieldProps: {
        placeholder: activeKey == '1' || activeKey == '3' ? '请输入应用节点' : '请输入应用FAQ',
      },
      width: 200,
      ellipsis: true,
      render: (v: any, r: any, i: any) => {
        return (
          <div className={style['apply']}>
            <div>{`${1}.${r?.applyNames?.[0]}`}</div>
            <Tooltip
              title={
                <div key={i}>
                  {r?.applyNames.map((item: any, index: any) => (
                    <div key={index + item}>{`${index + 1}.${item}`}</div>
                  ))}
                </div>
              }
            >
              <span style={{ color: '#1890ff' }}>查看更多</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '转写文本',
      dataIndex: 'text',
      fieldProps: {
        placeholder: '请输入转写文本',
      },
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
                auditionRef.current?.open?.(r);
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
                replaceRef.current?.open?.(r, 'edit');
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

  const refresh = () => {
    if (activeKey == '1') {
      (tableRef?.current as any)?.reload();
    }
    if (activeKey == '2') {
      (tableRef2?.current as any)?.reload();
    }
    if (activeKey == '3') {
      (tableRef3?.current as any)?.reload();
    }
    if (activeKey == '4') {
      (tableRef4?.current as any)?.reload();
    }
  };

  useEffect(() => {
    refresh();
  }, [activeKey]);

  return (
    <div className="list-page">
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
                type: 1,
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
            toolBarRender={() => [
              <Button
                key="button"
                type="primary"
                onClick={() => {
                  replaceRef.current?.open?.({}, 'add');
                }}
              >
                上传录音
              </Button>,
            ]}
          />
        </TabPane>
        <TabPane tab="FAQ录音" key="2">
          <ProTable<any>
            columns={columns}
            actionRef={tableRef2}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              return getTableList({
                robotId: info.id,
                page: params.current,
                ...params,
                type: 2,
              });
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
            toolBarRender={() => [
              <Button
                key="button"
                type="primary"
                onClick={() => {
                  replaceRef.current?.open?.({}, 'add');
                }}
              >
                上传录音
              </Button>,
            ]}
          />
        </TabPane>
        <TabPane tab="节点-TTS" key="3">
          <ProTable<any>
            columns={columns}
            actionRef={tableRef3}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              return getTableList({
                robotId: info.id,
                page: params.current,
                ...params,
                type: 3,
              });
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
            toolBarRender={() => [
              <Button
                key="button"
                type="primary"
                onClick={() => {
                  replaceRef.current?.open?.({}, 'add');
                }}
              >
                上传录音
              </Button>,
            ]}
          />
        </TabPane>
        <TabPane tab="FAQ-TTS" key="4">
          <ProTable<any>
            columns={columns}
            actionRef={tableRef4}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              return getTableList({
                robotId: info.id,
                page: params.current,
                ...params,
                type: 4,
              });
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
            toolBarRender={() => [
              <Button
                key="button"
                type="primary"
                onClick={() => {
                  replaceRef.current?.open?.({}, 'add');
                }}
              >
                上传录音
              </Button>,
            ]}
          />
        </TabPane>
      </Tabs>

      <AuditionModal cref={auditionRef}></AuditionModal>
      <ReplaceModal cref={replaceRef} refresh={refresh}></ReplaceModal>
    </div>
  );
};

export default SoundRecord;
