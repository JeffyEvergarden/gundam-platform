import { Request, Response } from 'express';

const successCode = '0000';

const getBusinessTableData = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    datas: [
      {
        flowName: '前端mock-流程1',
        id: 'front_mock_id_1',
        flowDesc: '前端mock-描述1',
        headIntent: '前端mock-意图1',
        creator: 'yyb',
        createTime: '2022-02-23 17:36:00',
      },
    ],
  });
};

const addBusinessItem = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-02-23 17:36:00',
  });
};

const editBusinessItem = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-02-23 17:36:00',
  });
};

const deleteBusinessItem = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-02-23 17:36:00',
  });
};

// 业务流程管理相关
export default {
  'GET /aichat/robot/flow/flowList': getBusinessTableData, // 获取业务流程管理列表
  'POST /aichat/robot/flow/flowAdd': addBusinessItem, // 新增业务流程
  'POST /aichat/robot/flow/flowUpdate': editBusinessItem, // 编辑业务流程
  'POST /aichat/robot/flow/flowDelete': deleteBusinessItem, // 删除业务流程
};
