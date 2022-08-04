import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import ImportModal from '../component/importModal';
import SampleModal from '../component/sampleModal';
import { useSampleModel } from '../model';

const DetailPages: React.FC = (props: any) => {
  const TableRef = useRef<any>({});
  const ModalRef = useRef<any>({});
  const ImportRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { tableList, Loading, getList, deleteSample } = useSampleModel();

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '样本集名称',
      dataIndex: 'sampleName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '标注进度',
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
                ModalRef.current?.open?.('edit', row);
              }}
            >
              编辑样本
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

            <Button
              type="link"
              onClick={() => {
                ImportRef?.current?.open();
              }}
            >
              导入
            </Button>

            <Button type="link" onClick={() => {}}>
              导出
            </Button>
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
        headerTitle="样本管理列表"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              ModalRef.current?.open?.('add');
            }}
          >
            新建评估样本集
          </Button>,
        ]}
      />
      <SampleModal cref={ModalRef} />

      <ImportModal cref={ImportRef} />
    </div>
  );
};

export default DetailPages;
