import ProTable from '@ant-design/pro-table';
import { Button, Input, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import style from './style.less';

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
      dataIndex: 'textOneValue',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '所属FAQ/意图',
      dataIndex: 'textOneType',
      search: false,
      width: 200,
    },
    {
      title: '样本2',
      dataIndex: 'textTwoValue',
      search: false,
      width: 200,
    },
    {
      title: '所属FAQ/意图',
      dataIndex: 'textTwoType',
      search: false,
      width: 200,
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
                onConfirm={() => {
                  deleteWhite({ id: row.id, robotId: info.id });
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
      {/* <div className={style['page_top']}>
        <div style={{ fontSize: '20px', fontWeight: 400 }}>{`白名单${totalPage || 0}条`}</div>
        <div className={style['page_top__right']}>
          <Space>
            <Input.Search
              // bordered={false}
              style={{ width: '280px' }}
              onSearch={(text: any) => {
                setSearchText(text);
              }}
              onPressEnter={(e: any) => {
                setSearchText(e.target.value);
              }}
              placeholder={'请输入'}
              allowClear
            />
          </Space>
        </div>
      </div> */}
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
        headerTitle={`白名单${totalPage || 0}条`}
        toolBarRender={() => [
          <Space>
            <Input.Search
              // bordered={false}
              style={{ width: '280px' }}
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
