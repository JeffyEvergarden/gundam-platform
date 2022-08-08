import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import EvaluationDetail from '../component/evaluationDetail';
import EvaluationModal from '../component/evaluationModal';
import { useSampleModel } from '../model';

const DetailPages: React.FC = (props: any) => {
  const TableRef = useRef<any>({});
  const ModalRef = useRef<any>({});
  const DetailRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { tableList, Loading, getList, deleteSample } = useSampleModel();

  const columns: any[] = [
    {
      title: '所用评估表',
      dataIndex: 'id',
      search: false,
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '评估时间',
      dataIndex: 'sampleName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '提交人',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '平均精确率',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '平均召回率',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '阈值',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '差值',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '澄清数量',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 150,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                DetailRef.current?.open?.(row);
              }}
            >
              查看详情
            </Button>

            <Popconfirm
              title="删除将不可恢复，确认删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await deleteSample(row).then((res) => {
                  if (res) {
                    TableRef?.current?.reload();
                  }
                });
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
      <ProTable<any>
        columns={columns}
        actionRef={TableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getList({
            robotId: info.id,
            page: params.current,
            ...params,
          });
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
        headerTitle="模型评估列表"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              ModalRef.current?.open?.();
            }}
          >
            提交评估
          </Button>,
        ]}
      />

      <EvaluationDetail cref={DetailRef}></EvaluationDetail>
      <EvaluationModal cref={ModalRef}></EvaluationModal>
    </div>
  );
};

export default DetailPages;
