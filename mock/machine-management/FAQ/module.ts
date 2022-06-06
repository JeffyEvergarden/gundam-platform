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
};
