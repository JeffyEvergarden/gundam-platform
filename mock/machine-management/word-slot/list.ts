import config from '../../../src/config';

const successCode = config.successCode;

const getWordSlotList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalPage: 200,
      page: 10,
      list: [
        {
          id: '011',
          slotDesc:
            '描述1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
          slot: 'qwqewrrw',
          slotName: '前端mock词槽1',
          slotSource: 4,
          dataType: 2,
          slosourceId: 1,
          slotInfo: {
            id: '11',
            inputParamList: [
              {
                id: '112',
                sourceType: 0,
                value: '1',
              },
              {
                id: '112',
                sourceType: 0,
                value: '1',
              },
              {
                id: '112',
                sourceType: 0,
                value: '1',
              },
              {
                id: '112',
                sourceType: 0,
                value: '1',
              },
              {
                id: '112',
                sourceType: 0,
                value: '1',
              },
            ],
            outputParamId: '11245',
          },
        },
        {
          id: '222',
          slotDesc:
            '描述1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
          slot: 'qwqew1rrw',
          slotName: '前端mock词槽2',
          slotSource: 7,
          dataType: 2,
          slosourceId: 1,
          slotInfo: {
            id: '2',
            inputParamList: [
              {
                id: '5',
                sourceType: 0,
                value: '1',
              },
            ],
            outputParamId: '11245',
          },
        },
        {
          id: '333',
          slotDesc:
            '描述3前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1前端mock词槽1',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
          slot: 'qwqew1rrw',
          slotName: '图谱',
          slotSource: 9,
          dataType: 3,
          slosourceId: 1,
          slotInfo: {
            id: '2',
            inputParamList: [
              {
                id: '5',
                sourceType: 0,
                value: '1',
              },
            ],
            outputParamId: '11245',
          },
        },
      ],
    },
  });
};

const insertNewWordSlot = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const editWordSlot = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const deleteWordSlot = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const getzzReal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
    data: [
      { id: '1', entityName: '实体名称1' },
      { id: '2', entityName: '实体名称2' },
    ],
  });
};

const configList = (req: any, res: any) => {
  if (req.query.configType == 2) {
    res.json({
      resultCode: successCode,
      requestId: 'xx',
      resultDesc: '成功',
      success: true,
      data: [
        {
          id: '1',
          configType: 0,
          configName: '澄清数量上限',
          configValue: '1.0',
          configDesc: 'var1',
          configKey: 'THRESHOLD_GAP',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 1,
          updateType: 0,
          validateRule: '{"min":0,"max":99}',
        },
        {
          id: '1222',
          configType: 0,
          configName: '推荐问题数量上限',
          configValue: '1.0',
          configDesc: 'var1',
          configKey: 'THRESHOLD_GAP',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 1,
          updateType: 0,
          validateRule: '{"min":0,"max":99}',
        },
        {
          id: '1333',
          configType: 0,
          configName: '搜索联想数量上限',
          configValue: '1.0',
          configDesc: 'var1',
          configKey: 'THRESHOLD_GAP',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 1,
          updateType: 0,
          validateRule: '{"min":0,"max":99}',
        },
        {
          id: '2111',
          configType: 0,
          configName: '答案失效话术',
          configValue: '撒娇大家卢卡斯建档立卡就',

          soundType: 1,
          allowInterrupt: 1,

          configDesc: 'var1',
          configKey: 'FAQ_INVALID_ANSWER',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 0,
          updateType: 0,
        },
        {
          id: '233aa',
          configType: 0,
          configName: '推荐问题话术',
          configValue: '1',
          configDesc: 'var1',
          configKey: 'FAQ_REJECT_RECOMMEND_TEXT',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 0,
          updateType: 0,
        },
        {
          id: '2421421',
          configType: 0,
          configName: '是否开启猜你想问',
          configValue: '1',
          configDesc: 'var1',
          configKey: 'FAQ_REJECT_RECOMMEND_SWITCH',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 4,
          updateType: 0,
        },
        {
          id: '2xxx',
          configType: 0,
          configName: '猜你想问话术',
          configValue: '1',
          configDesc: 'var1',
          configKey: 'FAQ_REJECT_RECOMMEND_TEXT',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 0,
          updateType: 0,
        },
        {
          id: '1123',
          configType: 0,
          configName: 'FAQ_RECOMMEND_LIMIT',
          configValue: '3',
          configDesc: 'var1',
          configKey: 'FAQ_RECOMMEND_LIMIT',
          robotId: '00000',
          creator: 'jeffy',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 1,
          updateType: 0,
          validateRule: '{"min":0,"max":99}',
        },
      ],
    });
  } else {
    res.json({
      resultCode: successCode,
      resultDesc: '成功',
      occurTime: '2022-0221-18:16',
      data: [
        { id: '1', configName: '变量1' },
        { id: '2', configName: '变量2' },
      ],
    });
  }
};

const interFace = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
    data: [
      { id: '11', interfaceName: '接口列表11', interfaceDesc: '接口描述1' },
      { id: '22', interfaceName: '接口列表22', interfaceDesc: '接口描述2' },
    ],
  });
};

const paramList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
    data: [
      { id: '112', paramName: '参数名称112', paramValue: 1, dataType: 0 },
      { id: '223', paramName: '参数名称表223', paramValue: 2, dataType: 1 },
      { id: '11245', paramName: '参数名称334', paramValue: 3, dataType: 2 },
    ],
  });
};

const slotInfoList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
    data: [
      {
        id: '1',
        slotName: '槽值1',
        robotId: '100',
        slotSource: 1,
        slotInfo: [
          {
            id: '12',
            outputParamId: '13',
            inputParamList: [{ id: '13', value: '槽值或者变量', sourceType: 2 }],
          },
        ],
        slotDesc: '词槽描述',
        slot: '词槽',
        slotSouceId: '1',
        creator: '创建者',
        createTime: '2022-02-02',
        dataType: '2',
        datastutus: 3,
      },
      { id: '2', slotName: '槽值2', paramValue: 2, slotSource: 1, dataType: '1' },
      { id: '3', slotName: '图谱', paramValue: 3, slotSource: 9, dataType: 5 },
    ],
  });
};

const slotAdd = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

// 词槽管理相关
export default {
  // 机器人管理相关
  'GET /aichat/robot/slot/slotList': getWordSlotList, // 获取词槽管理列表
  'POST /aichat/robot/slot/slotAdd': slotAdd, // 新增词槽
  'POST /aichat/robot/slot/slotUpdate': editWordSlot, // 编辑词槽
  'POST /aichat/robot/slot/slotDelete': deleteWordSlot, // 删除词槽
  'GET /aichat/robot/entity/list': getzzReal, // 获取实体列表
  'GET /aichat/robot/interface/list': interFace, // 获取接口列表
  'GET /aichat/robot/interface/param': paramList, // 获取入参值列表
  'GET /aichat/robot/config/list': configList, // 获取变量列表  detail里有
  'POST /aichat/robot/slot/slotInfo': slotInfoList, // 获取入参值-下级列表
};
