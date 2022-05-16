import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';

import IntentOperModal from './comps/addIntentModal';
// import RulesSampleModal from './comps/rulesAndsamples';

import { useIntentModel } from './model';

import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';

import { Button, Space, Popconfirm, message } from 'antd';
import { tableList } from './comps/config';
import config from '@/config/index';

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
  const actionRef = useRef<ActionType>();
  const [loading, handleLoading] = useState<boolean>(false);
  const [intentOperVisible, handleIntentOperVisible] = useState<boolean>(false); // 控制意图操作弹出层是否可见
  const [intentOperTitle, handleIntentOperTitle] = useState<string>(''); // 控制意图操作弹出层标题
  const [intentOperData, handleIntentOperData] = useState<any>({}); // 控制意图操作弹出层数据

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [rulesSamleVisible, handleRulesSampleVisible] = useState<boolean>(false);
  const { getIntentTableList, deleteIntentItem } = useIntentModel();
  const getTables: any = async (p?: any) => {
    const [pageData] = p;
    let data: any = [];
    try {
      handleLoading(true);
      let params = {
        robotId: info.id,
        pageSize: pageData.pageSize,
        page: pageData.current,
        headIntent: pageData?.headIntent,
      };
      const res: any = await getIntentTableList(params);
      return {
        data: res?.data?.list || [],
        pageSize: pageData.pageSize,
        current: pageData.current,
        total: res?.data?.totalPage || res?.data?.list?.length || 0,
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
    // handleRulesSampleVisible(true);
    history.push({
      pathname: '/gundamPages/sample',
      state: {
        id: data.id,
        pageType: 'wish',
      },
    });
  };

  // 操作意图 新增、编辑
  const operIntent = (data: any, type: string) => {
    handleIntentOperTitle(type);
    handleIntentOperData({ ...data });
    handleIntentOperVisible(true);
  };

  // 删除意图
  const deleteIntent = async (data: any) => {
    const res: any = await deleteIntentItem({ robotId: info.id, id: data.id });
    if (res?.resultCode == config.successCode) {
      message.success(res?.resultDesc);
      refreshTable();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  // 意图弹出框确认按钮
  const operIntentSubmit = () => {
    handleIntentOperVisible(false);
    refreshTable();
  };

  // 意图弹出框取消按钮
  const operIntentFail = () => {
    handleIntentOperVisible(false);
    refreshTable();
  };

  // 规则模版抽屉框关闭按钮
  const rulesSampleDrawerClose = () => {
    handleRulesSampleVisible(false);
  };

  const operation: any = [
    {
      dataIndex: 'trainData',
      title: '训练数据',
      width: 160,
      search: false,
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => ruleTemplate(record)}>规则模版</a>
            <a onClick={() => samples(record)}>样本</a>
          </Space>
        );
      },
    },
    {
      dataIndex: 'operation',
      title: '操作',
      search: false,
      fixed: 'right',
      width: 160,
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
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const refreshTable = () => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  };

  return (
    <React.Fragment>
      <ProTable<TableListItem>
        loading={loading}
        headerTitle={'意图列表'}
        rowKey={(record) => record?.id}
        scroll={{ x: tableList.length * 200 }}
        columns={[...tableList, ...operation]}
        actionRef={actionRef}
        style={{ backgroundColor: 'white' }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => operIntent({}, 'add')}>
            新增
          </Button>,
        ]}
        search={{
          defaultCollapsed: false,
          labelWidth: 'auto',
        }}
        request={async (...params) => {
          return getTables(params);
        }}
      />

      <IntentOperModal
        visible={intentOperVisible}
        title={intentOperTitle}
        modalData={{ ...intentOperData, robotId: info.id }}
        submit={operIntentSubmit}
        cancel={operIntentFail}
      />

      {/* <RulesSampleModal
        title="规则模版列表"
        visible={rulesSamleVisible}
        onCancel={rulesSampleDrawerClose}
      /> */}
    </React.Fragment>
  );
};

export default DetailPages;
