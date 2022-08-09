import React, { useEffect, useState, useRef } from 'react';
import { useModel } from 'umi';
import { throttle, toNumber } from '@/utils';
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import config from '@/config/index';
import ProTable from '@ant-design/pro-table';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import styles from './index.less';
import { useReportForm } from './model';

export default () => {
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const actionRef = useRef<any>();

  const { searchAssociation, tableLoading } = useReportForm();

  const rate = document.body.clientWidth / 1366;
  const [base, setBase] = useState<number>(rate);

  const resize = () => {
    const html = document.documentElement;
    const realRate = document.body.clientWidth / 1920;
    const rate = realRate <= 0.7 ? 0.7 : realRate;
    html.style.fontSize = rate * 20 + 'px';
    setBase(rate);
  };

  const [dataSource, setDataSource] = useState<any>([]);
  const [dayId, setDayId] = useState<any>([]);
  const [lineList, setList] = useState<any>([]);

  const [paramsObj, setParamsObj] = useState<any>({});

  useEffect(() => {
    resize();
    const fn = throttle(() => {
      resize();
    }, 200);
    window.addEventListener('resize', fn);
    return () => {
      window.removeEventListener('resize', fn);
    };
  }, []);

  const initialTable = async (payload: any) => {
    let startTime = '';
    let endTime = '';
    if (payload.begin && payload.end) {
      startTime = payload.begin;
      endTime = payload.end;
    } else {
      let sevenDays = moment().subtract(6, 'days');
      let yestody = moment().subtract(0, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    let params = {
      robotId: info.id,
      startTime: startTime,
      endTime: endTime,
      channelCode: payload.code,
    };
    let res = await searchAssociation(params);
    setDataSource(res?.data?.list);
    let day: any = [];
    let temp: any = [];
    let dayId1: any = { name: '搜索次数', val: [] };
    let dayId2: any = { name: '联想次数', val: [] };
    let dayId3: any = { name: '联想点击次数', val: [] };
    let dayId5: any = { name: '联想有结果次数', val: [] };
    let dayId8: any = { name: '联想平均点击位置', val: [] };
    let dayId4: any = { name: '联想使用率', val: [], isRate: true };
    let dayId6: any = { name: '联想有结果率', val: [], isRate: true };
    let dayId7: any = { name: '联想点击率', val: [], isRate: true };
    let dayId9: any = { name: '联想Top3点击率', val: [], isRate: true };
    res?.data?.list?.map((item: any) => {
      day.push(item.dayId);
      dayId1.val.push(item.dayId1);
      dayId2.val.push(item.dayId2);
      dayId3.val.push(item.dayId3);
      dayId4.val.push(toNumber(item.dayId4));
      dayId5.val.push(item.dayId5);
      dayId6.val.push(toNumber(item.dayId6));
      dayId7.val.push(toNumber(item.dayId7));
      dayId8.val.push(item.dayId8);
      dayId9.val.push(toNumber(item.dayId9));
    });
    temp.push(dayId1, dayId2, dayId3, dayId4, dayId5, dayId6, dayId7, dayId8, dayId9);
    setDayId(day);
    setList(temp);
    return {
      data: res?.data?.list || [],
      total: res?.data?.total,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const choseTime = (begin: string, end: string, code: string) => {
    setParamsObj({ begin: begin, end: end, code: code });
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

  const columns: any[] = [
    {
      title: () => {
        return (
          <Space>
            日期
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            搜索次数
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId1',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想次数
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId2',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想点击次数
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId3',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想使用率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId4',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想有结果次数
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId5',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想有结果率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId6',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想点击率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId7',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想平均点击位置
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId8',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想Top3点击率
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'dayId9',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageComtain}>
        <div className={styles.pageTitile}>搜索联想统计</div>
        <HeadSearch choseTime={choseTime} exportReportForm={exportReportForm} />
        <div className={styles.visitorBox}>
          <LineChart
            id={'assocation'}
            loading={tableLoading}
            title={''}
            base={base}
            dataSource={dataSource}
            columns={dayId}
            data={lineList}
            color={[
              '#6395F9',
              '#62DAAB',
              '#657798',
              '#F6C022',
              '#7666F9',
              '#78D3F8',
              '#9661BC',
              '#F6903D',
              '#008685',
            ]}
            legendData={[
              '搜索结果',
              '联想次数',
              '联想点击次数',
              '联想有结束次数',
              '联想平均点击位置',
              '联想使用率',
              '联想有结果率',
              '联想点击率',
              '联想Top3点击率',
            ]}
            className={styles.visitorBox}
          />
        </div>
        <div className={styles.Table_box}>
          <ProTable
            rowKey={(record: any) => record.dayId}
            headerTitle={false}
            toolBarRender={false}
            bordered
            actionRef={actionRef}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            columns={columns}
            size={'small'}
            sticky={true}
            scroll={{ y: 270 }}
            // dataSource={dataSource}
            params={paramsObj}
            request={async (params = {}) => {
              return initialTable(params);
            }}
          />
        </div>
      </div>
    </div>
  );
};
