import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';

import IntentOperModal from './comps/addIntentModal';
import RulesSampleModal from './comps/rulesAndsamples';

import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';

import { Button, Space, Popconfirm } from 'antd';
import { tableList, fakeData } from './comps/config';

export type TableListItem = {
  id: string;
  intentName: string;
  inquiryText: string;
  headIntent: string;
  flowName: string;
  intentDesc: string;
  creator: string;
  createTime: string;
  trainData: string;
  operation: string;
};

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  // const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [loading, handleLoading] = useState<boolean>(false);
  const [intentOperVisible, handleIntentOperVisible] = useState<boolean>(false); // 控制意图操作弹出层是否可见
  const [intentOperTitle, handleIntentOperTitle] = useState<string>(''); // 控制意图操作弹出层标题
  const [intentOperData, handleIntentOperData] = useState<any>({}); // 控制意图操作弹出层数据

  const [rulesSamleVisible, handleRulesSampleVisible] = useState<boolean>(false);

  const operation: any = [
    {
      dataIndex: 'trainData',
      title: '训练数据',
      search: false,
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => ruleTemplate(record)}>规则模版</a>
            <a onClick={() => samples(record)}>样板</a>
          </Space>
        );
      },
    },
    {
      dataIndex: 'operation',
      title: '操作',
      search: false,
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => operIntent(record, 'edit')}>编辑</a>
            <Popconfirm
              title="确认删除此意图吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => deleteIntent(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {}, []);

  const getTables: any = async (p?: any) => {
    console.log(p);
    const [pageData] = p;
    let data: any = [];
    try {
      handleLoading(true);
      // const res = await
      return {
        data: fakeData,
        pageSize: pageData.pageSize || 10,
        current: pageData.current || 1,
        total: 1,
      };
    } catch {
      return {
        data: data,
        pageSize: 10,
        current: 1,
        total: 1,
      };
    } finally {
      handleLoading(false);
    }
  };

  // 规则模版
  const ruleTemplate = (data: any) => {
    handleRulesSampleVisible(true);
  };

  // 样板
  const samples = (data: any) => {
    handleRulesSampleVisible(true);
  };

  // 操作意图 新增、编辑
  const operIntent = (data: any, type: string) => {
    type == 'add' && handleIntentOperTitle('新增');
    type == 'edit' && handleIntentOperTitle('编辑');
    handleIntentOperData({ ...data });
    handleIntentOperVisible(true);
  };

  // 删除意图
  const deleteIntent = (data: any) => {};

  // 意图弹出框确认按钮
  const operIntentSubmit = () => {
    handleIntentOperVisible(false);
  };

  // 意图弹出框取消按钮
  const operIntentFail = () => {
    handleIntentOperVisible(false);
  };

  // 规则模版抽屉框关闭按钮
  const rulesSampleDrawerClose = () => {
    handleRulesSampleVisible(false);
  };

  return (
    <React.Fragment>
      <ProTable<TableListItem>
        loading={loading}
        headerTitle={'意图列表'}
        rowKey={(record) => record?.id}
        columns={[...tableList, ...operation]}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" onClick={() => operIntent({}, 'add')}>
            新增
          </Button>,
        ]}
        request={async (...params) => {
          return getTables(params);
        }}
      />

      <IntentOperModal
        visible={intentOperVisible}
        title={intentOperTitle}
        modalData={intentOperData}
        submit={operIntentSubmit}
        cancel={operIntentFail}
      />

      <RulesSampleModal
        title="规则模版列表"
        visible={rulesSamleVisible}
        onCancel={rulesSampleDrawerClose}
      />
    </React.Fragment>
  );
};

export default DetailPages;
