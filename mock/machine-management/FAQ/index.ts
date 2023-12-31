import config from '../../../src/config';

// faq 标准模块相关

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getFaqList = (req: any, res: any, next: any) => {
  let page = req.body.page || 1;
  console.log(req.body);
  const jsonObj: any = {
    id: '1',
    robotId: '100',
    question: '问题',
    similarNum: 5, //相似数
    sumViewNum: 10, //总浏览次数
    viewNum: 5, //浏览次数
    likeNum: 555,
    unlikeNum: 22,
    faqTypeId: '0-0-1', //问题类型
    approvalStatus: 1, //审批状态
    questionRecommend: 1, //推荐 0关  1开
    recycle: 0, //是否在回收站
    creator: 'jiangjiahao',
    createTime: '2022-05-10 15:55:55',
    updateTime: '2022-05-10 15:55:55',
    updateBy: '',
    answerList: [
      {
        answerViewNum: 2, //浏览
        answer: 'dadada <break time=200ms /> ', //回复
        enable: 0, //是否启用 0否 1是
        enableStartTime: '2022-05-10 15:55:55',
        enableEndTime: '2022-05-10 15:55:55',
        answerId: '1',
        approvalStatus: 4, //审批状态
        channelList: ['all'],
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
        approvalStatus: 3, //审批状态
        channelList: ['app'],
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
      id: index + 1 + page * 100,
      recycle: index % 2 == 0 ? 0 : 1,
      suggest: Math.floor(Math.random() * 100) > 50 ? 0 : 1,
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
      similarNum: 20,
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
          failFilePath: null,
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
    data: {
      faqTotal: 4,
      list: [
        {
          title: '贷款产品分类',
          key: '0-0',
          faqCount: 2,
          children: [
            {
              title: '循环贷循环贷循环贷循环贷循环贷循环贷循环贷循环贷循环贷',
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
          faqCount: 2,
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
        {
          children: [],
          faqCount: 0,
          key: 'other',
          parentId: '0',
          robotId: '100',
          title: '其他',
          type: 2,
        },
      ],
    },
  });
};

const getCreateUser = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: ['jiangjiahao', 'laingjianhui', 'duanjianguo'],
  });
};

const getRecommend = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: [
      {
        id: 100,
        faqId: '111',
        recommendId: '1',
        recommendType: 1,
        recommendBizType: 1,
        recommend: '问题',
      },
    ],
  });
};

const getSelfList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      data: [
        {
          selfName: 'fiwu1',
          selfId: 'fiwu1',
        },
        {
          selfName: 'fiwu2',
          selfId: 'fiwu2',
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/faq/list': getFaqList, // 获取问答列表

  'POST /aichat/robot/faq/robotFaqPageList': getFaqList, // 获取问答列表
  'POST /aichat/robot/faq/robotFaqDelete': normalDeal, // 删除问题
  'POST /aichat/robot/faq/robotFaqBatchDelete': normalDeal, // 删除问题
  'GET /aichat/robot/faqImport/listPage': getImportList, // 获取批量导入列表
  'POST /aichat/robot/faq/robotFaqRecycleDelete': normalDeal, // 删除问题

  'GET /aichat/robot/faq/typeList': getTreeList, //获取树
  'POST /aichat/robot/faq/typeAdd': normalDeal, // 添加分类节点
  'POST /aichat/robot/faq/typeEdit': normalDeal, // 编辑分类节点
  'POST /aichat/robot/faq/typeDelete': normalDeal, // 删除分类节点

  'GET /aichat/robot/faq/listCreateUser': getCreateUser, //获取用户
  'GET /aichat/robot/faq/listFaqRecommend': getRecommend, //获取推荐

  'GET /aichat/robot/faq/faqSelfList': getSelfList, //获取自助服务列表
};
