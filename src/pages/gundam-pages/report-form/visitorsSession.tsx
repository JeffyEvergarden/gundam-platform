import Tip from '@/components/Tip';
import config from '@/config/index';
import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import { codeToStr } from '@/utils/index';
import ProTable from '@ant-design/pro-table';
import { Input, InputNumber, message, Space } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import styles from './index.less';
import { useReportForm } from './model';

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

  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '3', orderType: '2' });
  const [dialogueTurnStart, setDialogueTurnStart] = useState<any>('');
  const [dialogueTurnEnd, setDialogueTurnEnd] = useState<any>('');

  const choseTime = (begin: string, end: string, code: string) => {
    let temp = Object.assign({ ...paramsObj }, { begin: begin, end: end, code: code });
    setParamsObj(temp);
  };

  const initialTable = async (payload: any) => {
    console.log('payload', payload);
    if (dialogueTurnStart && dialogueTurnEnd && dialogueTurnStart > dialogueTurnEnd) {
      message.warning('请输入正确的对话轮次范围');
      return;
    }

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
      sessionId: payload.id,
      transferType: payload.transferType,
      dialogueTurnStart,
      dialogueTurnEnd,
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
    let sessionId = formRef?.current?.getFieldValue('id');
    window.open(
      `${
        config.basePath
      }/robot/statistics/sessionExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}&orderCode=${paramsObj.orderCode}&orderType=${
        paramsObj.orderType
      }&customerId=${customerId ?? ''}&sessionId=${sessionId ?? ''}`,
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
    let sessionId = formRef?.current?.getFieldValue('id');
    window.open(
      `${
        config.basePath
      }/robot/dialog/sessionDialogueExport?startTime=${startTime}&endTime=${endTime}${codeToStr(
        code,
      )}&robotId=${info.id}&orderCode=${paramsObj.orderCode}&orderType=${
        paramsObj.orderType
      }&customerId=${customerId ?? ''}&sessionId=${sessionId ?? ''}`,
      '_self',
    );
  };

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  // orderCode  1-时长  2-轮次 3-会话开始时间
  //  orderType   1-正序 2-倒序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '3', orderType: '2' };
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
      title: () => (
        <>
          {'会话ID'}{' '}
          <Tip
            title={
              '标识一次会话的ID，点击可以查看会话记录，会话记录中显示对话文本、文本发生的时间。'
            }
          />
        </>
      ),
      dataIndex: 'id',
      ellipsis: true,
      search: true,
      render: (t: any, r: any, i: any) => {
        return <a onClick={() => toRecord(r)}>{r.id}</a>;
      },

      formItemProps: {
        label: '会话ID',
      },
    },
    {
      title: () => {
        return (
          <Space>
            客户ID
            <span>
              <Tip title={''} />
            </span>
          </Space>
        );
      },

      search: true,
      dataIndex: 'customerId',
      ellipsis: true,
      formItemProps: {
        label: '客户ID',
      },
    },
    {
      title: () => {
        return (
          <Space>
            渠道
            <span>
              <Tip title={'会话发生的渠道，是调用方传入的变量。'} />
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
              <Tip
                title={
                  '忽略机器人的开场白，以客户第一次输入开始计算，客户先问、机器人后答为一轮，计算所有会话的对话轮次总和。'
                }
              />
            </span>
          </Space>
        );
      },
      // valueType: 'digit',
      search: true,
      sorter: true,
      dataIndex: 'dialogueTurn',
      ellipsis: true,
      formItemProps: {
        label: '对话轮次',
      },

      renderFormItem: (item: any, row: any, form: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputNumber
              placeholder="请输入"
              onChange={(val) => {
                setDialogueTurnStart(val);
              }}
              min={0}
              step={1}
              precision={0}
            />
            <span style={{ padding: '0 5px' }}>-</span>
            <InputNumber
              placeholder="请输入"
              onChange={(val) => {
                setDialogueTurnEnd(val);
              }}
              min={0}
              step={1}
              precision={0}
            />
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <Space>
            访问时长
            <span>
              <Tip title={'从机器人的开场白开始，到会话最后一条数据的时长。'} />
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
              <Tip title={'会话的开始时间，一般为开场白时间。'} />
            </span>
          </Space>
        );
      },
      search: false,
      sorter: true,
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: () => {
        return <Space>是否转人工</Space>;
      },
      dataIndex: 'transferType',
      ellipsis: true,
      fieldProps: {
        placeholder: '请选择是否转人工',
      },

      valueType: 'select',
      valueEnum: {
        '': { text: '全部' },
        0: { text: '否' },
        1: { text: '是' },
      },
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
              search={{
                span: 4,
              }}
              onChange={tableChange}
              columns={columns}
              scroll={{ x: columns.length * 200 }}
              // dataSource={dataSource}
              params={paramsObj}
              request={async (params = {}) => {
                return initialTable(params);
              }}
              onReset={() => {
                setDialogueTurnStart('');
                setDialogueTurnEnd('');
              }}
            />
          </div>
          <ChatRecordModal cref={chatRecordModalRef} pageType={'visitorsSession'} />
        </div>
      </div>
    </div>
  );
};
