import config from '@/config/index';
import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import { throttle, toNumber } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Modal, Space } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import LineChart from './components/lineCharts';
import PieChart from './components/pieCharts';
import { CODE } from './enum';
import styles from './index.less';
import { useReportForm } from './model';

export default () => {
  const actionRef = useRef<any>();

  const chatRecordModalRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));
  // 比率计算
  const rate = document.body.clientWidth / 1366;
  const [base, setBase] = useState<number>(rate);

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

  const resize = () => {
    const html = document.documentElement;
    const realRate = document.body.clientWidth / 1920;
    const rate = realRate <= 0.7 ? 0.7 : realRate;
    html.style.fontSize = rate * 20 + 'px';
    setBase(rate);
  };

  const { question, rejectList, tableLoading } = useReportForm();

  const [lineList, setList] = useState<any>([]);
  const [dayId, setDayId] = useState<any>([]);
  const [sumReplyNum, setsumReplyNum] = useState<string>('');
  const [historySumReplyNum, sethistorySumReplyNum] = useState<string>('');
  const [pieList, setPieList] = useState<any>([]);

  const [paramsObj, setParamsObj] = useState<any>({});
  const [modalData, setModalData] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);

  const choseTime = (begin: string, end: string, code: string) => {
    setParamsObj({ begin: begin, end: end, code: code });
  };

  const openModel = (r: any) => {
    setVisible(true);
    setModalData(r);
  };
  const onCancel = () => {
    setVisible(false);
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
        return <a onClick={() => openModel(r)}>{r.discernReplyRate}</a>;
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
    setDataSource(res?.data?.list);
    // 折线图数据处理
    let temp: any = [];
    let directReplyNum: any = { name: '明确回答数', val: [] };
    let clarifyReplyNum: any = { name: '澄清回复数', val: [] };
    let clarifyConfirmReplyNum: any = { name: '澄清确认数', val: [] };
    let recommendReplyConfirmNum: any = { name: '推荐确认数', val: [] };
    let discernReplyNum: any = { name: '拒识总数', val: [] };
    let matchRate: any = { name: '匹配率', val: [], isRate: true };
    let day: any = [];
    res?.data?.list?.map((item: any) => {
      directReplyNum.val.push(item.directReplyNum);
      clarifyReplyNum.val.push(item.clarifyReplyNum);
      clarifyConfirmReplyNum.val.push(item.clarifyConfirmReplyNum);
      recommendReplyConfirmNum.val.push(item.recommendReplyConfirmNum);
      discernReplyNum.val.push(item.discernReplyNum);
      matchRate.val.push(toNumber(item.matchRate));
      day.push(item.dayId);
    });
    temp.push(
      directReplyNum,
      clarifyReplyNum,
      clarifyConfirmReplyNum,
      recommendReplyConfirmNum,
      discernReplyNum,
      matchRate,
    );
    setDayId(day);
    setList(temp);

    // 饼图数据处理
    // [
    //   { value: 1048, name: '明确回答数', percent: '80%' },
    //   { value: 735, name: '澄清回复数', percent: '60%' },
    //   { value: 580, name: '澄清确认数', percent: '70%' },
    //   { value: 484, name: '推荐确认数', percent: '50%' },
    //   { value: 300, name: '拒识总数', percent: '40%' },
    // ]
    setsumReplyNum(res?.data?.sum?.sumReplyNum);
    sethistorySumReplyNum(res?.data?.sum?.historySumReplyNum);
    let sumData = res?.data?.sum;
    setPieList([
      { value: sumData.directReplyNum, name: '明确回答数', percent: sumData.directReplyRate },
      { value: sumData.clarifyReplyNum, name: '澄清回复数', percent: sumData.clarifyReplyRate },
      {
        value: sumData.clarifyConfirmReplyNum,
        name: '澄清确认数',
        percent: sumData.clarifyConfirmReplyRate,
      },
      {
        value: sumData.recommendReplyConfirmNum,
        name: '推荐确认数',
        percent: sumData.recommendReplyConfirmRate,
      },
      { value: sumData.discernReplyNum, name: '拒识总数', percent: sumData.discernReplyRate },
    ]);

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

  const rejectTable = async (payload: any) => {
    let params = {
      dayId: modalData.dayId,
      page: payload.current,
      pageSize: payload.pageSize,
      robotId: info.id,
      channelCode: paramsObj.code,
    };
    let res = await rejectList(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  const columnsReject: any = [
    {
      dataIndex: 'message',
      title: '客户问题',
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'createTime',
      title: '时间',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'channelCode',
      title: '渠道',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return <span>{CODE[r.channelCode]}</span>;
      },
    },
    {
      dataIndex: 'entityValue4',
      title: '操作',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return <a onClick={() => toRecord(r)}>会话记录</a>;
      },
    },
  ];

  return (
    <div className={styles.pageComtain}>
      <div className={classNames(styles.pageTitile, styles.question_title)}>
        <span>问题匹配率统计</span>
        <span>历史累计回答:{historySumReplyNum}</span>
      </div>
      <HeadSearch choseTime={choseTime} exportReportForm={exportReportForm} />
      <div className={styles.visitorBox}>
        <div style={{ width: '30%' }}>
          <PieChart
            id="questionMatch_pie"
            base={base}
            sumReplyNum={sumReplyNum}
            data={pieList}
            dataSource={dataSource}
            loading={tableLoading}
            title={'问题回答比例'}
            color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9']}
            legendData={['明确回答数', '澄清回复数', '澄清确认数', '推荐确认数', '拒识总数']}
          />
        </div>
        <div style={{ width: '70%' }}>
          <LineChart
            id={'questionMatch_line'}
            // width={700}
            loading={tableLoading}
            title={'问题匹配率统计'}
            base={base}
            dataSource={dataSource}
            columns={dayId}
            data={lineList}
            color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9', '#B382D6']}
            legendData={[
              '明确回答率',
              '澄清回复数',
              '澄清确认数',
              '推荐确认数',
              '拒识总数',
              '匹配率',
            ]}
            className={styles.visitorBox}
          />
        </div>
      </div>
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
          sticky={true}
          scroll={{ y: 270 }}
          // dataSource={dataSource}
          params={paramsObj}
          request={async (params = {}) => {
            return initialTable(params);
          }}
        />
      </div>

      <Modal
        visible={visible}
        onCancel={onCancel}
        destroyOnClose={true}
        title={'拒识明细'}
        footer={null}
      >
        <ProTable
          rowKey={(record: any) => record.dayId}
          headerTitle={false}
          toolBarRender={false}
          pagination={{
            pageSize: 10,
          }}
          search={false}
          columns={columnsReject}
          request={async (params = {}) => {
            return rejectTable(params);
          }}
        />
        <ChatRecordModal cref={chatRecordModalRef} />
      </Modal>
    </div>
  );
};
