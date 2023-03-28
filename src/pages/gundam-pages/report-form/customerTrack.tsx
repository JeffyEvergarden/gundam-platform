import React, { useRef, useState } from 'react';
import { Button, DatePicker, message, Popconfirm, Select } from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './index.less';
import { Access, useAccess, useModel } from 'umi';
import { useReportForm } from './model';
import config from '@/config';
import moment from 'moment';

const CustomerTrack: React.FC<any> = (props: any) => {
  const { RangePicker }: any = DatePicker;
  const access = useAccess();
  const formRef = useRef<any>(null);
  const { searchCustomerTrack, tableLoading } = useReportForm();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  let columns: any = [
    {
      title: '来电时间',
      dataIndex: 'callTime',
      initialValue: [moment().subtract(6, 'day'), moment()],
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <RangePicker
            ranges={{
              昨天: [moment().subtract(1, 'day'), moment()],
              今天: [moment(), moment()],
              最近7天: [moment().subtract(6, 'day'), moment()],
              最近一个月: [moment().subtract(1, 'month'), moment()],
            }}
            placeholder={['开始时间', '结束时间']}
          />
        );
      },
      onCell: (_: any) => ({
        rowSpan: _.span,
      }),
    },
    {
      title: '来电号码',
      dataIndex: 'mobile',
      onCell: (_: any) => ({
        rowSpan: _.span,
      }),
    },
    {
      title: '节点',
      dataIndex: 'nodeName',
      search: false,
    },
    {
      title: '客户轨迹',
      dataIndex: 'customerTrack',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      search: false,
      valueEnum: {
        1: { text: '意图' },
        2: { text: 'FAQ' },
        3: { text: '流程' },
        4: { text: '澄清名单' },
        5: { text: '黑名单' },
        6: { text: '模型拒识' },
        7: { text: '模型澄清' },
        8: { text: '静默' },
      },
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      search: false,
    },
  ];
  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable
        headerTitle={'课程管理'}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
        }}
        bordered
        formRef={formRef}
        toolBarRender={() => {
          return [
            <Access
              accessible={access.accessAuth('robot_mg-report-search-customerTrack-export_bt')}
            >
              <Button
                onClick={() => {
                  let formData = formRef?.current?.getFieldsValue();
                  console.log(formData);
                  if (!formData.callTime?.length) {
                    message.warning('请选择来电时间范围');
                    return;
                  }
                  let startTime = moment(formData?.callTime?.[0]).format('YYYY-MM-DD');
                  let endTime = moment(formData?.callTime?.[1]).format('YYYY-MM-DD');
                  window.open(
                    `${
                      config.basePath
                    }/robot/statistics/customerTrackExport?startTime=${startTime}&endTime=${endTime}&mobileNo=${
                      formData?.mobile || ''
                    }&robotId=${info.id || ''}&customerTrack=${formData?.customerTrack || ''}`,
                  );
                }}
              >
                导出
              </Button>
            </Access>,
          ];
        }}
        search={{
          labelWidth: 100,
          span: 8,
          defaultCollapsed: false,
          collapseRender: () => null,
        }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        rowKey="id"
        loading={tableLoading}
        request={async (params = {}, sort, filter) => {
          params.startTime = params?.callTime?.[0] || undefined;
          params.endTime = params?.callTime?.[1] || undefined;
          return searchCustomerTrack({ page: params?.current, ...params, robotId: info.id });
        }}
      />
    </div>
  );
};

export default CustomerTrack;
