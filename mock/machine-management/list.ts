import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const getList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: 100,
          robotName: '文本机器人',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '营销',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 1,
          robotName: '语音机器人',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '客服',
          robotType: 1, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 2,
          robotName: '冰果2',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '风险',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 3,
          robotName: '冰果3',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '催收',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 4,
          robotName: '冰果4',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '审批',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 5,
          robotName: '冰果5',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '渠道',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
        {
          id: 6,
          robotName: '冰果6',
          robotDesc:
            '电视动画《冰菓》改编自日本推理小说家米泽穗信原作的《古典部系列》小说，以该系列的第1部《冰菓》为标题。2011年11月29日，在京都动画官方网站内，宣布了《冰菓》TV动画化的决',
          businessCode: '渠道',
          robotType: 0, // 0：文本   1：语音
          status: 0, // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
      ],
    },
  });
};

const changeMachineStatus = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
  });
};

const addNewMachine = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
  });
};

const publishProd = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      publishTime: '2022-03-01 17:51',
      desc: 'aaa',
      status: 0,
    },
  });
};

const publishTest = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      publishTime: '2022-03-02 17:51',
      desc: 'aaa',
      status: 1,
    },
  });
};

const getPublishStatus = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      prodTime: '2022-03-02 17:51',
      prodDesc: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      prodStatus: 1,
      testTime: '2022-03-03 17:51',
      testDesc: '黑黑黑黑黑黑黑黑黑黑黑黑黑黑黑黑黑黑',
      testStatus: 0,
    },
  });
};

// 菜单管理相关
export default {
  // 机器人管理相关
  'GET /aichat/robot/robot/robotList': getList, // 获取机器人管理列表
  'POST /aichat/robot/robot/robotStatus': changeMachineStatus, // 修改业务状态
  'POST /aichat/robot/robot/robotAdd': addNewMachine,
  'POST /aichat/robot/robot/robotUpdate': addNewMachine,
  'POST /aichat/robot/robot/robotDelete': addNewMachine,
  'POST /aichat/robot/robot/publishProd': publishProd,
  'POST /aichat/robot/robot/publishTest': publishTest,
  'POST /aichat/robot/robot/getPublishStatus': getPublishStatus,
};
