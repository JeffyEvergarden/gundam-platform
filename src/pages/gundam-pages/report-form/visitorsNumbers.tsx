import React, { useState, useEffect, useRef, Fragment } from 'react';
import { throttle } from '@/utils';
import { useModel } from 'umi';
import { Space, Table, Tooltip, Typography } from 'antd';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import { useReportForm } from './model';
import moment from 'moment';
import config from '@/config/index';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;

export default () => {
  const { getVisitorList } = useReportForm();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  // 比率计算
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

  // 初始化mounted
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
      let sevenDays = moment().subtract(7, 'days');
      let yestody = moment().subtract(1, 'days');
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
    let visitNum: any = { name: '访问总次数', val: [] };
    let validVisitNum: any = { name: '有效访问总次数', val: [] };
    let visitorNum: any = { name: '访客人数', val: [] };
    let validVisitorNum: any = { name: '有效访客人数', val: [] };
    let dialogueTurn: any = { name: '会话次数统计', val: [] };
    let day: any = [];
    setDataSource(res?.data?.list);
    res.data.list.map((item: any) => {
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
      let sevenDays = moment().subtract(7, 'days');
      let yestody = moment().subtract(1, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    window.open(
      `${config.basePath}/robot/statistics/visitorExport?startTime=${startTime}&endTime=${endTime}&channelCode=${code}&robotId=${info.id}`,
      '_self',
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
              <QuestionCircleOutlined />
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
              <QuestionCircleOutlined />
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
              <QuestionCircleOutlined />
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
              <QuestionCircleOutlined />
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
              <QuestionCircleOutlined />
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
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      dataIndex: 'averageDialogueTurn',
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.pageComtain}>
      <div className={styles.pageTitile}>访客次数统计</div>
      <HeadSearch choseTime={choseTime} exportReportForm={exportReportForm} />
      <div className={styles.visitorBox}>
        <LineChart
          id={'visitorNumber'}
          loading={null}
          title={''}
          base={base}
          columns={dayId}
          data={visitorList}
          color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9']}
          legendData={['访问总次数', '有效访问总次数', '访客人数', '有效访客人数', '会话次数统计']}
          className={styles.visitorBox}
        />
      </div>
      <div className={styles.Table_box}>
        <Table
          rowKey={(record: any) => record.dayId}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 300 }}
          size={'small'}
          summary={(pageData) => {
            let totalvisitNum = 0;
            let totalvalidVisitNum = 0;
            let totalvisitorNum = 0;
            let totalvalidVisitorNum = 0;
            let totaldialogueTurn = 0;
            let totalaverageDialogueTurn = 0;

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
                totalaverageDialogueTurn += averageDialogueTurn;
              },
            );

            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
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
      </div>
    </div>
  );
};
