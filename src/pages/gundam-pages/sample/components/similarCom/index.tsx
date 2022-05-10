import React, { Fragment } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { useSampleModel } from './../../model/index';
import styles from './index.less';

export default (props: any) => {
  const { getsimilarList } = useSampleModel();

  const getCurrentData = async (payload: any) => {
    let params = {};
    let res: any = await getsimilarList(params);
    return {
      data: res?.data?.listCurrent || [],
      total: res?.data?.listCurrent?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const getOtherData = async (payload: any) => {
    let params = {};
    let res: any = await getsimilarList(params);
    return {
      data: res?.data?.listOther || [],
      total: res?.data?.listOther?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const getFAQData = async (payload: any) => {
    let params = {};
    let res: any = await getsimilarList(params);
    return {
      data: res?.data?.listFAQ || [],
      total: res?.data?.listFAQ?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const columnsCurrent: any = [
    {
      title: '语料文本',
      dataIndex: 'actionLabel',
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
      width: 200,
    },
    {
      title: '语料文本',
      dataIndex: 'yuliao',
      fixed: 'left',
      ellipsis: true,
    },
  ];

  const listFAQ: any = [
    {
      title: '标准问',
      dataIndex: 'bzw',
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '相似问',
      dataIndex: 'yuliao',
      fixed: 'left',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.similar}>
      <div className={styles.similarSty}>
        <InfoCircleOutlined style={{ color: 'rgba(250, 173, 20, 1)' }} />
        系统检测到与您即将提交的语料相似的语料，如下图所示，请留意是否合并！
      </div>
      <ProTable
        headerTitle={'当前意图下相似语料'}
        rowKey={(record) => record.id}
        search={false}
        columns={columnsCurrent}
        options={false}
        pagination={false}
        request={async (params) => {
          return getCurrentData(params);
        }}
      />
      <ProTable
        headerTitle={'其他意图下相似语料'}
        rowKey={(record) => record.id}
        search={false}
        columns={columnsOther}
        options={false}
        pagination={false}
        request={async (params = {}) => {
          return getOtherData(params);
        }}
      />
      <ProTable
        headerTitle={'FAQ标准问/相似问'}
        rowKey={(record) => record.id}
        search={false}
        columns={listFAQ}
        options={false}
        pagination={false}
        request={async (params = {}) => {
          return getFAQData({ params });
        }}
      />
    </div>
  );
};
