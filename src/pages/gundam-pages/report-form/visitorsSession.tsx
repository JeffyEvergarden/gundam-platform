import config from '@/config/index';
import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Space } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import styles from './index.less';
import { useReportForm } from './model';
import { codeToStr } from '@/utils/index';

export default () => {
  const actionRef = useRef<any>();
  const formRef = useRef<any>();
  const chatRecordModalRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
  }));

  const { getDialogue } = useReportForm();

  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '1', orderType: '2' });

  const choseTime = (begin: string, end: string, code: string) => {
    let temp = Object.assign({ ...paramsObj }, { begin: begin, end: end, code: code });
    setParamsObj(temp);
  };

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
      orderCode: payload.orderCode, //排序code 1-时长  2-轮次
      orderType: payload.orderType, //1-正序 2-倒序
      customerId: payload.customerId,
      page: payload.current,
      pageSize: payload.pageSize,
    };
    let res = await getDialogue(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
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
      let sevenDays = moment().subtract(6, 'days');
      let yestody = moment().subtract(0, 'days');
      startTime = sevenDays.format('YYYY-MM-DD');
      endTime = yestody.format('YYYY-MM-DD');
    }
    let customerId = formRef?.current?.getFieldValue('customerId');
    window.open(
      `${
        config.basePath
      }/robot/statistics/sessionExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}&orderCode=${paramsObj.orderCode}&orderType=${
        paramsObj.orderType
      }&customerId=${customerId}`,
      '_self',
    );
  };

  const exportSessionList = (begin: string, end: string, code: string) => {
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
    let customerId = formRef?.current?.getFieldValue('customerId');
    window.open(
      `${
        config.basePath
      }/robot/dialog/sessionDialogueExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}&orderCode=${paramsObj.orderCode}&orderType=${
        paramsObj.orderType
      }&customerId=${customerId}`,
      '_self',
    );
  };

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  // orderCode  1-时长  2-轮次 3-会话开始时间
  //  orderType   1-正序 2-倒序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '1', orderType: '2' };
    if (sorter.columnKey === 'dialogueTurn' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'dialogueTurn' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    if (sorter.columnKey === 'durationFormat' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'durationFormat' && sorter.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }

    if (sorter.columnKey === 'createTime' && sorter.order === 'ascend') {
      temp.orderCode = '3';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'createTime' && sorter.order === 'descend') {
      temp.orderCode = '3';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  const columns: any = [
    {
      title: '会话ID',
      dataIndex: 'id',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        return <a onClick={() => toRecord(r)}>{r.id}</a>;
      },
    },
    {
      title: () => {
        return (
          <Space>
            客户ID
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      search: true,
      dataIndex: 'customerId',
      ellipsis: true,
    },
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
      search: false,
      ellipsis: true,
      render: (t: any, r: any, i: any) => {
        return (
          <span>{channelList?.find((item: any) => item.value == r.channelCode)?.label || ''}</span>
        );
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
      search: false,
      sorter: true,
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
      search: false,
      sorter: true,
      dataIndex: 'durationFormat',
      ellipsis: true,
    },
    {
      title: () => {
        return (
          <Space>
            会话开始时间
            <span>
              <QuestionCircleOutlined />
            </span>
          </Space>
        );
      },
      search: false,
      sorter: true,
      dataIndex: 'createTime',
      ellipsis: true,
    },
  ];

  useEffect(() => {
    getChannelList(info.id);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageComtain}>
        <div className={styles.pageTitile}>访客会话明细</div>
        <HeadSearch
          choseTime={choseTime}
          exportReportForm={exportReportForm}
          exportSessionList={exportSessionList}
          pageType={'visitorSession'}
          permission={'robot_mg-report_visitor_session-export_bt'}
        />
        <div className={styles.Table_box}>
          <div className={styles.visitSession_table}>
            <ProTable
              rowKey={'id'}
              headerTitle={false}
              toolBarRender={false}
              bordered
              formRef={formRef}
              actionRef={actionRef}
              pagination={{
                pageSize: 10,
              }}
              onChange={tableChange}
              columns={columns}
              scroll={{ x: columns.length * 200 }}
              // dataSource={dataSource}
              params={paramsObj}
              request={async (params = {}) => {
                return initialTable(params);
              }}
            />
          </div>
          <ChatRecordModal cref={chatRecordModalRef} />
        </div>
      </div>
    </div>
  );
};
