import config from '@/config/index';
import { throttle, toNumber } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Space } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import styles from './index.less';
import { useReportForm } from './model';
import { codeToStr } from '@/utils/index';
import Tip from '@/components/Tip';

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
    setDataSource(res?.data);
    let day: any = [];
    let temp: any = [];
    let searchNum: any = { name: '搜索次数', val: [] };
    let suggestNum: any = { name: '联想次数', val: [] };
    let suggestClickNum: any = { name: '联想点击次数', val: [] };
    let suggestResultNum: any = { name: '联想有结果次数', val: [] };
    let suggestAvgPosition: any = { name: '联想平均点击位置', val: [] };
    let suggestUseRate: any = { name: '联想使用率', val: [], isRate: true };
    let suggestResultRate: any = { name: '联想有结果率', val: [], isRate: true };
    let suggestClickRate: any = { name: '联想点击率', val: [], isRate: true };
    let topThreeRate: any = { name: '联想Top3点击率', val: [], isRate: true };
    res?.data.map((item: any) => {
      day.push(item.dayId);
      searchNum.val.push(item.searchNum);
      suggestNum.val.push(item.suggestNum);
      suggestClickNum.val.push(item.suggestClickNum);
      suggestUseRate.val.push(toNumber(item.suggestUseRate));
      suggestResultNum.val.push(item.suggestResultNum);
      suggestResultRate.val.push(toNumber(item.suggestResultRate));
      suggestClickRate.val.push(toNumber(item.suggestClickRate));
      suggestAvgPosition.val.push(item.suggestAvgPosition);
      topThreeRate.val.push(toNumber(item.topThreeRate));
    });
    temp.push(
      searchNum,
      suggestNum,
      suggestClickNum,
      suggestResultNum,
      suggestAvgPosition,
      suggestUseRate,
      suggestResultRate,
      suggestClickRate,
      topThreeRate,
    );
    setDayId(day);
    setList(temp);
    return {
      data: res?.data || [],
      total: res?.data?.length || 0,
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
      let sevenDays = moment().subtract(6, 'days');
      let yestody = moment().subtract(0, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    window.open(
      `${
        config.basePath
      }/robot/statistics/suggestExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}`,
    );
  };

  const columns: any[] = [
    {
      title: () => {
        return (
          <Space>
            日期
            <span></span>
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
              <Tip title={'客户搜索的次数（通过文本框输入，点击发送的次数）'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'searchNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想次数
            <span>
              <Tip
                title={
                  '联想总次数（suggest接口的调用次数，客户的一次发送，只要输入文本过程有停顿，有会触发多次联想调用）'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想点击次数
            <span>
              <Tip title={'客户点击联想进行搜索的次数，此次数 ≤ 搜索次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestClickNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想使用率
            <span>
              <Tip title={'联想点击次数/搜索次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestUseRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想有结果次数
            <span>
              <Tip title={'联想次数中有结果的次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestResultNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想有结果率
            <span>
              <Tip title={'联想有结果次数/联想次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestResultRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想点击率
            <span>
              <Tip title={'联想点击次数/联想中有结果的次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestClickRate',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想平均点击位置
            <span>
              <Tip title={'联想点击中，点击的位置序号的总和 / 联想点击总次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'suggestAvgPosition',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            联想Top3点击率
            <span>
              <Tip title={'联想Top3点击次数/联想有结果次数，此使用率 ≤ 联想点击率'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'topThreeRate',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageComtain}>
        <div className={styles.pageTitile}>搜索联想统计</div>
        <HeadSearch
          choseTime={choseTime}
          exportReportForm={exportReportForm}
          permission={'robot_mg-report-search-association-export_bt'}
        />
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
            pagination={false}
            search={false}
            columns={columns}
            size={'small'}
            sticky={true}
            scroll={{ y: 270, x: columns.length * 150 }}
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
