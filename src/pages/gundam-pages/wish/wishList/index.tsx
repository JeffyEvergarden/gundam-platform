import React, { useRef, useState } from 'react';
import { history, useModel } from 'umi';

import IntentOperModal from './comps/addIntentModal';
// import RulesSampleModal from './comps/rulesAndsamples';

import { useIntentModel } from './model';

import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import Tip from '@/components/Tip';
import config from '@/config/index';
import { Button, message, Popconfirm, Space } from 'antd';
// import { tableList } from './comps/config';

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

  const tableList: any = [
    {
      dataIndex: 'intentName',
      title: '意图名称',
      search: true,
      ellipsis: true,
      fixed: 'left',
      width: 200,
    },
    {
      dataIndex: 'headIntent',
      title: () => (
        <>
          {'意图类型'}
          <Tip
            title={
              '意图分为头部意图和辅助意图。头部意图指包含业务含义的意图，例如“手动还款”“更换银行卡”，业务流程中可以关联头部意图，使客户表述该意图时进入对应的业务流程进行处理。辅助意图指“肯定回答”“否定回答”这种不带业务含义的意图，可以用于节点间的连线判断。'
            }
          />
        </>
      ),
      search: true,
      ellipsis: true,
      width: 100,
      initialValue: '',
      valueEnum: {
        0: { text: '头部意图', status: 0 },
        1: { text: '辅助意图', status: 1 },
      },
    },
    {
      dataIndex: 'inquiryText',
      title: () => (
        <>
          {'澄清名称'}
          <Tip
            title={
              '当客户文本触发机器人意图澄清，例如语音机器人会反问“您是想咨询{}还是{}”，此时会将需要澄清意图的澄清名称放入花括号中进行播放。澄清名称含义与意图名称一致，但应该更简洁明了，适合于语音播报中。'
            }
          />
        </>
      ),
      search: false,
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'suggest',
      title: () => (
        <>
          {'是否联想'}
          <Tip
            title={
              '文本机器人，当客户在页面输入文本，会触发搜索联想，辅助搜索，例如输入“邮你贷”，可以弹出“邮你贷”、“邮你贷热线”、“邮你贷余额”等联想文本。当意图不联想时，该意图不会出现在联想的候选集内。'
            }
          />
        </>
      ),
      search: false,
      ellipsis: true,
      width: 100,
      initialValue: '',
      valueEnum: {
        0: { text: '否', status: 0 },
        1: { text: '是', status: 1 },
      },
    },
    {
      dataIndex: 'clarify',
      title: () => (
        <>
          {'是否澄清'}
          <Tip
            title={`根据阈值和差值计算回复类型时，触发澄清时把澄清列表中不澄清的意图剔除，剔除后澄清意图列表数量如果大于等于2，则继续澄清逻辑，等于1则明确回复top1意图，等于0则明确回复原来的top1意图。举例，机器人配置阈值0.9，差值0.05，一次NLU的结果如下(字母为意图，小数为意图对应的得分)：
              {
                  A:0.98
                  B:0.97
                  C:0.96
                  D:0.95
                  E:0.94
                  F:0.91
              }
              根据阈值和差值计算，会触发澄清，初始澄清列表为ABCDE：
              如果BC配置为“不澄清”，则剔除后的澄清列表为ADE，话术为  “请问你是想咨询哪个？A、D、E”
              如果BCDE均配置为“不澄清”，则剔除后的澄清列表为A，则明确回复A
              如果ABCDE配置为“不澄清“，则剔除后的澄清列表为空，则明确回复A`}
          />
        </>
      ),
      search: false,
      ellipsis: true,
      width: 100,
      initialValue: '',
      valueEnum: {
        0: { text: '否', status: 0 },
        1: { text: '是', status: 1 },
      },
    },
    // {
    //   dataIndex: 'headIntent',
    //   title: '是否头部意图',
    //   search: true,
    //   valueType: 'select',
    //   width: 160,
    //   valueEnum: {
    //     0: { text: '是', status: 0 },
    //     1: { text: '否', status: 1 },
    //     '': { text: '全部', status: '' },
    //   },
    // },
    {
      dataIndex: 'flowInfoName',
      title: () => (
        <>
          {'业务流程'}
          <Tip title={'展示引用了当前头部意图的业务流程'} />
        </>
      ),
      search: false,
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'intentDesc',
      title: '描述',
      search: false,
      ellipsis: true,
      width: 260,
    },
    //   {
    //     dataIndex: 'status',
    //     title: '状态',
    //     valueEnum: {
    //       '0': { text: '成功', status: '0' },
    //       '1': { text: '失败', status: '1' },
    //     },
    //   },
    {
      dataIndex: 'creator',
      title: '创建者',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      search: false,
      ellipsis: true,
      width: 120,
    },
  ];

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
        intentName: pageData?.intentName,
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
    // handleRulesSampleVisible(true);
    history.push({
      pathname: '/gundamPages/wish/ruleMould',
      state: {
        info: data,
      },
    });
  };

  // 样本
  const samples = (data: any) => {
    // handleRulesSampleVisible(true);
    history.push({
      pathname: '/gundamPages/sample',
      state: {
        id: data.id,
        pageType: 'wish',
        info: data,
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
      width: 140,
      fixed: 'right',
      search: false,
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => ruleTemplate(record)}>规则模版</a>
            <a onClick={() => samples(record)}>语料</a>
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
    <div className={`list-page`}>
      <ProTable<TableListItem>
        loading={loading}
        headerTitle={
          <>
            {'意图列表'}
            <Tip
              title={
                '意图是客户想要做的某件事情，如“手动还款”“更换银行卡”，或者“肯定回答”“否定回答”。'
              }
            />
          </>
        }
        rowKey={(record) => record?.id}
        scroll={{ x: tableList.length * 200 }}
        columns={[
          ...tableList.map((item: any) => {
            if (config.robotTypeMap[info?.robotType] === '语音') {
              if (item.dataIndex == 'suggest') {
                item.hideInTable = true;
              }
            }
            return item;
          }),
          ...operation,
        ]}
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
    </div>
  );
};

export default DetailPages;
