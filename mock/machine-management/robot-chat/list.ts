import config from '../../../src/config';

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
      actionMessage: '',
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
      recommendText: '您是否还想咨询以下问题：',
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
      actionMessage: '',
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

const getAssociationText = (req: any, res: any) => {
  const arr = [
    {
      suggestQuery: (Math.random() * 1000).toFixed(2),
    },
    {
      suggestQuery: '中邮消费金融',
    },
    {
      suggestQuery: '爱德华.阿尔冯斯',
    },
    {
      suggestQuery:
        '陈奕迅挚爱一生中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融',
    },
    {
      suggestQuery: '孤独患者',
    },
    {
      suggestQuery: (Math.random() * 1000).toFixed(2),
    },
    {
      suggestQuery: '中邮消费金融',
    },
    {
      suggestQuery: '爱德华.阿尔冯斯',
    },
    {
      suggestQuery:
        '陈奕迅挚爱一生中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融中邮消费金融',
    },
    {
      suggestQuery: '孤独患者',
    },
  ];
  setTimeout(() => {
    res.json({
      resultCode: config.successCode,
      resultDesc: '成功',
      data: arr,
    });
  }, 2000);
};

// 机器人模拟对话
export default {
  'POST /aichat/robot/dialogueUrl': getChatInitData, // 对话初始化接口
  'POST /aichat/robot/textRobotDialogueText': textRobotDialogueText, // 文本接口
  'POST /aichat/robot/soundRobotDialogueText': soundRobotDialogueText, // 文本接口
  'POST /aichat/robot/faq/searchSuggest': getAssociationText, // 文本接口

  'POST /aichat/robot/textRobotSuggestClick': getChatInitData, // 埋点
  'POST /aichat/robot/textRobotSearchEvent': getChatInitData, // 埋点
  'POST /aichat/robot/textRobotRecommendDialogue': textRobotDialogueText, // 埋点
};
