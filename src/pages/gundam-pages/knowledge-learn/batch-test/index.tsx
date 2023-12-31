import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { history, useModel } from 'umi';
import style from './style.less';

import Tip from '@/components/Tip';
import { useBatchModel } from '../model';
import TestPlanModal from './component/test-plan';

const TestPages: React.FC = (props: any) => {
  const { list, nextCheckTime, totalPage, getList, loading, deleteBatch } = useBatchModel();

  const batchTableRef = useRef<any>({});
  const batchModalRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const deleteRow = async (row: any) => {
    let params: any = {
      robotId: info.id,
      batchId: row.batchId,
    };
    let res: any = await deleteBatch(params);
    if (res) {
      batchTableRef.current.reload();
    }
  };

  const columns: any[] = [
    {
      title: '检测批次ID',
      dataIndex: 'batchId',
      fixed: 'left',
      search: false,
      ellipsis: true,
      width: 180,
    },
    {
      title: () => (
        <>
          {'相似阈值'}
          <Tip title="调用NLU模型，对机器人中的意图语料及FAQ标准问、相似问，两两进行相似度检测，返回得分大于”相似度阈值“且不归属于同一意图或FAQ的样本对。" />
        </>
      ),
      dataIndex: 'threshold',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: () => (
        <>
          {'不相似阈值'}
          <Tip title="调用NLU模型，对机器人中的意图语料及FAQ标准问、相似问，两两进行相似度检测，返回得分小于”相似度阈值“且归属于同一意图或FAQ的样本对。" />
        </>
      ),
      dataIndex: 'unThreshold',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '检测时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
    },
    {
      title: '检测耗时',
      dataIndex: 'formatCostTime',
      search: false,
      width: 200,
      // render: (val: any) => {
      //   if (val) {
      //     return val + 's';
      //   }
      //   return val;
      // },
    },
    {
      title: '样本总量',
      dataIndex: 'sampleTotal',
      search: false,
      width: 200,
    },
    {
      title: '异常样本量',
      dataIndex: 'abnormalSampleAmount',
      search: false,
      width: 200,
    },
    {
      title: '人工复核量',
      dataIndex: 'reviewAmount',
      search: false,
      width: 200,
    },

    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      // width: 130,
      render: (val: any, row: any, index: number) => {
        if (row.taskStatus == 2 || row.taskStatus == 4) {
          return (
            <div>
              <div style={{ display: 'flex' }}>
                <Button // 标签无法编辑
                  type="link"
                  onClick={() => {
                    history.push({
                      pathname: `/gundamPages/knowledgeLearn/batchTest/detailList`,
                      state: {
                        info: row,
                      },
                      search: `?batchId=${row.batchId ? row.batchId : '-'}`,
                    });
                    // history.push(`/gundamPages/knowledgeLearn/batchTest/detailList?id=${row.id}`);
                  }}
                  disabled={row.detailDelete == 1 ? true : false}
                >
                  查看明细
                </Button>

                <Popconfirm
                  title={() => {
                    return (
                      <div style={{ maxWidth: '200px' }}>
                        此操作只会删除批量检测结果的明细数据，不可找回，检测记录及统计结果数据依然会保留在检测列表中。
                      </div>
                    );
                  }}
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => {
                    deleteRow(row);
                  }}
                  disabled={row.detailDelete == 1 ? true : false}
                >
                  <Button type="link" danger disabled={row.detailDelete == 1 ? true : false}>
                    删除明细
                  </Button>
                </Popconfirm>
              </div>
            </div>
          );
        } else if (row.taskStatus == 1) {
          return <div className={style['btn']}>跑批中</div>;
        } else if (row.taskStatus == 0) {
          return <div className={style['btn']}>待跑批</div>;
        } else if (row.taskStatus == 3) {
          return <div className={style['btn']}>跑批失败</div>;
        }
      },
    },
  ];

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        columns={columns}
        actionRef={batchTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return getList({
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
        search={false}
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
            {`下次检测日期：${nextCheckTime}`}
            <Tip
              title={
                '在指定时间执行批量检测，包括相似检测和不相似检测，用于检测意图语料、FAQ标准问相似问中混淆的情况、并执行处理。'
              }
            />
          </>
        }
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              batchModalRef.current?.open?.('plan');
            }}
            style={{ margin: '4px 0' }}
          >
            检测计划
          </Button>,
          <Button
            key="button"
            onClick={() => {
              batchModalRef.current?.open?.('temporary');
            }}
          >
            临时检测
          </Button>,
        ]}
      />

      <TestPlanModal
        cref={batchModalRef}
        refresh={() => {
          batchTableRef?.current?.reload();
        }}
      />
    </div>
  );
};

export default TestPages;
