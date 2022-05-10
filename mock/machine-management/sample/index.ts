import config from '../../../src/config';

const successCode = config.successCode;

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

export default {
  'GET /aichat/robot/entity/listPageSample': getSample,
  'GET /aichat/robot/entity/similarList': similarList,
};
