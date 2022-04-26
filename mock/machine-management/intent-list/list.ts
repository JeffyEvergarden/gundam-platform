import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const getIntentList = (req: any, res: any) => {
  const datas = [
    {
      intentName: '意图01',
      id: '001',
      inquiryText: '澄清01',
      headIntent: 0,
      flowName: '业务流程01',
      intentDesc: '意图描述01',
      status: 0,
      creator: 'yyb',
      createTime: '2022-02-14',
    },
    {
      intentName: '意图02',
      id: '002',
      inquiryText: '澄清02',
      headIntent: 1,
      flowName: '业务流程02',
      intentDesc: '意图描述02',
      status: 1,
      creator: 'yyb',
      createTime: '2022-02-18',
    },
  ];
  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalSize: 200,
      page: 10,
      list: datas,
    },
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

const getIntentInfoData = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    datas: [
      {
        intentName: '意图选择0001',
        id: '001',
        inquiryText: '澄清1',
        headIntent: 0,
        flowName: '业务流程1',
        intentDesc: '意图描述1',
        status: 0,
        creator: 'yyb',
        createTime: '2022-02-14',
      },
      {
        intentName: '意图选择0002',
        id: '002',
        inquiryText: '澄清2',
        headIntent: 1,
        flowName: '业务流程2',
        intentDesc: '意图描述2',
        status: 1,
        creator: 'yyb',
        createTime: '2022-02-18',
      },
      {
        intentName: '意图选择0003',
        id: '003',
        inquiryText: '澄清3',
        headIntent: 1,
        flowName: '业务流程3',
        intentDesc: '意图描述3',
        status: 1,
        creator: 'yyb',
        createTime: '2022-02-18',
      },
      {
        intentName: '意图选择0004',
        id: '004',
        inquiryText: '澄清4',
        headIntent: 1,
        flowName: '业务流程4',
        intentDesc: '意图描述4',
        status: 1,
        creator: 'yyb',
        createTime: '2022-02-18',
      },
      {
        intentName: '意图选择0005',
        id: '005',
        inquiryText: '澄清5',
        headIntent: 1,
        flowName: '业务流程5',
        intentDesc: '意图描述5',
        status: 1,
        creator: 'yyb',
        createTime: '2022-02-18',
      },
    ],
  });
};

// 意图管理相关
export default {
  // 机器人管理相关
  'GET /aichat/robot/intent/intentList': getIntentList, // 获取意图管理列表
  'POST /aichat/robot/intent/intentInfo': getIntentInfoData, // 获取意图管理列表
  'POST /aichat/robot/intent/intentAdd': addNewIntent, // 新增意图
  'POST /aichat/robot/intent/intentUpdate': editIntent, // 编辑意图
  'POST /aichat/robot/intent/intentDelete': deleteIntentItem, // 删除意图
};
