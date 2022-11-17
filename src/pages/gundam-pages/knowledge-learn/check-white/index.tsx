import ProTable from '@ant-design/pro-table';
import { Button, Input, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import style from './style.less';

import Tip from '@/components/Tip';
import { useWhiteModel } from '../model';

const WhiteListPages: React.FC = (props: any) => {
  const { list, totalPage, getList, deleteWhite, loading } = useWhiteModel();
  const labelTableRef = useRef<any>({});

  const [searchText, setSearchText] = useState<any>('');

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  // const deleteRow = async (row: any) => {
  //   let params: any = {
  //     robotId: info.id,
  //     id: row.id,
  //   };
  //   let res: any = await deleteLabel(params);
  //   if (res) {
  //     console.log('删除接口');
  //     // message.success('删除成功');
  //     labelTableRef.current.reload();
  //   } else {
  //     message.error(res);
  //   }
  // };

  const columns: any[] = [
    {
      title: '样本1',
      dataIndex: 'textOneName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '所属FAQ/意图',
      dataIndex: 'textOneRelationName',
      search: false,
      width: 200,
    },
    {
      title: '样本2',
      dataIndex: 'textTwoName',
      search: false,
      width: 200,
    },
    {
      title: '所属FAQ/意图',
      dataIndex: 'textTwoRelationName',
      search: false,
      width: 200,
    },
    {
      title: '来源',
      dataIndex: 'source',
      search: false,
      width: 200,
      valueEnum: {
        0: '相似检测',
        1: '不相似检测',
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 130,
      render: (val: any, row: any, index: number) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={async () => {
                  let res: any = await deleteWhite({ id: row.id, robotId: info.id });
                  if (res) {
                    labelTableRef?.current?.reload();
                  }
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        params={{ searchText }}
        columns={columns}
        actionRef={labelTableRef}
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
            {`白名单${totalPage || 0}条`}
            <Tip
              title={`批量检测明细中，点击“白名单“，样本对将进入本列表。\n
        作用：每次执行批量检测，返回结果的样本对如果与白名单的样本对完全相同，则认为已存在于白名单中（不认为是异常样本），批量检测明细中不再显示。
        `}
            />
          </>
        }
        toolBarRender={() => [
          <Space>
            <Input.Search
              // bordered={false}
              style={{ width: '280px', padding: '4px' }}
              onSearch={(text: any) => {
                setSearchText(text);
              }}
              onPressEnter={(e: any) => {
                setSearchText(e.target.value);
              }}
              placeholder={'请输入'}
              allowClear
            />
          </Space>,
        ]}
      />

      {/* <InfoModal
        cref={labelModalRef}
        confirm={confirmInfo}
        // loading={opLoading}
      /> */}
    </div>
  );
};

export default WhiteListPages;
