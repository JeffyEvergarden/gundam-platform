import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getFaqList = (req: any, res: any) => {
  const jsonObj: any = {
    id: '1',
    robotId: '100',
    question: '问题',
    viewNum: 5, //浏览次数
    faqTypeId: '循环贷', //问题类型
    approvalStatus: 1,
    qunestionRecommend: 1,
    creator: 'jiangjiahao',
    createTime: '2022-05-10 15:55:55',
    updateTime: '2022-05-10 15:55:55',
    updateBy: '',
    answerList: [
      {
        viewNum: 2,
        answer: 'dadada', //回复
        enable: 0, //是否启用 0否 1是
        enableStartTime: '2022-05-10 15:55:55',
        enableEndTime: '2022-05-10 15:55:55',
        creator: 'jiangjiahao',
        createTime: '2022-05-10 15:55:55',
        updateTime: '2022-05-10 15:55:55',
        updateBy: '',
      },
      {
        viewNum: 4,
        answer: 'gaga', //回复
        enable: 0, //是否启用 0否 1是
        enableStartTime: '2022-05-10 15:55:55',
        enableEndTime: '2022-05-10 15:55:55',
        creator: 'jiangjiahao',
        createTime: '2022-05-10 15:55:55',
        updateTime: '2022-05-10 15:55:55',
        updateBy: '',
      },
    ],

    // name: '阿斯拉大',
    // email: 'ljk15916807596@qq.com',
    // content: '冲啊，旋风冲锋',
    // time: '2022-04-01 14:00:00',
    // channel: ['微信', 'API', 'APP'],
    // creator: '伟大的教团',
    // times: 100,
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
                title: '神奇流程2',
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
  'GET /aichat/faq/robotFaqPageList': getFaqList, // 获取问答列表
  'POST /aichat/faq/robotFaqDelete': normalDeal, // 删除问题
  'GET /aichat/faqImport/listPage': getImportList, // 获取批量导入列表

  'GET /aichat/faq/typeList': getTreeList, //获取树
  'POST /aichat/faq/tree/typeAdd': normalDeal, // 添加分类节点
  'POST /aichat/faq/tree/typeEdit': normalDeal, // 编辑分类节点
  'POST /aichat/faq/tree/typeDelete': normalDeal, // 删除分类节点
};
