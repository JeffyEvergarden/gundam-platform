import config from './../../../src/config';
const successCode = config.successCode;

const visitor = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: [
      {
        dayId: '2022-03-12',
        visitNum: 25,
        validVisitNum: 34,
        visitorNum: 35,
        validVisitorNum: 26,
        dialogueTurn: 66,
        averageDialogueTurn: 55,
        activeTransferNum: 10,
        transferNum: 11,
        transferRate: '12.22%',
      },
      {
        dayId: '2022-04-12',
        visitNum: 35,
        validVisitNum: 44,
        visitorNum: 55,
        validVisitorNum: 66,
        dialogueTurn: 76,
        averageDialogueTurn: 65,
        activeTransferNum: 13,
        transferNum: 14,
        transferRate: '15.77%',
      },
      {
        dayId: '2022-05-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 16,
        transferNum: 17,
        transferRate: '18.77%',
      },
      {
        dayId: '2022-06-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 19,
        transferNum: 10,
        transferRate: '11.77%',
      },
      {
        dayId: '2022-07-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 12,
        transferNum: 13,
        transferRate: '14.77%',
      },
      {
        dayId: '2022-08-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 15,
        transferNum: 16,
        transferRate: '17.77%',
      },
      {
        dayId: '2022-09-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 10,
        transferNum: 10,
        transferRate: '10.77%',
      },
      {
        dayId: '2022-10-12',
        visitNum: 55,
        validVisitNum: 64,
        visitorNum: 75,
        validVisitorNum: 86,
        dialogueTurn: 96,
        averageDialogueTurn: 85,
        activeTransferNum: 10,
        transferNum: 10,
        transferRate: '10.77%',
      },
    ],
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
      sum: {
        dayId: '2022-02-12',
        dialogueTurn: 66,
        directReplyNum: 77,
        clarifyReplyNum: 88,
        clarifyConfirmReplyNum: 88,
        recommendReplyConfirmNum: 77,
        discernReplyNum: 99,
        directReplyRate: '77.77%',
        clarifyReplyRate: '80%',
        clarifyConfirmReplyRate: '90%',
        recommendReplyConfirmRate: '67%',
        discernReplyRate: '77%',
        matchRate: '99.99%',
        sumReplyNum: '999',
        historySumReplyNum: '9999',
      },
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
          id: '1234567',
          createTime: '2020-12-23',
          message: '客户问题',
          channelCode: 'media_ycsjyh',
          sessionId: '123456756543',
        },
      ],
    },
  });
};

const faqAndClarify = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: [
      {
        dayId: '2022-02-12',
        clarifyReplyNum: 88,
        clarifyConfirmDistinctNum: 77,
        clarifyUnconfirmedReplyNum: 100,
        clarifyReplyRate: '80%',
        recommendDistinctConfirmNum: 77,
        recommendReplyNum: 33,
        recommendReplyUnconfirmedNum: 44,
        recommendReplyConfirmRate: '90%',
      },
      {
        dayId: '2022-03-12',
        clarifyReplyNum: 1,
        clarifyConfirmDistinctNum: 12,
        clarifyUnconfirmedReplyNum: 16,
        clarifyReplyRate: '50%',
        recommendDistinctConfirmNum: 18,
        recommendReplyNum: 20,
        recommendReplyUnconfirmedNum: 1,
        recommendReplyConfirmRate: '40%',
      },
      {
        dayId: '2022-04-12',
        clarifyReplyNum: 12,
        clarifyConfirmDistinctNum: 13,
        clarifyUnconfirmedReplyNum: 13,
        clarifyReplyRate: '70%',
        recommendDistinctConfirmNum: 1,
        recommendReplyNum: 1,
        recommendReplyUnconfirmedNum: 1,
        recommendReplyConfirmRate: '60%',
      },
    ],
  });
};

const searchAssociationList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultId: '2244',
    data: [
      {
        id: '1',
        dayId: '2022-04-12',
        searchNum: '100',
        suggestNum: '200',
        suggestClickNum: '300',
        suggestUseRate: '40.00%',
        suggestResultNum: '150',
        suggestResultRate: '75.00%',
        suggestClickRate: '33.33%',
        suggestAvgPosition: '3.2',
        TopThreeRate: '20.00%',
      },
      {
        id: '2',
        dayId: '2022-04-13',
        searchNum: '200',
        suggestNum: '300',
        suggestClickNum: '400',
        suggestUseRate: '50.00%',
        suggestResultNum: '250',
        suggestResultRate: '85.00%',
        suggestClickRate: '43.33%',
        suggestAvgPosition: '5.2',
        TopThreeRate: '30.00%',
      },
      {
        id: '3',
        dayId: '2022-04-12',
        searchNum: '100',
        suggestNum: '200',
        suggestClickNum: '300',
        suggestUseRate: '40.00%',
        suggestResultNum: '150',
        suggestResultRate: '75.00%',
        suggestClickRate: '33.33%',
        suggestAvgPosition: '3.2',
        TopThreeRate: '20.00%',
      },
    ],
  });
};

const searchCustomerTrackList = (req: any, res: any) => {
  let list = new Array(10).fill(1).map((item: any, index: number) => {
    return {
      callTime: '2023-01-01',
      mobile: 12345678901,
      operationTime: '2023-01-01',
      nodeName: '节点' + index,
      customerTrack: '轨迹' + index,
      operation: Math.ceil(Math.random() * 8),
      id: index,
      sesstionId: index < 5 ? 0 : 1,
    };
  });
  res.json({
    resultCode: successCode,
    resultId: '2244',
    data: {
      list: [...list],
      totalPage: 11,
    },
  });
};

export default {
  'GET /aichat/robot/statistics/visitor': visitor,
  'GET /aichat/robot/statistics/session': session,
  'GET /aichat/robot/statistics/questionMatch': questionMatch,
  'GET /aichat/robot/statistics/questionMatch/rejectRateDetail': reject,
  'GET /aichat/robot/statistics/faqAndClarify': faqAndClarify,
  'GET /aichat/robot/statistics/suggest': searchAssociationList,
  'GET /aichat/robot/statistics/customerTrack': searchCustomerTrackList,
};
