import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const getBusinessTableData = (req: any, res: any) => {
  let arr = new Array(20).fill(1);
  const obj = {
    flowName: '前端mock-流程',
    id: 'front_mock_id_',
    flowDesc: '前端mock-描述',
    headIntent: 1,
    creator: 'yyb',
    createTime: '2022-02-23 17:36:00',
    flowType: 1,
  };
  arr = arr.map((item: any, i: number) => {
    return {
      flowName: '前端mock-流程' + i,
      id: 'front_mock_id_' + i,
      flowDesc: '前端mock-描述' + i,
      headIntent: 100 + i,
      creator: 'yyb',
      createTime: '2022-02-23 17:36:00',
      flowType: (1 + i) % 4,
    };
  });

  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalSize: 200,
      page: 10,
      list: arr,
    },
    pageSize: 20,
    totalSize: 200,
    page: 10,
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
  'POST /aichat/robot/flow/flowInfo': getBusinessTableData, // 获取业务流程管理列表
  'POST /aichat/robot/flow/flowAdd': addBusinessItem, // 新增业务流程
  'POST /aichat/robot/flow/flowUpdate': editBusinessItem, // 编辑业务流程
  'POST /aichat/robot/flow/flowDelete': deleteBusinessItem, // 删除业务流程
};
