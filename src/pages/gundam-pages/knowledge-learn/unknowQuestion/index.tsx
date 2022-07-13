import React, { Fragment, useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import styles from './index.less';
import { useUnknownQuestion } from './model';
import { Space, Tooltip } from 'antd';

export default () => {
  const actionRef = useRef<any>();

  const { getList } = useUnknownQuestion();

  const getInitTable = async (payload: any) => {
    let res = await getList();

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };
  const columns: any = [
    {
      dataIndex: 'question',
      title: '客户问题',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'rangeTime',
      title: '选择时间',
      hideInTable: true,
      valueType: 'dateRange',
      width: 200,
    },
    {
      dataIndex: 'source',
      title: '问题来源',
      ellipsis: true,
      valueType: 'select',
      initialValue: '',
      width: 100,
      valueEnum: {
        1: '澄清',
        2: '拒识',
        '': '全部',
      },
    },
    {
      dataIndex: 'askNum',
      title: '咨询次数',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'faqTypeName',
      title: '分类',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'recommendName',
      title: '标注问/意图(数量)',
      width: 200,
      search: false,
      render: (t: any, r: any, i: any) => {
        return (
          <Fragment>
            <Tooltip title={r.recommendName}>
              <div className={styles.nameBox}>
                <div className={styles.wrapStyle}>{r.recommendName}</div>
                <span>{'(' + r.recommendNum + ')'}</span>
              </div>
            </Tooltip>
          </Fragment>
        );
      },
    },
    {
      dataIndex: 'createTime',
      title: '日期时间',
      search: false,
      ellipsis: true,
      width: 200,
    },
    {
      title: '操作',
      key: 'option',
      width: 300,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="record">会话记录</a>
            <a key="addStandar">新增标准问</a>
            <a key="add">添加</a>
            <a key="clarify">澄清</a>
            <a key="black">黑名单</a>
          </Space>
        );
      },
    },
  ];
  return (
    <div className={styles.unknowPage}>
      <ProTable
        rowKey={'id'}
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        pagination={{
          pageSize: 10,
        }}
        request={async (params) => {
          return getInitTable({ params });
        }}
      />
    </div>
  );
};
