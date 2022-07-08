import { SettingOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { history, useModel } from 'umi';
import style from './style.less';

import { useBatchModel } from '../model';
import InfoModal from './component/test-plan';

const TestPages: React.FC = (props: any) => {
  const { list, totalPage, getList, loading, deleteBatch } = useBatchModel();

  const batchTableRef = useRef<any>({});
  const batchModalRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const deleteRow = async (row: any) => {
    let params: any = {
      robotId: info.id,
      id: row.id,
    };
    let res: any = await deleteBatch(params);
    if (res) {
      message.success('删除成功');
      batchTableRef.current.reload();
    } else {
      message.error(res);
    }
  };

  const columns: any[] = [
    {
      title: '检测批次ID',
      dataIndex: 'id',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入标签名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: '检测阈值',
      dataIndex: 'threshold',
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
      dataIndex: 'costTime',
      search: false,
      width: 200,
      render: (val: any) => {
        return val + 's';
      },
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
        if (row.taskStatus == 2) {
          return (
            <div>
              <div style={{ display: 'flex' }}>
                <Button // 标签无法编辑
                  type="link"
                  onClick={() => {
                    history.push({
                      pathname: '/gundamPages/knowledgeLearn/batchTest/detailList',
                      state: {
                        info: row,
                      },
                    });
                  }}
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
                >
                  <Button type="link" danger>
                    删除明细
                  </Button>
                </Popconfirm>
              </div>
            </div>
          );
        } else if (row.taskStatus == 1) {
          return '跑批中';
        } else {
          return '待跑批';
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
        headerTitle="下次检测日期：xxx"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<SettingOutlined />}
            type="primary"
            onClick={() => {
              batchModalRef.current?.open?.();
            }}
          >
            检测计划
          </Button>,
        ]}
      />

      <InfoModal cref={batchModalRef} />
    </div>
  );
};

export default TestPages;
