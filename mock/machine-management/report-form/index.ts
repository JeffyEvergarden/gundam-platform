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
          dayId: '2022-12-12',
          dialogueTurn: 66,
          directReplyNum: 77,
          clarifyReplyNum: 88,
          clarifyConfirmReplyNum: 666,
          recommendReplyConfirmNum: 777,
          discernReplyNum: 999,
          directReplyRate: '70%',
          clarifyReplyRate: '80%',
          clarifyConfirmReplyRate: '90%',
          recommendReplyConfirmRate: '67%',
          discernReplyRate: '77%',
          matchRate: '99%',
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/statistics/visitor': visitor,
  'GET /aichat/robot/statistics/session': session,
  'GET /aichat/robot/statistics/questionMatch': questionMatch,
};
