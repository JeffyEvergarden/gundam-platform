import { Request, Response } from 'express';

const successCode = '0000';

const getWordSlotList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: [
      {
        id: '011',
        slotName: '123',
        slotDesc: '1',
        slotSource: '0',
        flowName: '1',
        entity: '0',
        creator: 'yyb',
        createTime: '2022-02-16',
      },
      {
        id: '012',
        slotName: '110',
        slotDesc: '1',
        slotSource: '3',
        flowName: '1',
        entity: '0',
        creator: 'yyb',
        createTime: '2022-02-16',
      },
      {
        id: '013',
        slotName: '120',
        slotDesc: '描述',
        slotSource: '1',
        flowName: '1',
        entity: '0',
        creator: 'yyb',
        createTime: '2022-02-16',
      },
      {
        id: '014',
        slotName: '999',
        slotDesc: '描述',
        slotSource: '2',
        flowName: '1',
        entity: '0',
        creator: 'yyb',
        createTime: '2022-02-16',
      },
    ],
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

// 词槽管理相关
export default {
  // 机器人管理相关
  'POST /robot/slot/slotList': getWordSlotList, // 获取词槽管理列表
  'POST /robot/slot/slotAdd': getWordSlotList, // 新增词槽
  'POST /robot/slot/slotUpdate': editWordSlot, // 编辑词槽
  'POST /robot/slot/slotDelete': deleteWordSlot, // 删除词槽
};
