import config from './../../../src/config';
const successCode = config.successCode;

const visitor = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          dayId: '2022-02-12',
          visitNum: 25,
          validVisitNum: 34,
          visitorNum: 35,
          validVisitorNum: 26,
          dialogueTurn: 66,
          averageDialogueTurn: 55,
        },
        {
          dayId: '2022-04-12',
          visitNum: 35,
          validVisitNum: 44,
          visitorNum: 55,
          validVisitorNum: 66,
          dialogueTurn: 76,
          averageDialogueTurn: 65,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
        {
          dayId: '2022-06-12',
          visitNum: 55,
          validVisitNum: 64,
          visitorNum: 75,
          validVisitorNum: 86,
          dialogueTurn: 96,
          averageDialogueTurn: 85,
        },
      ],
    },
  });
};
const session = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: '12345678',
          channelCode: 'media_wx',
          dialogueTurn: 66,
          duration: '4小时33分钟',
        },
        {
          id: '123456712138',
          channelCode: 'media_wx',
          dialogueTurn: 6,
          duration: '3小时33分钟',
        },
        {
          id: '123456232478',
          channelCode: 'media_wx',
          dialogueTurn: 68,
          duration: '2小时33分钟',
        },
      ],
    },
  });
};

const questionMatch = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          dayId: '2022-02-12',
          dialogueTurn: 66,
          directReplyNum: 77,
          clarifyReplyNum: 88,
          clarifyConfirmReplyNum: 666,
          recommendReplyConfirmNum: 777,
          discernReplyNum: 999,
          directReplyRate: '77.77%',
          clarifyReplyRate: '80%',
          clarifyConfirmReplyRate: '90%',
          recommendReplyConfirmRate: '67%',
          discernReplyRate: '77%',
          matchRate: '99.99%',
        },
        {
          dayId: '2022-03-22',
          dialogueTurn: 33,
          directReplyNum: 44,
          clarifyReplyNum: 66,
          clarifyConfirmReplyNum: 555,
          recommendReplyConfirmNum: 444,
          discernReplyNum: 888,
          directReplyRate: '50%',
          clarifyReplyRate: '30%',
          clarifyConfirmReplyRate: '60%',
          recommendReplyConfirmRate: '44%',
          discernReplyRate: '55%',
          matchRate: '88%',
        },
        {
          dayId: '2022-04-22',
          dialogueTurn: 44,
          directReplyNum: 66,
          clarifyReplyNum: 55,
          clarifyConfirmReplyNum: 666,
          recommendReplyConfirmNum: 333,
          discernReplyNum: 555,
          directReplyRate: '80%',
          clarifyReplyRate: '60%',
          clarifyConfirmReplyRate: '40%',
          recommendReplyConfirmRate: '78%',
          discernReplyRate: '89%',
          matchRate: '56%',
        },
      ],
    },
  });
};

const reject = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          entityValue: '客户问题',
          entityValue1: '时间',
          channelCode: 'media_ycsjyh',
          entityValue4: '会话记录',
        },
      ],
    },
  });
};

const faqAndClarify = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          dayId: '2022-12-12',
          clarifyReplyNum: 88,
          clarifyConfirmDistinctNum: 77,
          clarifyUnconfirmedReplyNum: 100,
          clarifyReplyRate: '80%',
          recommendDistinctConfirmNum: 77,
          recommendReplyNum: 33,
          recommendReplyUnconfirmedNum: 44,
          recommendReplyConfimRate: '90%',
        },
        {
          dayId: '2022-12-12',
          clarifyReplyNum: 1,
          clarifyConfirmDistinctNum: 1,
          clarifyUnconfirmedReplyNum: 1,
          clarifyReplyRate: '80%',
          recommendDistinctConfirmNum: 1,
          recommendReplyNum: 1,
          recommendReplyUnconfirmedNum: 1,
          recommendReplyConfimRate: '90%',
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/statistics/visitor': visitor,
  'GET /aichat/robot/statistics/session': session,
  'GET /aichat/robot/statistics/questionMatch': questionMatch,
  'GET /aichat/robot/statistics/reject': reject,
  'GET /aichat/robot/statistics/faqAndClarify': faqAndClarify,
};
