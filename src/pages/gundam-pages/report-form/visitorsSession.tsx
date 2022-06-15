import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useModel } from 'umi';
import HeadSearch from './components/headSearch';
import ProTable from '@ant-design/pro-table';
import ChatRecordModal from '@/pages/gundam-pages/FAQ-module/components/chat-record-modal';
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import config from '@/config/index';
import styles from './index.less';
import { CODE } from './enum';
import { useReportForm } from './model';

export default () => {
  const actionRef = useRef<any>();
  const chatRecordModalRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
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
      orderCode: payload.orderCode, //排序code 1-时长  2-轮次
      orderType: payload.orderType, //1-正序 2-倒序
      page: payload.current,
      pageSize: payload.pageSize,
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

  const toRecord = (row: any) => {
    chatRecordModalRef.current?.open?.(row);
  };

  // orderCode  1-时长  2-轮次
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
    if (sorter.columnKey === 'duration' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'duration' && sorter.order === 'descend') {
      temp.orderCode = '1';
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
      render: (t: any, r: any, i: any) => {
        return <a onClick={() => toRecord(r)}>{r.id}</a>;
      },
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
      sorter: true,
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
          onChange={tableChange}
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
      <ChatRecordModal cref={chatRecordModalRef} />
    </div>
  );
};
