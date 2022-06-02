import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Table, Button, Dropdown, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import Condition from '@/components/Condition';
import { PlusOutlined } from '@ant-design/icons';
import { useTableModel } from './model';

const FAQBlackList = (props: any) => {
  const { tableList, getTableList, tableLoading, deleteBlack } = useTableModel();

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  // 删除
  const deleteRow = async (row: any) => {
    let params: any = {
      id: row.id,
    };
    let res: any = await deleteBlack(params);
    if (res) {
      // 删除成功就刷新
      tableRef.current.reload();
    }
  };

  const columns: any[] = [
    {
      title: '问题',
      dataIndex: 'question',
      fixed: 'left',
      width: 400,
      fieldProps: {
        placeholder: '请输入查询内容',
        // onPressEnter: (e: any) => {
        //   console.log(e);
        //   let obj = { ...searchForm, robotName: e.target.value };
        //   // if (e.target.value == '') {
        //   //   delete obj.robotName;
        //   // }
        //   setSearchForm(obj);
        // },
      },
      ellipsis: true,
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      search: false,
      valueEnum: {
        0: { text: '文本' },
        1: { text: '语音' },
      },
      width: 180,
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
      width: 120,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  deleteRow(row);
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
    <div className={`list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        loading={tableLoading}
        scroll={{ x: columns.length * 200 }}
        request={async (params: any, sort: any, filter: any) => {
          return getTableList({ page: params.current, ...params });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-faq-blacklist',
          persistenceType: 'localStorage',
        }}
        rowKey="index"
        search={{
          labelWidth: 'auto',
          // optionRender: false,
          // collapsed: false,
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
        headerTitle=""
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              modalRef.current?.open?.();
            }}
          >
            新建
          </Button>,
        ]}
      />
    </div>
  );
};

export default FAQBlackList;
