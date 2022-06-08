import { Request, Response } from 'express';
import config from '../../../src/config';
import moment from 'moment';

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
      channel: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
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
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index,
      question: '问题' + (index + 1) + '我想问什么来着',
      channel: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
      questionTypeList: [
        {
          recommendId: '1',
          recommendType: 1,
          recommend: '支付宝还款',
        },
        {
          recommendId: '2',
          recommendType: 1,
          recommend: '微信还款',
        },
        {
          recommendId: '3',
          recommendType: 2,
          recommend: '中邮钱包还款',
        },
      ],
      adviceTime: index * 10,
      clearPercent: Number(Math.random().toFixed(2)),
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

const getSessionList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: 'APP_' + index,
      channel: Math.random() > 0.5 ? 'media_zfb' : 'media_wx',
      recordNum: (index + 1) * 4,
      recordTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
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
const getRecordList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      userName: Math.random() > 0.5 ? 'left' : 'right',
      msg: '你在说什么呢,能说清楚吗',
      recordTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
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

//待审核
const getApprovalList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = '2022-06-08 19:19:19';

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: `id${index}`,
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
          answer: `答案${index + 1}`,
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
      id: '100',
      question: `问题`,
      answer: `答案${index}`,
      channelList: ['all'],
      enable: 0,
      enableStartTime: _date,
      enableEndTime: _date,
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
  'GET /aichat/robot/faq/blacklist': getBlackList, // 获取FAQ-黑名单语料列表
  'POST /aichat/robot/faq/blacklist/delete': normalDeal, // 删除黑名单语料
  // FAQ-澄清
  'GET /aichat/robot/faq/clearlist': getClearList, // 获取FAQ-澄清语料列表
  'POST /aichat/robot/faq/clearlist/delete': normalDeal, // 删除澄清语料
  'GET /aichat/robot/faq/sessionlist': getSessionList, // 查看明细
  'POST /aichat/robot/faq/clearlist/update': normalDeal, // 修改标准问/意图
  // 获取聊天记录
  'GET /aichat/robot/faq/recordlist': getRecordList, // 获取聊天记录
  // 获取待审核列表
  'GET /aichat/robot/faq/faqApprovalPageList': getApprovalList,
  'GET /aichat/robot/faq/faqPendingPageList': getPendingList,
  //获取历史列表
  'GET /aichat/robot/faq/faqApprovalHistoryPageList': getHistoryList,
  //获取当前问题的答案列表
  'GET /aichat/robot/faq/answerList': getAnswerList,
};
