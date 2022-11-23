import Tip from '@/components/Tip';
import config from '@/config/index';
import { throttle, twoDecimal_f } from '@/utils';
import { codeToStr } from '@/utils/index';
import { Space, Spin, Table, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import styles from './index.less';
import { useReportForm } from './model';

const { Text } = Typography;

export default () => {
  const { getVisitorList, tableLoading } = useReportForm();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const rate = document.body.clientWidth / 1366;
  const [base, setBase] = useState<number>(rate);

  const [visitorList, setList] = useState<any>([]);
  const [dayId, setDayId] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);

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

  useEffect(() => {
    getVisitor('', '', '');
  }, []);

  const getVisitor = async (begin: string, end: string, code: string) => {
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
    let res = await getVisitorList(params);
    let temp: any = [];
    let visitNum: any = { name: '访问次数', val: [] };
    let validVisitNum: any = { name: '有效访问次数', val: [] };
    let visitorNum: any = { name: '访客人数', val: [] };
    let validVisitorNum: any = { name: '有效访客人数', val: [] };
    let dialogueTurn: any = { name: '对话轮次', val: [] };
    let day: any = [];
    setDataSource(res?.data);
    res?.data?.map((item: any) => {
      visitNum.val.push(item.visitNum);
      validVisitNum.val.push(item.validVisitNum);
      visitorNum.val.push(item.visitorNum);
      validVisitorNum.val.push(item.validVisitorNum);
      dialogueTurn.val.push(item.dialogueTurn);
      day.push(item.dayId);
    });
    temp.push(visitNum, validVisitNum, visitorNum, validVisitorNum, dialogueTurn);
    setDayId(day);
    setList(temp);
  };

  const choseTime = (begin: string, end: string, code: string) => {
    getVisitor(begin, end, code);
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
      }/robot/statistics/visitorExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}`,
    );
  };

  const columns: any = [
    { title: '日期', dataIndex: 'dayId', ellipsis: true },
    {
      title: () => {
        return (
          <Space>
            访问次数
            <span>
              <Tip title={'访问的总次数，session_id去重数量'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'visitNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            有效访问次数
            <span>
              <Tip title={'访客次数中，客户至少输入过1次内容的次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'validVisitNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            访客人数
            <span>
              <Tip
                title={
                  '根据客户标识（customer_id）进行去重的访问次数，当渠道多选或全选时根据渠道分组计算再累加'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'visitorNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            有效访客人数
            <span>
              <Tip
                title={
                  '访客人数中，客户至少输入过1次内容的次数，当渠道多选或全选时根据渠道分组计算再累加'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'validVisitorNum',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            对话轮次
            <span>
              <Tip
                title={
                  '忽略机器人的开场白，以客户第一次输入开始计算，客户先问、机器人后答为一轮，计算所有会话的对话轮次总和。'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            平均对话轮次
            <span>
              <Tip title={'对话轮次/访问次数'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'averageDialogueTurn',
      ellipsis: true,
      render: (val: any, row: any) => {
        return row.averageDialogueTurnStr;
      },
    },
    {
      title: () => {
        return (
          <Space>
            主动转人工次数
            <span>
              <Tip
                title={
                  '对话中，客户文本命中“转人工”意图的访问次数，代表客户主动要求转人工。一通对话中命中多次“转人工”，只算一次。'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            转人工次数
            <span>
              <Tip
                title={
                  '从机器人转到客服坐席的次数（不一定成功接入，可能排队时客户挂断了），包括客户主动要求转人工、机器人主动转入人工（比如多次拒识、多次词槽获取失败）的次数。也是流程走到业务流程“转人工服务流程”中“转人工排队”节点的次数。'
                }
              />
            </span>
          </Space>
        );
      },
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            转人工率
            <span>
              <Tip title={'转人工次数/访问次数 ，四舍五入保留4位小数，百分比格式展示。'} />
            </span>
          </Space>
        );
      },
      dataIndex: 'dialogueTurn',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageComtain}>
        <div className={styles.pageTitile}>访客次数统计</div>
        <HeadSearch
          choseTime={choseTime}
          exportReportForm={exportReportForm}
          permission={'robot_mg-report_visitor_count-export_bt'}
        />
        <div className={styles.visitorBox}>
          <LineChart
            id={'visitorNumber'}
            loading={tableLoading}
            title={''}
            dataSource={dataSource}
            base={base}
            columns={dayId}
            data={visitorList}
            color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9']}
            legendData={['访问次数', '有效访问次数', '访客人数', '有效访客人数', '对话轮次']}
            className={styles.visitorBox}
          />
        </div>
        <div className={styles.Table_box}>
          <Spin spinning={tableLoading}>
            <Table
              rowKey={(record: any) => record.dayId}
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ y: 270 }}
              sticky={true}
              size={'small'}
              summary={(pageData) => {
                let totalvisitNum = 0;
                let totalvalidVisitNum = 0;
                let totalvisitorNum = 0;
                let totalvalidVisitorNum = 0;
                let totaldialogueTurn = 0;
                let totalaverageDialogueTurn: any;

                pageData.forEach(
                  ({
                    visitNum,
                    validVisitNum,
                    visitorNum,
                    validVisitorNum,
                    dialogueTurn,
                    averageDialogueTurn,
                  }) => {
                    totalvisitNum += visitNum;
                    totalvalidVisitNum += validVisitNum;
                    totalvisitorNum += visitorNum;
                    totalvalidVisitorNum += validVisitorNum;
                    totaldialogueTurn += dialogueTurn;
                    totalaverageDialogueTurn =
                      totaldialogueTurn == 0 || totalvisitNum == 0
                        ? 0
                        : twoDecimal_f(Math.floor((totaldialogueTurn / totalvisitNum) * 100) / 100);
                  },
                );
                if (dataSource?.length)
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text>{totalvisitNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <Text>{totalvalidVisitNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <Text>{totalvisitorNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4}>
                          <Text>{totalvalidVisitorNum}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5}>
                          <Text>{totaldialogueTurn}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={6}>
                          <Text>{totalaverageDialogueTurn}</Text>
                        </Table.Summary.Cell>
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
