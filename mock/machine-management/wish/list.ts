import config from './../../../src/config';
const successCode = config.successCode;
const intentList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: '10',
          intentName: '意图名称',
          robotId: '100',
          headIntent: 0,
          inquiryText: '澄清名称',
          flowInfoName: '业务流程', // 0：文本   1：语音
          intentDesc: '这是一段描述', // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
      ],
    },
  });
};

const intentRulePageList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '',
    requestId: '1324',
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: '1001',
          robotId: '100',
          intentRuleName: '意图规则名称',
          threshold: 1,
          dataStatus: 1,
          updateBy: '更新人',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
          robotIntentRuleDetailList: [
            {
              id: '191',
              intentRuleId: '1000',
              required: 1,
              fragment: '规则片段1',
              orderNumber: 2,
            },
            {
              id: '19',
              intentRuleId: '10002',
              required: 0,
              fragment: '规则片段2',
              orderNumber: 12,
            },
          ],
        },
        {
          id: '10011',
          robotId: '100',
          intentRuleName: '意图规则名称2',
          threshold: 1,
          dataStatus: 1,
          updateBy: '更新人',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
          robotIntentRuleDetailList: [
            {
              id: '191',
              intentRuleId: '1000',
              required: 1,
              fragment: '规则片段3',
              orderNumber: 2,
            },
            {
              id: '56',
              intentRuleId: '10002',
              required: 0,
              fragment: '规则片段4',
              orderNumber: 12,
            },
            {
              id: '1977',
              intentRuleId: '10002',
              required: 0,
              fragment: '规则片段5',
              orderNumber: 12,
            },
          ],
        },
      ],
    },
  });
};
const intentFeaturePageList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    requestId: '1323',
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: '1013',
          intentId: '132435',
          key: 'wrw',
          name: '特征词名称',
          wordCount: '词汇量1',
          wordSet: '特征词集,特征词集',
          dataStatus: 1,
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
          updateBy: '折木奉太郎',
          updateTime: '2022-01-15 20:00:00',
        },
        {
          id: '1013',
          intentId: '1324354546',
          key: 'qwqe',
          name: '特征词名称2',
          field_2: '特征词集,特征词集',
          dataStatus: 1,
          wordSet: 2,
          field_1: '词汇量2',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: '1013',
          intentId: '132435343',
          key: 'qwqqwqw',
          name: '特征词名称254',
          field_2: '特征词集,特征词集',
          dataStatus: 1,
          field_1: '词汇量2',
          wordSet: 2,
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
      ],
    },
  });
};

const intentFeatureList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    requestId: '1323',
    data: [
      {
        id: '1013',
        intentId: '132435',
        key: 'wrw',
        name: '特征词名称',
        wordCount: '词汇量1',
        wordSet: '特征词集,特征词集',
        dataStatus: 1,
        creator: '折木奉太郎',
        createTime: '2022-01-15 20:00:00',
        updateBy: '折木奉太郎',
        updateTime: '2022-01-15 20:00:00',
      },
      {
        id: '1013',
        intentId: '1324354546',
        key: 'qwqe',
        name: '特征词名称2',
        field_2: '特征词集,特征词集',
        dataStatus: 1,
        wordSet: 2,
        field_1: '词汇量2',
        creator: '折木奉太郎',
        createTime: '2022-01-15 20:00:00',
      },
      {
        id: '1013',
        intentId: '132435343',
        key: 'qwqqwqw',
        name: '特征词名称254',
        field_2: '特征词集,特征词集',
        dataStatus: 1,
        field_1: '词汇量2',
        wordSet: 2,
        creator: '折木奉太郎',
        createTime: '2022-01-15 20:00:00',
      },
    ],
  });
};

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

export default {
  // 机器人管理相关
  'GET /aichat/robot/intent/intentList': intentList,
  'GET /aichat/robot/intent/intentRulePageList': intentRulePageList,
  'GET /aichat/robot/intent/intentFeaturePageList': intentFeaturePageList,
  'GET /aichat/robot/intent/intentFeatureList': intentFeatureList,
  'POST /aichat/robot/intent/intentRuleAdd': normalDeal,
  'POST /aichat/robot/intent/intentRuleEdit': normalDeal,
  'POST /aichat/robot/intent/intentRuleMove': normalDeal,
  'POST /aichat/robot/intent/intentRuleDelete': normalDeal,
  'POST /aichat/robot/intent/intentFeatureAdd': normalDeal,
  'POST /aichat/robot/intent/intentFeatureEdit': normalDeal,
  'POST /aichat/robot/intent/intentFeatureDelete': normalDeal,
};
