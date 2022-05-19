import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getFaqList = (req: any, res: any, next: any) => {
  const jsonObj: any = {
    id: '1',
    robotId: '100',
    question: '问题',
    similarQuestionNum: 5, //相似数
    sumViewNum: 10, //总浏览次数
    viewNum: 5, //浏览次数
    likeNum: 555,
    unlikeNum: 22,
    faqTypeId: '循环贷', //问题类型
    approvalStatus: 1, //审批状态
    qunestionRecommend: 1, //推荐 0关  1开
    recyle: 0, //是否在回收站
    creator: 'jiangjiahao',
    createTime: '2022-05-10 15:55:55',
    updateTime: '2022-05-10 15:55:55',
    updateBy: '',
    answerList: [
      {
        answerViewNum: 2, //浏览
        answer: 'dadada', //回复
        enable: 0, //是否启用 0否 1是
        enableStartTime: '2022-05-10 15:55:55',
        enableEndTime: '2022-05-10 15:55:55',
        answerId: '1',
        channelList: [],
        answerLikeNum: 10,
        answerUnlikeNum: 1,
        creator: 'jiangjiahao',
        createTime: '2022-05-10 15:55:55',
        updateTime: '2022-05-10 15:55:55',
      },
      {
        answerViewNum: 3, //浏览
        answer: 'gagaga', //回复
        enable: 1, //是否启用 0否 1是
        enableStartTime: '2022-05-10 15:55:55',
        enableEndTime: '2022-05-10 15:55:55',
        answerId: '2',
        channelCode: '渠道2',
        answerLikeNum: 102,
        answerUnlikeNum: 11,
        creator: 'jiangjiahao',
        createTime: '2022-05-10 15:55:55',
        updateTime: '2022-05-10 15:55:55',
      },
    ],
  };
  let list = new Array(10).fill(1).map((item: any, index: number) => {
    return {
      ...jsonObj,
      name: '阿斯拉大' + index,
      times: 100 + index,
      id: index + 1,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    requestId: '111',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 11,
      page: 1,
      list: [...list],
    },
  });
};

const getImportList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 2,
      page: 1,
      list: [
        {
          id: '1',
          robotId: '100',
          importFilePath: '/',
          importFileName: '测试',
          failFilePath: '/',
          answerNum: 10,
          failAnswerNum: 0,
          similarQuestionNum: 10,
          failSimilarQuestionNum: 10,
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '2',
          robotId: '100',
          importFilePath: '/',
          importFileName: '测试',
          failFilePath: '/',
          answerNum: 10,
          failAnswerNum: 0,
          similarQuestionNum: 10,
          failSimilarQuestionNum: 10,
          createTime: '2022-02-02 22:22:22',
        },
      ],
    },
  });
};
const getTreeList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: [
      {
        title: '全部分类',
        key: '0',
        children: [
          {
            title: '贷款产品分类',
            key: '0-0',
            children: [
              {
                title: '循环贷',
                key: '0-0-1',
              },
              {
                title: '极速贷',
                key: '0-0-2',
              },
            ],
          },
          {
            title: '产品操作',
            key: '0-1',
            children: [
              {
                title: '神奇流程',
                key: '0-1-0',
              },
              {
                title: '神奇流程',
                key: '0-1-1',
              },
            ],
          },
        ],
      },
    ],
  });
};

export default {
  'GET /aichat/robot/faq/list': getFaqList, // 获取问答列表

  'GET /aichat/robot/faq/robotFaqPageList': getFaqList, // 获取问答列表
  'POST /aichat/robot/faq/robotFaqDelete': normalDeal, // 删除问题
  'GET /aichat/robot/faqImport/listPage': getImportList, // 获取批量导入列表

  'GET /aichat/robot/faq/typeList': getTreeList, //获取树
  'POST /aichat/robot/faq/tree/typeAdd': normalDeal, // 添加分类节点
  'POST /aichat/robot/faq/tree/typeEdit': normalDeal, // 编辑分类节点
  'POST /aichat/robot/faq/tree/typeDelete': normalDeal, // 删除分类节点
};
