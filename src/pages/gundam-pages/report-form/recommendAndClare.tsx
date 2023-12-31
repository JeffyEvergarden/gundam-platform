import Tip from '@/components/Tip';
import config from '@/config/index';
import { throttle, toNumber, twoDecimal_f } from '@/utils';
import { codeToStr } from '@/utils/index';
import { Space, Spin, Table, Typography } from 'antd';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import styles from './index.less';
import { useReportForm } from './model';

const { Text } = Typography;

export default () => {
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getFaqAndClareList, tableLoading } = useReportForm();

  const rate = document.body.clientWidth / 1366;
  const [base, setBase] = useState<number>(rate);

  const resize = () => {
    const html = document.documentElement;
    const realRate = document.body.clientWidth / 1920;
    const rate = realRate <= 0.7 ? 0.7 : realRate;
    html.style.fontSize = rate * 20 + 'px';
    setBase(rate);
  };

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

  const [dataSource, setDataSource] = useState<any>([]);
  const [dayId, setDayId] = useState<any>([]);
  const [lineList, setList] = useState<any>([]);

  useEffect(() => {
    getList('', '', '');
  }, []);

  const getList = async (begin: string, end: string, code: string) => {
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
    let params = {
      robotId: info.id,
      startTime: startTime,
      endTime: endTime,
      channelCode: code,
    };
    let res = await getFaqAndClareList(params);
    setDataSource(res?.data);
    let day: any = [];
    let temp: any = [];
    let clarifyReplyNum: any = { name: '澄清回复数', val: [] };
    let clarifyConfirmDistinctNum: any = { name: '澄清确认数', val: [] };
    let clarifyUnconfirmedReplyNum: any = { name: '澄清未确认数', val: [] };
    let recommendReplyNum: any = { name: '推荐回复数', val: [] };
    let recommendDistinctConfirmNum: any = { name: '推荐确认数', val: [] };
    let recommendReplyUnconfirmedNum: any = { name: '推荐未确认数', val: [] };
    let clarifyReplyRate: any = { name: '澄清确认率', val: [], isRate: true };
    let recommendReplyConfimRate: any = { name: '推荐确认率', val: [], isRate: true };
    res?.data?.map((item: any) => {
      day.push(item.dayId);
      clarifyReplyNum.val.push(item.clarifyReplyNum);
      clarifyConfirmDistinctNum.val.push(item.clarifyConfirmDistinctNum);
      clarifyUnconfirmedReplyNum.val.push(item.clarifyUnconfirmedReplyNum);
      recommendReplyNum.val.push(item.recommendReplyNum);
      recommendDistinctConfirmNum.val.push(item.recommendDistinctConfirmNum);
      recommendReplyUnconfirmedNum.val.push(item.recommendReplyUnconfirmedNum);
      clarifyReplyRate.val.push(toNumber(item.clarifyReplyRate));
      recommendReplyConfimRate.val.push(toNumber(item.recommendReplyConfirmRate));
    });
    if (info.robotType == 0) {
      temp.push(
        clarifyReplyNum,
        clarifyConfirmDistinctNum,
        clarifyUnconfirmedReplyNum,
        recommendReplyNum,
        recommendDistinctConfirmNum,
        recommendReplyUnconfirmedNum,
        clarifyReplyRate,
        recommendReplyConfimRate,
      );
    } else if (info.robotType == 1) {
      temp.push(
        clarifyReplyNum,
        clarifyConfirmDistinctNum,
        clarifyUnconfirmedReplyNum,
        // recommendReplyNum,
        // recommendDistinctConfirmNum,
        // recommendReplyUnconfirmedNum,
        clarifyReplyRate,
        // recommendReplyConfimRate,
      );
    }

    setDayId(day);
    setList(temp);
  };

  const choseTime = (begin: string, end: string, code: string) => {
    getList(begin, end, code);
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
      }/robot/statistics/faqAndClarifyExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}`,
    );
  };

  const columns_text: any = [
    { title: '日期', dataIndex: 'dayId', ellipsis: true },
    {
      title: '澄清统计',
      children: [
        {
          title: () => {
            return (
              <Space>
                回复数
                <span>
                  <Tip title={'机器人回复澄清话术的次数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyReplyNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认数
                <span>
                  <Tip
                    title={
                      '机器人回复澄清话术后，客户选择澄清问题的次数。同一次澄清（可通过输入序号或者点击澄清问题触发），客户多次选择确认，只记录1次'
                    }
                  />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyConfirmDistinctNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                未确认数
                <span>
                  <Tip title={'澄清问题回复数-澄清问题确认数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyUnconfirmedReplyNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认率
                <span>
                  <Tip title={'澄清问题确认数 / 澄清问题回复数 * 100%'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyReplyRate',
          ellipsis: true,
        },
      ],
    },
    {
      title: '推荐统计',
      children: [
        {
          title: () => {
            return (
              <Space>
                回复数
                <span>
                  <Tip title={'机器人直接回复答案且附有推荐问的次数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'recommendReplyNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认数
                <span>
                  <Tip
                    title={
                      '机器人直接回复答案且附有推荐问时，客户选择推荐问的次数（可通过输入序号或者点击推荐问题触发）。同一次推荐，客户多次选择不同的选项，只记录1次'
                    }
                  />
                </span>
              </Space>
            );
          },
          dataIndex: 'recommendDistinctConfirmNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                未确认数
                <span>
                  <Tip title={'推荐问题回复数 - 推荐问题确认数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'recommendReplyUnconfirmedNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认率
                <span>
                  <Tip title={'推荐问题确认数 / 推荐问题回复数 * 100%'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'recommendReplyConfirmRate',
          ellipsis: true,
        },
      ],
    },
  ];

  const columns_sound: any = [
    { title: '日期', dataIndex: 'dayId', ellipsis: true },
    {
      title: '澄清统计',
      children: [
        {
          title: () => {
            return (
              <Space>
                回复数
                <span>
                  <Tip title={'机器人回复澄清话术的次数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyReplyNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认数
                <span>
                  <Tip
                    title={
                      '机器人回复澄清话术后，客户下一次的意图明确且在上一次的澄清列表中，视为澄清问题确认数。'
                    }
                  />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyConfirmDistinctNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                未确认数
                <span>
                  <Tip title={'澄清问题回复数-澄清问题确认数'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyUnconfirmedReplyNum',
          ellipsis: true,
        },
        {
          title: () => {
            return (
              <Space>
                确认率
                <span>
                  <Tip title={'澄清问题确认数 / 澄清问题回复数 * 100%'} />
                </span>
              </Space>
            );
          },
          dataIndex: 'clarifyReplyRate',
          ellipsis: true,
        },
      ],
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageComtain}>
        <div className={styles.pageTitile}>
          {info?.robotType == 1 ? '澄清统计' : '推荐问和澄清统计'}
        </div>
        <HeadSearch
          choseTime={choseTime}
          exportReportForm={exportReportForm}
          permission={'robot_mg-report_recommend_and_clarify-export_bt'}
        />
        <div className={styles.visitorBox}>
          <LineChart
            id={'faqAndClarify'}
            loading={tableLoading}
            title={''}
            base={base}
            dataSource={dataSource}
            columns={dayId}
            data={lineList}
            color={
              info.robotType == 0
                ? [
                    '#6395F9',
                    '#62DAAB',
                    '#657798',
                    '#F6C022',
                    '#7666F9',
                    '#78D3F8',
                    '#9661BC',
                    '#F6903D',
                  ]
                : ['#6395F9', '#62DAAB', '#657798', '#9661BC']
            }
            legendData={
              info.robotType == 0
                ? [
                    '澄清回复数',
                    '澄清确认数',
                    '澄清未确认数',
                    '推荐回复数',
                    '推荐确认数',
                    '推荐未确认数',
                    '澄清确认率',
                    '推荐确认率',
                  ]
                : info.robotType == 1
                ? ['澄清回复数', '澄清确认数', '澄清未确认数', '澄清确认率']
                : []
            }
            className={styles.visitorBox}
          />
        </div>
        <div className={styles.Table_box}>
          <Spin spinning={tableLoading}>
            <Table
              rowKey={(record: any) => record.dayId}
              columns={
                info.robotType == 0 ? columns_text : info.robotType == 1 ? columns_sound : []
              }
              dataSource={dataSource}
              pagination={false}
              bordered
              sticky={true}
              scroll={{ y: 270 }}
              size={'small'}
              summary={(pageData) => {
                let totalclarifyReplyNum = 0;
                let totalclarifyConfirmDistinctNum = 0;
                let totalclarifyUnconfirmedReplyNum = 0;
                let totalclarifyReplyRate: any;

                let totalrecommendReplyNum = 0;
                let totalrecommendDistinctConfirmNum = 0;
                let totalrecommendReplyUnconfirmedNum = 0;
                let totalrecommendReplyConfimRate: any;

                pageData.forEach(
                  ({
                    clarifyReplyNum,
                    clarifyConfirmDistinctNum,
                    clarifyUnconfirmedReplyNum,
                    clarifyReplyRate,

                    recommendReplyNum,
                    recommendDistinctConfirmNum,
                    recommendReplyUnconfirmedNum,
                    recommendReplyConfirmRate,
                  }) => {
                    totalclarifyReplyNum += clarifyReplyNum;
                    totalclarifyConfirmDistinctNum += clarifyConfirmDistinctNum;
                    totalclarifyUnconfirmedReplyNum += clarifyUnconfirmedReplyNum;
                    totalclarifyReplyRate =
                      totalclarifyConfirmDistinctNum == 0 || totalclarifyReplyNum == 0
                        ? '0.00%'
                        : twoDecimal_f(
                            Math.floor(
                              (totalclarifyConfirmDistinctNum / totalclarifyReplyNum) * 10000,
                            ) / 100,
                          ) + '%';

                    totalrecommendReplyNum += recommendReplyNum;
                    totalrecommendDistinctConfirmNum += recommendDistinctConfirmNum;
                    totalrecommendReplyUnconfirmedNum += recommendReplyUnconfirmedNum;
                    totalrecommendReplyConfimRate =
                      totalrecommendDistinctConfirmNum == 0 || totalrecommendReplyNum == 0
                        ? '0.00%'
                        : twoDecimal_f(
                            Math.floor(
                              (totalrecommendDistinctConfirmNum / totalrecommendReplyNum) * 10000,
                            ) / 100,
                          ) + '%';
                  },
                );
                if (dataSource?.length)
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text>{totalclarifyReplyNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <Text>{totalclarifyConfirmDistinctNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <Text>{totalclarifyUnconfirmedReplyNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4}>
                          <Text>{totalclarifyReplyRate}</Text>
                        </Table.Summary.Cell>
                        {info.robotType == 0 && (
                          <Fragment>
                            <Table.Summary.Cell index={5}>
                              <Text>{totalrecommendReplyNum}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                              <Text>{totalrecommendDistinctConfirmNum}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                              <Text>{totalrecommendReplyUnconfirmedNum}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                              <Text>{totalrecommendReplyConfimRate}</Text>
                            </Table.Summary.Cell>
                          </Fragment>
                        )}
                      </Table.Summary.Row>
                    </Table.Summary>
                  );
              }}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
};
