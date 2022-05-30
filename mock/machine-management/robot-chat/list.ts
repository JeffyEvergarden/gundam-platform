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

const textRobotDialogueText = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    // requestId: '001002003requestId',
    // actionMessage: '我接收到了信息',
    // actionEvent: 'talking',
    // actionSound: '',
    data: {
      actionMessage: '你好，这里是文本机器人为您服务',
      actionEvent: 'talking',
      askType: 'faq',
      askText: '<p>1212123</p>',
      askKey: '意图类型',
      nluInfo:
        '{"resultCode":"0000","data":{"id":"100","flowId":"100","robotName":"命运官位指定阿尔托莉亚潘多拉","robotType":0,"soundType":0}}',
      recommendQuestion: [
        {
          number: 1,
          askType: 'faq',
          askKey: '111111',
          askText: '请问你是要询问还款吗？',
        },
        {
          number: 2,
          askType: 'faq',
          askKey: '111111',
          askText: '循环产品利率？',
        },
      ],
    },
  });
};

const soundRobotDialogueText = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    // requestId: '001002003requestId',
    // actionMessage: '我接收到了信息',
    // actionEvent: 'talking',
    // actionSound: '',
    data: {
      actionMessage: '你好，这是语音机器人为您服务',
      actionEvent: 'talking',
      askType: 'faq',
      actionSound: '11111111',
      askText: '<p>1212123</p>',
      askKey: '意图类型',
      askTextSound: '111111',
      nluInfo:
        '{"resultCode":"0000","data":{"id":"100","flowId":"100","robotName":"命运官位指定阿尔托莉亚潘多拉","robotType":0,"soundType":0}}',
    },
  });
};
// 机器人模拟对话
export default {
  'POST /aichat/robot/dialogueUrl': getChatInitData, // 对话初始化接口
  'POST /aichat/robot/textRobotDialogueText': textRobotDialogueText, // 文本接口
  'POST /aichat/robot/soundRobotDialogueText': soundRobotDialogueText, // 文本接口
};
