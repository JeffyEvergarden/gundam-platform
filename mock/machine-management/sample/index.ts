import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const intentCorpusCheck = (req: any, res: any) => {
  res.json({
    resultCode: '0001',
    resultDesc: '失败',
    data: {
      robotId: '100',
      corpusText: '语料文本',
      currentIntentList: [
        {
          intenId: '10',
          intentName: '意图名称',
          corpusText: '语料文本',
          score: 3,
        },
        {
          intenId: '10',
          intentName: '意图名称',
          corpusText: '语料文本2',
          score: 3,
        },
      ],
      otherIntentList: [
        {
          intenId: '10',
          intentName: '意图名称3',
          corpusText: '语料文本3',
          score: 3,
        },
        {
          intenId: '10',
          intentName: '意图名称33',
          corpusText: '语料文本33',
          score: 3,
        },
      ],
      similarQueryList: [
        {
          stdQueryId: '1313',
          stdQuery: '标准问',
          similarQueryId: '134',
          similarQuery: '相似问',
        },
        {
          stdQueryId: '1313',
          stdQuery: '标准问2',
          similarQueryId: '134',
          similarQuery: '相似问2',
        },
      ],
    },
  });
};

const getSample = (req: any, res: any) => {
  res.json({
    data: {
      pageSize: 20,
      totalPage: 80,
      page: 1,
      list: [
        {
          id: '011',
          robotId: '121313',
          intentId: '100',
          corpusText: '语料文本',
          entityName: '实体名称1',
          entityType: 1,
          entityDesc: '描述1\n描述',
          rule: '规则1',
          decri: '说明1/n说明',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
        },
        {
          id: '012',
          robotId: '121313',
          intentId: '123',
          corpusText: '语料文本2',
          entityName: '实体名称1',
          entityDesc: '描述1\n描述',
          rule: '规则1',
          decri: '说明1/n说明',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
        },
      ],
    },
  });
};

const similarList = (req: any, res: any) => {
  res.json({
    data: {
      pageSize: 20,
      totalPage: 80,
      page: 1,
      listCurrent: [
        {
          id: '011',
          actionLabel:
            '相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1相似语料1',
        },
        {
          id: '012',
          actionLabel: '相似语料12',
        },
      ],
      listOther: [
        {
          id: '01134',
          intentName: '重置密码',
          yuliao: '语料文本1',
        },
        {
          id: '01235',
          intentName: '还款渠道',
          yuliao: '语料文本12',
        },
      ],
      listFAQ: [
        {
          id: '012565',
          bzw: '开具证明',
          yuliao: '语料文本12',
        },
        {
          id: '013457',
          bzw: '协商还款',
          yuliao: '语料文本12344546',
        },
      ],
    },
  });
};

const getSimilarList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      pageSize: 10,
      totalPage: 2,
      page: 1,
      list: [
        {
          dataStatus: 0,
          faqId: '1',
          id: '123',
          question: '问题',
          robotId: '100',
          similarText: '148',
          viewNum: 0,
          updateTime: '2022-05-20 13:14:15',
        },
      ],
    },
  });
};

const faqSimilarCheck = (req: any, res: any) => {
  res.json({
    resultCode: '0001',
    resultDesc: '失败',
    data: {
      robotId: '100',
      corpusText: '语料文本',
      intentList: [
        {
          intenId: '10',
          intentName: '意图名称',
          corpusText: '语料文本',
          score: 3,
        },
        {
          intenId: '10',
          intentName: '意图名称',
          corpusText: '语料文本2',
          score: 3,
        },
      ],
      otherStdQueryList: [
        {
          stdQueryId: '1313',
          stdQuery: '标准问',
          similarQueryId: '134',
          similarQuery: '相似问',
          viewNum: 1,
        },
        {
          stdQueryId: '1313',
          stdQuery: '标准问2',
          similarQueryId: '134',
          similarQuery: '相似问2',
          viewNum: 1,
        },
      ],
      currentStdQueryList: [
        {
          stdQueryId: '1313',
          stdQuery: '标准问',
          similarQueryId: '134',
          similarQuery: '相似问',
          viewNum: 1,
        },
        {
          stdQueryId: '1313',
          stdQuery: '标准问2',
          similarQueryId: '134',
          similarQuery: '相似问2',
          viewNum: 1,
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/intent/intentCorpusPageList': getSample,
  'POST /aichat/robot/intent/intentCorpusEdit': normalDeal,
  'POST /aichat/robot/intent/intentFeatureDelete': normalDeal,
  'POST /aichat/robot/intent/intentCorpusCheck': intentCorpusCheck,
  'POST /aichat/robot/intent/intentCorpusAdd': normalDeal,
  'GET /aichat/robot/entity/similarList': similarList,
  'GET /aichat/robot/faq/similarPageList': getSimilarList,
  'POST /aichat/robot/faq/faqSimilarEdit': normalDeal,
  'POST /aichat/robot/faq/faqSimilarDelete': normalDeal,
  'POST /aichat/robot/faq/faqSimilarAdd': normalDeal,
  'POST /aichat/robot/faq/faqSimilarCheck': faqSimilarCheck,
};
