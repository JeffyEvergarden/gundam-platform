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

export default {
  // 机器人管理相关
  'GET /aichat/robot/intent/intentList': intentList,
  'GET /aichat/robot/entity/intentRulePageList': intentRulePageList,
};
