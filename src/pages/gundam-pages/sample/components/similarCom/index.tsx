import React, { Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import { Table } from 'antd';
import styles from './../index.less';

export default (props: any) => {
  const { tableInfo, inputValue, similarTableData, refresh, pageType } = props;

  const toSample = (r: any) => {
    refresh(r, pageType);
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

  const currentStd: any = [
    {
      title: '语料文本',
      dataIndex: 'stdQuery',
      fixed: 'left',
      ellipsis: true,
    },
  ];

  const orderStd: any = [
    {
      title: '标准问',
      dataIndex: 'stdQuery',
      fixed: 'left',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return (
          <a style={{ color: '#1890FF' }} onClick={() => toSample(r)}>
            {r.stdQuery}
          </a>
        );
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

  const intentList: any = [
    {
      title: '意图名称',
      dataIndex: 'intentName',
      fixed: 'left',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return <a style={{ color: '#1890FF' }}>{r.intentName}</a>;
      },
    },
    {
      title: '意图语料',
      dataIndex: 'corpusText',
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
  ];

  return (
    <div className={styles.similar}>
      <div className={styles.tableTitle}>
        {pageType == 'wish' ? '当前意图下相似语料' : '当前问题下的相似问法'}
      </div>
      <Table
        // headerTitle={'当前意图下相似语料'}
        rowKey={(record: any) => record.id}
        // search={false}
        columns={pageType == 'wish' ? columnsCurrent : currentStd}
        dataSource={
          pageType == 'wish'
            ? similarTableData?.currentIntentList
            : similarTableData?.currentStdQueryList
        }
        // options={false}
        pagination={false}
        // request={async (params) => {
        //   return getCurrentData(params);
        // }}
        // scroll={{ y: 200 }}
      />
      <div className={styles.tableTitle}>
        {pageType == 'wish' ? '其他意图下相似语料' : '其他标准问近似问法'}
      </div>
      <Table
        // headerTitle={'其他意图下相似语料'}
        rowKey={(record) => record.id}
        // search={false}
        columns={pageType == 'wish' ? columnsOther : orderStd}
        dataSource={
          pageType == 'wish'
            ? similarTableData?.otherIntentList
            : similarTableData?.otherStdQueryList
        }
        // options={false}
        pagination={false}
        // request={async (params = {}) => {
        //   return getOtherData(params);
        // }}
        // scroll={{ y: 200 }}
      />
      <div className={styles.tableTitle}>
        {pageType == 'wish' ? 'FAQ标准问/相似问' : '其他相似的意图样本'}
      </div>
      <Table
        // headerTitle={'FAQ标准问/相似问'}
        rowKey={(record) => record.id}
        // search={false}
        columns={pageType == 'wish' ? listFAQ : intentList}
        dataSource={
          pageType == 'wish' ? similarTableData?.similarQueryList : similarTableData?.intentList
        }
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
