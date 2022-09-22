import Condition from '@/components/Condition';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import { useModel } from 'umi';
import { useSoundModel } from '../../model';
import AuditionModal from '../auditionModal';
import ReplaceModal from '../replaceModal';
import style from './style.less';

const TablePage: React.FC = (props: any) => {
  const { cref, activeKey } = props;
  const tableRef = useRef<any>();
  const auditionRef = useRef<any>();
  const replaceRef = useRef<any>();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getTableList, deleteSound, loading, opLoading, tableList } = useSoundModel();

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
          <div>
            <div className={style['applyNode']}>{`${1}.${r?.applyNames?.[0]}`}</div>
            <Tooltip
              title={
                <div key={i}>
                  {r?.applyNames?.map((item: any, index: any) => (
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
      fixed: 'right',
      width: activeKey == '1' || activeKey == '2' ? 200 : 100,
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
            <Condition r-if={activeKey == '1' || activeKey == '2'}>
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
                  deleteSound({ id: r.id }).then((res: any) => {
                    if (res) {
                      refresh();
                    }
                  });
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </Condition>
          </div>
        );
      },
    },
  ];

  useImperativeHandle(cref, () => ({
    refresh,
  }));

  const refresh = () => {
    tableRef?.current?.reload();
  };

  return (
    <div>
      <ProTable<any>
        columns={columns}
        actionRef={tableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getTableList({
            robotId: info.id,
            page: params.current,
            ...params,
            type: Number(activeKey) || undefined,
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
      <AuditionModal cref={auditionRef}></AuditionModal>
      <ReplaceModal cref={replaceRef} refresh={refresh}></ReplaceModal>
    </div>
  );
};

export default TablePage;