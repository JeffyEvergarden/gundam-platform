import { Request, Response } from 'express';

const successCode = 100;

const getChatInitData = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    requestId: '001002003requestId',
    sessionId: '001002003sessionId',
  });
};

const getTextDialogData = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    // requestId: '001002003requestId',
    // actionMessage: '我接收到了信息',
    // actionEvent: 'talking',
    // actionSound: '',
    data: {
      actionMessage: '你好，请问是XX先生吗？',
      actionEvent: 'talking',
      askType: 'faq',
      askText: '111111',
      askKey: '意图类型',
      nluInfo:
        '{"resultCode":"0000","data":{"nodes":[{"frontId":"01","id":"01","nodeType":2,"label":"开始","x":100,"y":100},{"frontId":"02","id":"02","nodeType":0,"label":"普通节点1","x":500,"y":500},{"frontId":"03","id":"03","nodeType":1,"label":"业务节点1","x":700,"y":200},{"frontId":"04","id":"04","nodeType":3,"label":"特殊业务节点","x":100,"y":300}],"edges":[{"frontId":"001","id":"001","frontSource":"01","frontTarget":"03","sourceAnchor":1,"targetAnchor":3,"source":"01","target":"01","priority":10}]}}',
      recommendQuestion: [
        {
          number: 1,
          askType: 'faq',
          askKey: '111111',
          askText: '请问你是要询问还款吗？',
        },
      ],
    },
  });
};

// 机器人模拟对话
export default {
  'POST /aichat/robot/dialogueUrl': getChatInitData, // 对话初始化接口
  'POST /aichat/robot/dialogueText': getTextDialogData, // 文本接口
};
