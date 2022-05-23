import React, { Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import { Table } from 'antd';
import styles from './../index.less';

export default (props: any) => {
  const { tableInfo, inputValue, similarTableData, refresh } = props;

  const toSample = (r: any) => {
    refresh(r, 'wish');
  };

  const columnsCurrent: any = [
    {
      title: '语料文本',
      dataIndex: 'corpusText',
      fixed: 'left',
      ellipsis: true,
    },
  ];

  const columnsOther: any = [
    {
      title: '意图名称',
      dataIndex: 'intentName',
      fixed: 'left',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return (
          <a style={{ color: '#1890FF' }} onClick={() => toSample(r)}>
            {r.intentName}
          </a>
        );
      },
    },
    {
      title: '语料文本',
      dataIndex: 'corpusText',
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
  ];

  const listFAQ: any = [
    {
      title: '标准问',
      dataIndex: 'stdQuery',
      fixed: 'left',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return <a style={{ color: '#1890FF' }}>{r.stdQuery}</a>;
      },
    },
    {
      title: '相似问',
      dataIndex: 'similarQuery',
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
  ];

  return (
    <div className={styles.similar}>
      <div className={styles.tableTitle}>当前意图下相似语料</div>
      <Table
        // headerTitle={'当前意图下相似语料'}
        rowKey={(record: any) => record.id}
        // search={false}
        columns={columnsCurrent}
        dataSource={similarTableData?.currentIntentList}
        // options={false}
        pagination={false}
        // request={async (params) => {
        //   return getCurrentData(params);
        // }}
        // scroll={{ y: 200 }}
      />
      <div className={styles.tableTitle}>其他意图下相似语料</div>
      <Table
        // headerTitle={'其他意图下相似语料'}
        rowKey={(record) => record.id}
        // search={false}
        columns={columnsOther}
        dataSource={similarTableData?.otherIntentList}
        // options={false}
        pagination={false}
        // request={async (params = {}) => {
        //   return getOtherData(params);
        // }}
        // scroll={{ y: 200 }}
      />
      <div className={styles.tableTitle}>FAQ标准问/相似问</div>
      <Table
        // headerTitle={'FAQ标准问/相似问'}
        rowKey={(record) => record.id}
        // search={false}
        columns={listFAQ}
        dataSource={similarTableData?.similarQueryList}
        // options={false}
        pagination={false}
        // request={async (params = {}) => {
        //   return getFAQData({ params });
        // }}
        // scroll={{ y: 200 }}
      />
    </div>
  );
};
