import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const nodeOps = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

const getConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      nodes: [
        {
          id: '01',
          color: '#1890FF',
          label: '开始',
          _id: '01',
          shape: 'flow-rect',
          size: '140*45',
          x: 100,
          y: 100,
        },
      ],
    },
  });
};

// 菜单管理相关
export default {
  // 主流程管理相关
  'POST /aichat/maindraw/addNode': nodeOps, // 添加节点
  'POST /aichat/maindraw/updateNode': nodeOps, // 修改业务状态
  'POST /aichat/maindraw/deleteNode': nodeOps, // 删除节点
  'POST /aichat/maindraw/config': getConfig,
};
