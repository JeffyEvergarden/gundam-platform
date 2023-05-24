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
  const {
    searchvisitorsQuestion,
    visitorsQuestionSampleExport,
    visitorsQuestionExport,
    tableLoading,
    exportLoading,
  } = useReportForm();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '', orderType: '' });

  let columns: any = [
    {
      title: '分类',
      dataIndex: 'typeName',
      search: false,
    },
    {
      title: '标准问/意图',
      dataIndex: 'textName',
    },
    {
      title: '选择类型',
      dataIndex: 'textType',
      hideInTable: true,
      valueEnum: {
        1: '意图',
        2: '标准问',
      },
    },
    {
      title: '日期',
      dataIndex: 'callTime',
      // initialValue: [moment().subtract(6, 'day'), moment()],
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <RangePicker
            ranges={{
              昨天: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
              今天: [moment(), moment()],
              最近7天: [moment().subtract(6, 'day'), moment()],
              最近一个月: [moment().subtract(1, 'month'), moment()],
            }}
            placeholder={['开始时间', '结束时间']}
          />
        );
      },
      hideInTable: true,
    },
    {
      title: '被问总次数',
      dataIndex: 'accessNum',
      search: false,
      sorter: true,
    },
    {
      title: '微信占比',
      dataIndex: 'mediaWxProportion',
      search: false,
    },
    {
      title: '支付宝占比',
      dataIndex: 'mediaZfbProportion',
      search: false,
    },
    {
      title: '中邮钱包占比',
      dataIndex: 'mediaZyqbProportion',
      search: false,
    },
    {
      title: '邮储手机银行占比',
      dataIndex: 'mediaYcsjyhProportion',
      search: false,
    },
    {
      title: '集团邮务占比',
      dataIndex: 'mediaJtywProportion',
      search: false,
    },
    {
      title: '官网占比',
      dataIndex: 'mediaGwProportion',
      search: false,
    },
    {
      title: '总占比',
      dataIndex: 'totalProportion',
      search: false,
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const exportFile = async (response: any) => {
    const contentDisposition = response.headers.get('Content-Disposition');
    const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = regex.exec(contentDisposition || '');
    let fileName = matches && matches[1] ? matches[1].replace(/['"]/g, '') : '';
    console.log(fileName);

    fileName = decodeURIComponent(fileName); // 解码文件名
    // fileName = encodeURI(fileName);
    const reader = response.body.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }

    const blob = new Blob(chunks, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'file.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '', orderType: '' };
    if (sorter.columnKey === 'accessNum' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'accessNum' && sorter.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable
        headerTitle={'访问问题统计'}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
        }}
        params={paramsObj}
        onChange={tableChange}
        rowSelection={rowSelection}
        bordered
        formRef={formRef}
        toolBarRender={() => {
          return [
            <Access
              accessible={access.accessAuth('robot_mg-report-visitors_question-view-export_bt')}
            >
              <Button
                loading={exportLoading}
                onClick={() => {
                  if (!selectedRowKeys?.length) {
                    message.warning('请勾选表格');
                    return;
                  }
                  let formData = formRef?.current?.getFieldsValue();
                  console.log(formData);
                  if (formData?.callTime?.length == 2) {
                    let startTime = moment(formData?.callTime?.[0]).format('YYYY-MM-DD');
                    let endTime = moment(formData?.callTime?.[1]).format('YYYY-MM-DD');
                    formData.startTime = startTime;
                    formData.endTime = endTime;
                  }

                  visitorsQuestionSampleExport({
                    robotId: info.id,
                    ...formData,
                    textIds: [...selectedRowKeys],
                  })
                    .then(exportFile)
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                导出会话样本
              </Button>
            </Access>,
            <Access
              accessible={access.accessAuth('robot_mg-report-visitors_question-view-export_bt')}
            >
              <Button
                loading={exportLoading}
                onClick={async () => {
                  let formData = formRef?.current?.getFieldsValue();
                  console.log(formData);
                  if (formData?.callTime?.length == 2) {
                    let startTime = moment(formData?.callTime?.[0]).format('YYYY-MM-DD');
                    let endTime = moment(formData?.callTime?.[1]).format('YYYY-MM-DD');
                    formData.startTime = startTime;
                    formData.endTime = endTime;
                  }

                  await visitorsQuestionExport({
                    robotId: info.id,
                    ...formData,
                    textIds: [...selectedRowKeys],
                  })
                    .then(exportFile)
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                导出报表
              </Button>
            </Access>,
          ];
        }}
        search={{
          labelWidth: 'auto',
          span: 6,
          defaultCollapsed: false,
          collapseRender: () => null,
        }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        rowKey="textId"
        loading={tableLoading}
        request={async (params = {}, sort, filter) => {
          if (params?.callTime?.length) {
            params.startTime = moment(params?.callTime?.[0]).format('YYYY-MM-DD') || undefined;
            params.endTime = moment(params?.callTime?.[1]).format('YYYY-MM-DD') || undefined;
          }

          return searchvisitorsQuestion({ page: params?.current, ...params, robotId: info.id });
        }}
      />
    </div>
  );
};

export default CustomerTrack;