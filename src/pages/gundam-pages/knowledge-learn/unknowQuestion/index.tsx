import React, { Fragment, useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import styles from './index.less';
import { useUnknownQuestion } from './model';
import { history } from 'umi';
import { Space, Tooltip, Dropdown, Button, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import SessionRecord from './../component/sessionRecord';

export default () => {
  const actionRef = useRef<any>();

  const { getList } = useUnknownQuestion();

  const [learnNum, setLearnNum] = useState<number>(0);
  const [standardNum, setStandardNum] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);
  const [selectRow, setSelectRow] = useState<any>(null);

  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  const getInitTable = async (payload: any) => {
    let res = await getList();

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const toStandard = (r: any) => {
    history.push({
      pathname: '/gundamPages/knowledgeLearn/standardQuestionLearn',
    });
  };

  const handleMenuClick = () => {};

  const openSession = (r: any) => {
    setVisibleSession(true);
  };

  const cancelSession = () => {
    setVisibleSession(false);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: '批量操作',
          key: '1',
        },
        {
          label: '批量加入黑名单',
          key: '2',
        },
        {
          label: '批量添加',
          key: '3',
        },
      ]}
    />
  );

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
                <a className={styles.wrapStyle} onClick={() => toStandard(r)}>
                  {r.recommendName}
                </a>
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
      width: 200,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="record" onClick={() => openSession(record)}>
              会话记录
            </a>
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
    <Fragment>
      <div className={styles.unknowPage}>
        <ProTable
          headerTitle={
            <Fragment>
              <span className={styles.topTitle}>
                未知问题待学习<span className={styles.titleNum}>{learnNum}</span>条, 涉及标准问
                {standardNum}条
              </span>
            </Fragment>
          }
          rowKey={'id'}
          actionRef={actionRef}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          pagination={{
            pageSize: 10,
          }}
          rowSelection={rowSelection}
          toolBarRender={() => [
            <Dropdown overlay={menu} key="Dropdown">
              <Button type="primary">
                <Space>
                  批量处理
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={async (params) => {
            return getInitTable({ params });
          }}
        />
      </div>
      <SessionRecord visible={visibleSession} onCancel={cancelSession} modalData={modalData} />
    </Fragment>
  );
};
