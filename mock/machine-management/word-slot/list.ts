import { Request, Response } from 'express';

const successCode = '0000';

const getWordSlotList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalSize: 200,
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
            ],
            outPutParamId: '11245',
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

const interFace = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
    data: [
      { id: '11', interFaceName: '接口列表11', interfaceDesc: '接口描述1' },
      { id: '22', interFaceName: '接口列表22', interfaceDesc: '接口描述2' },
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
      { id: '1', paramName: '入参值1', paramValue: 1 },
      { id: '2', paramName: '入参值2', paramValue: 2 },
      { id: '3', paramName: '入参值3', paramValue: 3 },
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
  'GET /aichat/robot/slot/slotInfo': slotInfoList, // 获取入参值-下级列表
};
