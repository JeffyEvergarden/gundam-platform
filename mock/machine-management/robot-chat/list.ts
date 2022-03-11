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
    requestId: '001002003requestId',
    actionMessage: '我接收到了信息',
    actionEvent: 'talking',
    actionSound: '',
  });
};

// 机器人模拟对话
export default {
  'POST /aichat/robot/dialogueUrl': getChatInitData, // 对话初始化接口
  'POST /aichat/robot/dialogueText': getTextDialogData, // 文本接口
};
