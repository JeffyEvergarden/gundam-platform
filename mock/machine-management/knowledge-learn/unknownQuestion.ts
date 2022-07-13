import config from '../../../src/config';

const successCode = config.successCode;

const unknownQuestionList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 100,
      list: [
        {
          id: 'pl1',
          question: '问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题',
          channelCode: '渠道',
          source: 1, //1-澄清 2-拒识
          askNum: 2,
          faqtypeId: '132424',
          faqTypeName: '分类名称',
          recommendName:
            '标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清标注问/意图/澄清',
          recommendNum: 36,
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
          updateTime: '2022-02-17 11:54:59',
          updateBy: '',
        },
      ],
    },
  });
};
export default {
  'GET /aichat/robot/knowledgeLearn/unknownQuestionPageList': unknownQuestionList,
};
