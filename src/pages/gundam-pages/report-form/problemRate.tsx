import React, { useState, useEffect, useRef, Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import HeadSearch from './components/headSearch';
import { Space } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import config from '@/config/index';
import { useReportForm } from './model';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

export default () => {
  const actionRef = useRef<any>();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { question } = useReportForm();

  const [paramsObj, setParamsObj] = useState<any>({});

  const choseTime = (begin: string, end: string, code: string) => {
    setParamsObj({ begin: begin, end: end, code: code });
  };
  const columns: any = [
    { title: '日期', dataIndex: 'dayId', ellipsis: true },
    {
      title: () => {
        return (
          <Space>
            对话轮次
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            明确回答率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'directReplyRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            澄清回复率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'clarifyReplyRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            澄清确认率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'clarifyConfirmReplyRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            推荐确认率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'recommendReplyConfirmRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            拒识率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'discernReplyRate',
      ellipsis: true,
      render: (t: any, r: any, i: any) => {
        return <a>{r.discernReplyRate}</a>;
      },
    },
    {
      title: () => {
        return (
          <Space>
            匹配率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      // sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'matchRate',
      ellipsis: true,
    },
  ];

  const initialTable = async (payload: any) => {
    let startTime = '';
    let endTime = '';
    if (payload.begin && payload.end) {
      startTime = payload.begin;
      endTime = payload.end;
    } else {
      let sevenDays = moment().subtract(7, 'days');
      let yestody = moment().subtract(1, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    let params = {
      robotId: info.id,
      startTime: startTime,
      endTime: endTime,
      channelCode: payload.code,
    };
    let res = await question(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.total,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const exportReportForm = (begin: string, end: string, code: string) => {
    let startTime = '';
    let endTime = '';
    if (begin && end) {
      startTime = begin;
      endTime = end;
    } else {
      let sevenDays = moment().subtract(7, 'days');
      let yestody = moment().subtract(1, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    window.open(
      `${config.basePath}/robot/statistics/questionMatchExport?startTime=${startTime}&endTime=${endTime}&channelCode=${code}&robotId=${info.id}`,
      '_self',
    );
  };

  return (
    <div className={styles.pageComtain}>
      <div className={styles.pageTitile}>访客次数统计</div>
      <HeadSearch choseTime={choseTime} exportReportForm={exportReportForm} />
      <div className={styles.Table_box}>
        <ProTable
          rowKey={(record: any) => record.dayId}
          headerTitle={false}
          toolBarRender={false}
          actionRef={actionRef}
          pagination={{
            pageSize: 10,
          }}
          search={false}
          columns={columns}
          size={'small'}
          // scroll={{ x: columns.length * 200 }}
          // dataSource={dataSource}
          params={paramsObj}
          request={async (params = {}) => {
            return initialTable(params);
          }}
        />
      </div>
    </div>
  );
};
