import config from './../../../src/config';
const successCode = config.successCode;
const intentList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      totalPage: 7,
      pageSize: 10,
      page: 1,
      list: [
        {
          id: '100',
          intentName: '意图名称',
          headIntent: 0,
          inquiryText: '澄清名称',
          flowInfoName: '业务流程', // 0：文本   1：语音
          intentDesc: '这是一段描述', // 0：启用 1：停用
          onlineTime: '2022-01-12',
          creator: '折木奉太郎',
          createTime: '2022-01-15 20:00:00',
        },
      ],
    },
  });
};

export default {
  // 机器人管理相关
  'GET /aichat/robot/intent/intentList': intentList, // 获取机器人管理列表
};
