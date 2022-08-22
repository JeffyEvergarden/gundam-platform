import config from '@/config';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { useActivate } from 'react-activation';
import { history, useModel } from 'umi';
import ImportModal from '../component/importModal';
import SampleModal from '../component/sampleModal';
import { useSampleModel } from '../model';
import style from './style.less';

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
      dataIndex: 'sampleSetId',
      search: false,
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '样本集名称',
      dataIndex: 'sampleSetName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any, index: any) => {
        return (
          <Tooltip
            // overlayClassName="hidTooltip"
            title={row.sampleSetName}
            // placement={'topLeft'}
            // getPopupContainer={(trigger: any) => trigger.parentElement}
          >
            <Button
              type="link"
              style={{ color: '#1890ff !important', maxWidth: '100%' }}
              onClick={(e) => {
                history.push({
                  pathname: `/gundamPages/effectEvaluation/sampleManager/sampleDetail`,
                  state: {
                    ...row,
                  },
                });
              }}
              // title={row.sampleSetName}
            >
              <span className={style['sampleSetName']}>{row.sampleSetName}</span>
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: '标注进度',
      dataIndex: 'tagProgress',
      search: false,
      width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      search: false,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 210,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                ModalRef.current?.open?.('edit', row);
              }}
            >
              重命名
            </Button>

            <Popconfirm
              title={
                <div
                  style={{ maxWidth: '150px' }}
                >{`你确定要删除以下样本集吗？删除将不可恢复：${row?.sampleSetName}`}</div>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await deleteSample({ ronotId: info.id, id: row.id }).then((res) => {
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
                ImportRef?.current?.open(row);
              }}
            >
              导入
            </Button>

            <Button
              type="link"
              onClick={() => {
                window.open(
                  `${config.basePath}/robot/assess/sampleExport?sampleAssessId=${row.id}&robotId=${info.id}`,
                );
              }}
            >
              导出
            </Button>
          </div>
        );
      },
    },
  ];

  const refresh = () => {
    TableRef?.current?.reload();
  };

  useActivate(() => {
    refresh();
    // setTimeout(() => {
    //   document.querySelectorAll('.hidTooltip').forEach((item) => {
    //     item.style.left = '-999px';
    //   });
    // }, 1);
  });

  return (
    <div className={`${style['machine-page']} list-page`}>
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
      <SampleModal cref={ModalRef} refresh={refresh} />

      <ImportModal cref={ImportRef} refresh={refresh} />
    </div>
  );
};

export default DetailPages;
