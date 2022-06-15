import React, { useState, useEffect, useRef, Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import HeadSearch from './components/headSearch';
import { Space, Modal } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import config from '@/config/index';
import classNames from 'classnames';
import { useReportForm } from './model';
import LineChart from './components/lineCharts';
import PieChart from './components/pieCharts';
import { throttle } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CODE } from './enum';
import styles from './index.less';

export default () => {
  const actionRef = useRef<any>();

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

  const { question, rejectList } = useReportForm();

  const [lineList, setList] = useState<any>([]);
  const [dayId, setDayId] = useState<any>([]);

  const [paramsObj, setParamsObj] = useState<any>({});
  const [modalData, setModalData] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

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

  const toNumber = (percent: any) => {
    if (!percent) return;
    let str = percent.slice(0, -1);
    let num = Number(str) / 100;
    return num;
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
    let res = await question(params);
    let temp: any = [];
    let directReplyRate: any = { name: '明确回答率', val: [], isRate: true };
    let clarifyReplyNum: any = { name: '澄清回复数', val: [] };
    let clarifyConfirmReplyNum: any = { name: '澄清确认数', val: [] };
    let discernReplyNum: any = { name: '拒识总数', val: [] };
    let matchRate: any = { name: '匹配率', val: [], isRate: true };
    let day: any = [];
    res.data.list.map((item: any) => {
      directReplyRate.val.push(toNumber(item.directReplyRate));
      clarifyReplyNum.val.push(item.clarifyReplyNum);
      clarifyConfirmReplyNum.val.push(item.clarifyConfirmReplyNum);
      discernReplyNum.val.push(item.discernReplyNum);
      matchRate.val.push(toNumber(item.matchRate));
      day.push(item.dayId);
    });
    temp.push(directReplyRate, clarifyReplyNum, clarifyConfirmReplyNum, discernReplyNum, matchRate);
    setDayId(day);
    setList(temp);
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
    let params = {};
    let res = await rejectList(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.total,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const columnsReject: any = [
    {
      dataIndex: 'entityValue',
      title: '客户问题',
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'entityValue1',
      title: '时间',
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
    },
  ];

  return (
    <div className={styles.pageComtain}>
      <div className={classNames(styles.pageTitile, styles.question_title)}>
        <span>访客次数统计</span>
        <span>历史累计回答:65138</span>
      </div>
      <HeadSearch choseTime={choseTime} exportReportForm={exportReportForm} />
      <div className={styles.visitorBox}>
        <div style={{ width: '30%' }}>
          <PieChart
            id="questionMatch_pie"
            base={base}
            data={[
              { value: 1048, name: '明确回答数', percent: '80%' },
              { value: 735, name: '澄清回复数', percent: '60%' },
              { value: 580, name: '澄清确认数', percent: '70%' },
              { value: 484, name: '推荐确认数', percent: '50%' },
              { value: 300, name: '拒识总数', percent: '40%' },
            ]}
            title={'问题回答比例'}
            color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9']}
            legendData={['明确回答数', '澄清回复数', '澄清确认数', '推荐确认数', '拒识总数']}
          />
        </div>
        <div style={{ width: '70%' }}>
          <LineChart
            id={'questionMatch_line'}
            // width={700}
            loading={null}
            title={'问题匹配率统计'}
            base={base}
            columns={dayId}
            data={lineList}
            color={['#6395F9', '#62DAAB', '#657798', '#F6C022', '#7666F9']}
            legendData={['明确回答率', '澄清回复数', '澄清确认数', '拒识总数', '匹配率']}
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
          // scroll={{ x: columns.length * 200 }}
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
      </Modal>
    </div>
  );
};
