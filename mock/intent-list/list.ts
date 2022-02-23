import { Request, Response } from 'express';

const successCode = '0000';

const getIntentList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: [
      {
        intentName: '意图0011',
        id: '001',
        inquiryText: '澄清1',
        headIntent: '0',
        flowName: '业务流程1',
        intentDesc: '意图描述1',
        status: '0',
        creator: 'yyb',
        createTime: '2022-02-14',
      },
      {
        intentName: '意图2',
        id: '002',
        inquiryText: '澄清2',
        headIntent: '1',
        flowName: '业务流程2',
        intentDesc: '意图描述2',
        status: '1',
        creator: 'yyb',
        createTime: '2022-02-18',
      },
    ],
  });
};

const addNewIntent = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const editIntent = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const deleteIntentItem = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

// 意图管理相关
export default {
  // 机器人管理相关
  'GET /aichat/robot/intent/intentList': getIntentList, // 获取意图管理列表
  'POST /aichat/robot/intent/intentAdd': addNewIntent, // 新增意图
  'POST /aichat/robot/intent/intentUpdate': editIntent, // 编辑意图
  'POST /aichat/robot/intent/intentDelete': deleteIntentItem, // 删除意图
};
