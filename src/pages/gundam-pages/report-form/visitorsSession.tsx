import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import ProTable from '@ant-design/pro-table';
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import config from '@/config/index';
import styles from './index.less';
import { useReportForm } from './model';

const CODE = {
  media_wx: '微信',
  media_zyqb: '中邮钱包',
  media_zfb: '支付宝',
  media_jtyw: '集团邮务',
  media_gw: '中邮官网',
  media_ycsjyh: '邮储手机银行',
};
export default () => {
  const actionRef = useRef<any>();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getDialogue } = useReportForm();

  // const [dataSource, setDataSource] = useState<any>([]);
  const [paramsObj, setParamsObj] = useState<any>({});

  // useEffect(() => {
  //   initialTable('', '', '');
  // }, []);

  const choseTime = (begin: string, end: string, code: string) => {
    setParamsObj({ begin: begin, end: end, code: code });
    // initialTable(begin, end, code);
  };

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
    let res = await getDialogue(params);
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
      `${config.basePath}/robot/statistics/sessionExport?startTime=${startTime}&endTime=${endTime}&channelCode=${code}&robotId=${info.id}`,
      '_self',
    );
  };

  const columns: any = [
    { title: '会话ID', dataIndex: 'id', ellipsis: true },
    {
      title: () => {
        return (
          <Space>
            渠道
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'channelCode',
      ellipsis: true,
      render: (t: any, r: any, i: any) => {
        return <span>{CODE[r.channelCode]}</span>;
      },
    },
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
      sorter: (a: any, b: any) => a.dialogueTurn - b.dialogueTurn,
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            访问时长
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      sorter: (a: any, b: any) => a.duration - b.duration,
      dataIndex: 'duration',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.pageComtain}>
      <div className={styles.pageTitile}>访客会话明细</div>
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
          scroll={{ x: columns.length * 200 }}
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
