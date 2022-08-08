import config from '../../../src/config';

const successCode = config.successCode;

const unknownQuestionList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 100,
      faqCount: 99,
      unknownQuestionCount: 199,
      list: [
        {
          id: 'pl1',
          robotId: '100',
          question: '问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 1,
          recommendName: '标准问',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl124',
          robotId: '100',
          question: '问题2',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 1,
          recommendName: '标准问1',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl112',
          robotId: '100',
          question: '问题问题问题3',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '11',
          recommendType: 2,
          recommendName: '意图',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl112454',
          robotId: '100',
          question: '问题问题问题问题问题4',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '11',
          recommendType: 2,
          recommendName: '意图2',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl13',
          robotId: '100',
          question: '问题问题问题问题问题问题5',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '1324243',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 3,
          recommendName: '',
          learnNum: 0,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl1323',
          robotId: '100',
          question: '问题问324',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '1324243',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 3,
          recommendName: '',
          learnNum: 0,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl1453',
          robotId: '100',
          question: '问题问题2',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '1324243',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 3,
          recommendName: '',
          learnNum: 0,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl1365',
          robotId: '100',
          question: '问题问题8',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '1324243',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 3,
          recommendName: '',
          learnNum: 0,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};

const unknownQuestionByFaqPageList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 100,
      list: [
        {
          id: 'pl1121',
          robotId: '100',
          question: '问题问题问123',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 1,
          recommendName: '标准问',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: 'pl112145',
          robotId: '100',
          question: '34567trssdfghgj',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendId: '1',
          recommendType: 2,
          recommendName: '意图',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};

const sessionRecordPageList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 100,
      list: [
        {
          id: 'pl1',
          robotId: '100',
          question: '问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题',
          channelCode: 'media_test',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendName:
            '标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
        {
          id: '13',
          robotId: '100',
          question: '问题问题问题问题问题问题问题问题',
          channelCode: 'media_wx',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendName: '澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清',
          learnNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-06-17 11:54:59',
          updateTime: '2022-07-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

export default {
  'GET /aichat/robot/knowledgeLearn/unknownQuestionPageList': unknownQuestionList,
  'GET /aichat/robot/knowledgeLearn/unknownQuestionByRecommendPageList':
    unknownQuestionByFaqPageList,
  'GET /aichat/robot/knowledgeLearn/sessionRecordPageList': sessionRecordPageList,
  'POST /aichat/robot/blacklist/blacklistQuestionBatchAdd': normalDeal,
  'POST /aichat/robot/intent/intentCorpusBatchAdd': normalDeal,
  'POST /aichat/robot/faq/faqSimilarBatchAdd': normalDeal,
  'POST /aichat/robot/faq/deleteQuetion': normalDeal,
  'GET /aichat/robot/knowledgeLearn/delStard': normalDeal,
};
