import moment from 'moment';
import config from '../../../src/config';

// faq 富文本模块相关

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getBlackList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index,
      question: '问题' + (index + 1) + '我想问什么来着',
      channelCode: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};

const getClearList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let arr2 = new Array(3).fill(1);
  let _date = Date.now();

  arr2 = arr2.map((item, index) => {
    return {
      question: '问题' + Math.ceil(Math.random() * 100) + '我想问什么来着',
      clarifyAdoptionRate: Number(Math.random().toFixed(2)),
      consultNum: index * 10,
      id: index,
      // question: '问题' + (index + 1) + '我想问什么来着',
      channel: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
      clarifyDetail: [
        {
          recommendId: 1,
          recommendType: 1,
          recommendName: '支付宝还款',
        },
        {
          recommendId: 2,
          recommendType: 1,
          recommendName: '微信还款',
        },
        {
          recommendId: 3,
          recommendType: 2,
          recommendName: '中邮钱包还款',
        },
      ],
      // consultNum: index * 10,
      // clarifyAdoptionRate: Number(Math.random().toFixed(2)),
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
    };
  });

  arr = arr.map((item: any, index: number) => {
    let obj = {
      clarifyGroupId: index + 1,
      robotClarifyListDTOS: arr2,
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};
// 查看会话记录
const getSessionList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      sessionId: 'APP_' + index,
      channelCode: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
      dialogueTurn: (index + 1) * 4,
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};

// ------------
// 获取聊天记录
const getRecordList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      role: Math.random() > 0.5 ? 1 : 0,
      message: '你在说什么呢,能说清楚吗',
      answerText: '我现在就告诉你，爱德华同学',
      dialogueRecommendList: [
        {
          orderNumber: 1,
          recommendText:
            '爱德华.穆罕默德天选之子爱德休斯魔法爱德华.穆罕默德天选之子爱德休斯魔法爱德华.穆罕默德天选之子爱德休斯魔法',
        },
        {
          orderNumber: 2,
          recommendText:
            '爱德华.穆罕默德天选之子爱德休斯魔法爱德华.穆罕默德天选之子爱德休斯魔法爱德华.穆罕默德天选之子爱德休斯魔法',
        },
      ],
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    // data: {
    //   pageSize: 10,
    //   totalPage: 20,
    //   page: 1,
    //   list: arr,
    // },
    data: {
      list: arr,
      callId: '12345callId',
    },
  });
};

//待审核
const getApprovalList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = '2022-06-08 19:19:19';

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: `id${index}`,
      faqId: `faqId${index}`,
      robotId: '100',
      question: `问题${index + 1}`,
      answer: `答案${index + 1}`,
      enable: Math.ceil(Math.random() * 1), //是否启用 0n  1y
      enableStartTime: _date,
      enableEndTime: _date,
      batchNumber: '222', //批次号
      reason: `原因${index + 1}`, //原因
      operationStatus: Math.ceil(Math.random() * 3), //1新增问题,2新增答案,3编辑答案,4删除申请
      approvalStatus: Math.ceil(Math.random() * 3), //1待审核,2通过,3退回
      creator: 'jiangjiahao',
      createTime: _date,
      updateTime: _date,
      updateBy: 'jiangjiahao',
      channelList: ['all'],
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};

const getPendingList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = '2022-06-08 19:19:19';

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: `id${index}`,
      faqId: `faqId${index}`,
      robotId: '100',
      question: `问题${index + 1}`,
      answer: `答案${index + 1}`,
      enable: Math.ceil(Math.random() * 1), //是否启用 0n  1y
      enableStartTime: _date,
      enableEndTime: _date,
      batchNumber: '222', //批次号
      reason: `原因${index + 1}`, //原因
      operationStatus: Math.ceil(Math.random() * 3), //1新增问题,2新增答案,3编辑答案,4删除申请
      approvalStatus: 2, //1待审核,0通过,2退回
      creator: 'jiangjiahao',
      createTime: _date,
      updateTime: _date,
      updateBy: 'jiangjiahao',
      channelList: ['all'],
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};

const getHistoryList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = '2022-06-08 19:19:19';

  arr = arr.map((item: any, index: number) => {
    let obj = {
      historyList: [
        {
          id: `id${index}`,
          robotId: '100',
          question: `问题${index + 1}`,
          answer: `答案${index + 1} <img src=\"\${getResoureUrl}?#\" />`,
          approvalReason: `审批原因${index + 1}`,
          enable: Math.ceil(Math.random() * 1), //是否启用 0n  1y
          enableStartTime: _date,
          enableEndTime: _date,
          batchNumber: '222', //批次号
          reason: `原因${index + 1}`, //原因
          operationStatus: Math.ceil(Math.random() * 4), //1新增问题,2新增答案,3编辑答案,4删除申请
          approvalStatus: Math.floor(Math.random() * 3), //1待审核,0通过,2退回
          creator: 'jiangjiahao',
          createTime: _date,
          updateTime: _date,
          updateBy: 'jiangjiahao',
          channelList: ['all'],
        },
        {
          id: `id${index}2`,
          robotId: '100',
          question: `问题${index + 1}2`,
          answer: `答案${index + 1}2`,
          approvalReason: `审批原因${index + 1}2`,
          enable: Math.ceil(Math.random() * 1), //是否启用 0n  1y
          enableStartTime: _date,
          enableEndTime: _date,
          batchNumber: '2222', //批次号
          reason: `原因${index + 1}2`, //原因
          operationStatus: Math.ceil(Math.random() * 4), //1新增问题,2新增答案,3编辑答案,4删除申请
          approvalStatus: Math.floor(Math.random() * 3), //1待审核,0通过,2退回
          creator: 'jiangjiahao2',
          createTime: _date,
          updateTime: _date,
          updateBy: 'jiangjiahao2',
          channelList: ['all'],
        },
      ],
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 20,
      page: 1,
      list: arr,
    },
  });
};

const getAnswerList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = '2022-06-08 19:19:19';

  arr = arr.map((item: any, index: number) => {
    let obj = {
      faqId: '100',
      id: index,
      question: `问题`,
      answer: `答案${index}`,
      channelList: ['all'],
      enable: 0,
      enableStartTime: _date,
      enableEndTime: _date,
      creator: '张三四',
      faqTypeName: '营销活动类/对外信息',
      viewNum: 99,
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: arr,
  });
};

export default {
  // FAQ-黑名单
  'GET /aichat/robot/blacklist/blacklistPageList': getBlackList, // 获取FAQ-黑名单语料列表
  'POST /aichat/robot/blacklist/blacklistQuestionDelete': normalDeal, // 删除黑名单语料
  'POST /aichat/robot/blacklist/blacklistQuestionAdd': normalDeal,
  // FAQ-澄清
  'GET /aichat/robot/clarify/clarifyPageList': getClearList, // 获取FAQ-澄清语料列表
  'POST /aichat/robot/clarify/clarifyDelete': normalDeal, // 删除澄清语料
  'POST /aichat/robot/clarify/clarifyAdd': normalDeal, // 新增澄清语料
  'POST /aichat/robot/clarify/clarifyDetailAdd': normalDeal, // 修改标准问/意图
  // 查看会话记录
  'GET /aichat/robot/clarify/clarifySessionPageList': getSessionList, // 查看明细
  // 获取聊天记录
  'GET /aichat/robot/clarify/dialogueLogList': getRecordList, // 获取聊天记录
  // 获取待审核列表
  'GET /aichat/robot/faq/faqApprovalPageList': getApprovalList,
  'GET /aichat/robot/faq/faqPendingPageList': getPendingList,
  //通过
  'POST /aichat/robot/faq/approvalAdopt': normalDeal,
  'POST /aichat/robot/faq/batchApprovalAdopt': normalDeal,
  //退回删除
  'POST /aichat/robot/faq/approvalReturn': normalDeal,
  'POST /aichat/robot/faq/approvalDelete': normalDeal,
  //获取历史列表
  'GET /aichat/robot/faq/faqApprovalHistoryPageList': getHistoryList,
  //获取当前问题的答案列表
  'GET /aichat/robot/faq/answerList': getAnswerList,
};
