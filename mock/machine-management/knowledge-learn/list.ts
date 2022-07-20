import config from '../../../src/config';

const successCode = config.successCode;

const defaultList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getBatchList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 3,
      nextTestTime: '2022-07-12',
      list: [
        {
          id: 'pl1',
          robotId: '100',
          threshold: '0.99',
          taskStatus: 0,
          costTime: 60,
          sampleTotal: 100,
          abnormalSampleAmount: 50,
          reviewAmount: 50,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl2',
          robotId: '100',
          threshold: '0.99',
          taskStatus: 1,
          costTime: 60,
          sampleTotal: 100,
          abnormalSampleAmount: 50,
          reviewAmount: 50,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl3',
          robotId: '100',
          threshold: '0.99',
          taskStatus: 2,
          costTime: 60,
          sampleTotal: 100,
          abnormalSampleAmount: 50,
          reviewAmount: 50,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};

const getDetailList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 3,
      list: [
        {
          id: 'pl1',
          robotId: '100',
          batchId: 100,
          score: 5.66,
          textOneId: '111',
          textOneType: 'intent',
          textOneValue: 'aaa',
          textOneRelationName: '标准问',
          textTwoRelationName: '标准问2',
          textTwoId: '222',
          textTwoType: 'intent',
          textTwoValue: 'bbb',
          handleStatus: 1,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl2',
          robotId: '100',
          batchId: 100,
          score: 5.66,
          textOneId: '111',
          textOneType: 'faq',
          textOneValue: 'aaa',
          textOneRelationName: '标准问',
          textTwoRelationName: '标准问2',
          textTwoId: '222',
          textTwoType: 'faq',
          textTwoValue: 'bbb',
          handleStatus: 2,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl3',
          robotId: '100',
          batchId: 100,
          score: 5.66,
          textOneId: '333',
          textOneType: 'similar',
          textOneValue: 'aaa',
          textOneRelationName: '标准问标准问标准问标准问标准问标准问',
          textTwoRelationName: '标准问2',
          textTwoId: '333',
          textTwoType: 'similar',
          textTwoValue: 'bbb',
          handleStatus: 2,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
      id: '111',
      sampleTotal: 100,
      abnormalSampleAmount: 50,
      reviewAmount: 50,
    },
  });
};

const getWhiteList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 3,
      list: [
        {
          id: 'pl1',
          robotId: '100',
          batchId: 100,
          score: 5.66,
          textOneId: '111',
          textOneType: 'intent',
          textOneValue: 'aaa',
          textTwoId: '222',
          textTwoType: 'intent',
          textTwoValue: 'bbb',
          handleStatus: 1,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl2',
          robotId: '100',
          batchId: 100,
          score: 5.66,
          textOneId: '111',
          textOneType: 'faq',
          textOneValue: 'aaa',
          textTwoId: '222',
          textTwoType: 'faq',
          textTwoValue: 'bbb',
          handleStatus: 2,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};

const getTest = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      autoClear: 1,
      clearNumber: 1,
      createTime: 'xxx',
      creator: 'xxx',
      dataStatus: 0,
      firstTestingTime: '2022-07-19 14:57:33',
      id: '111',
      robotId: '100',
      trmporaryTest: 0,
      testingCycle: 1,
      testingRule: 'week',
      threshold: 0.9,
    },
  });
};

export default {
  'GET /aichat/robot/batchTest/testPageList': getBatchList,
  'GET /aichat/robot/batchTest/testDetailPageList': getDetailList,
  'GET /aichat/robot/testWhiteList/whiteListPageList': getWhiteList,
  'POST /aichat/robot/batchTest/testDetailDelete': defaultList,
  'POST /aichat/robot/batchTest/saveTemporaryTask': defaultList, //临时检测
  'GET /aichat/robot/batchTest/testTaskInfo': getTest, //回显检测
  'POST /aichat/robot/batchTest/saveTestTask': defaultList, //检测计划
  'POST /aichat/robot/testWhiteList/whiteListAdd': defaultList, //添加到白名单
  'POST /aichat/robot/testWhiteList/whiteListDelete': defaultList, //删除白名单
  'POST /aichat/robot/batchTest/sampleTransfer': defaultList,
};
