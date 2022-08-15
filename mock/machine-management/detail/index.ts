import config from '../../../src/config';

const successCode = config.successCode;
const editConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

//word-slot里冲突 实际拿的是wordslot里的
const getConfig = (req: any, res: any) => {
  if (req.query.configType == '2') {
    res.json({
      resultCode: successCode,
      requestId: 'xx',
      resultDesc: '成功',
      success: true,
      data: [
        {
          id: '1',
          configType: 0,
          configName: 'FAQ_RECOMMEND_LIMIT',
          configValue: '3',
          configDesc: 'var1',
          configKey: 'FAQ_SEARCH_RECOMMEND_LIMIT',
          robotId: '00000',
          creator: 'jeffy',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 1,
          updateType: 0,
          validateRule: '{"min":0,"max":99}',
        },
        {
          id: '2',
          configType: 0,
          configName: 'CHANNEL_CODE',
          configValue: 'CHANNEL_CODE',
          configDesc: 'var1',
          configKey: 'CHANNEL_CODE',
          robotId: '00000',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 17:16:00',
          updateTime: '2022-04-11 17:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          dataType: 0,
          updateType: 0,
        },
      ],
    });
  } else {
    res.json({
      resultCode: successCode,
      requestId: 'xx',
      resultDesc: '成功',
      success: true,
      data: {
        pageSize: 10,
        totalPage: 1,
        page: 1,
        list: [
          {
            id: '1',
            configType: 0,
            configName: 'CHANNEL_CODE',
            configValue: 'CHANNEL_CODE',
            configDesc: 'var1',
            configKey: 'CHANNEL_CODE',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 1,
            updateType: 0,
          },
          {
            id: '2',
            configType: 0,
            configName: 'threshold',
            configValue: '1.0',
            configDesc: 'var1',
            configKey: 'THRESHOLD',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 0,
            updateType: 0,
          },
          {
            id: '3',
            configType: 0,
            configName: 'silenceToDeal',
            configValue: '静默',
            configDesc: 'var1',
            configKey: 'SILENCE_TO_DEAL',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 0,
            updateType: 0,
          },
          {
            id: '4',
            configType: 0,
            configName: 'refuseToDeal',
            configValue: '拒识',
            configDesc: 'var1',
            configKey: 'REFUSE_TO_DEAL',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 0,
            updateType: 0,
          },
          {
            id: '5',
            configType: 0,
            configName: 'clearToDeal',
            configValue: '澄清',
            configDesc: 'var1',
            configKey: 'CLEAR_TO_DEAL',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 0,
            updateType: 0,
          },
          {
            id: '6',
            configType: 1,
            configName: 'test',
            configValue: '1.0',
            configDesc: 'var1',
            configKey: 'test',
            robotId: '00000',
            creator: 'ujiangjiahao',
            createTime: '2022-04-11 17:16:00',
            updateTime: '2022-04-11 17:16:00',
            dataStatus: 0, //
            uppdateBy: 'x',
            dataType: 0,
            updateType: 1,
          },
        ],
      },
    });
  }
};

//接口配置
const getInterface = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
    requestId: 'xx',
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 1,
      page: 1,
      list: [
        {
          id: '123456',
          interfaceName: '接口1',
          interfaceUrl: 'robot/interface/listPage',
          interfaceType: 'post',
          requestHeader: '',
          requestBody: '',
          interfaceDesc: 'xxx',
          creator: 'ujiangjiahao',
          createTime: '2022-04-11 11:16:00',
          updateTime: '2022-04-11 11:16:00',
          dataStatus: 0, //
          uppdateBy: 'x',
          connectTimes: 5, // 关联词槽数量
        },
      ],
    },
  });
};

//接口详情
const getInterfaceDetail = (req: any, res: any) => {
  console.log(req.query);

  res.json({
    resultCode: successCode,
    requestId: 'xx',
    resultDesc: '成功',
    success: true,
    data: [
      {
        id: '123456',
        interfaceId: '123456',
        paramType: '0', //0:请求参数，1:响应参数
        paramKey: 1,
        paramMapKey: '',
        paramName: 'name1',
        paramValue: '',
        dataType: 0, //0.文本 1.数值 2.时间
        creator: 'ujiangjiahao',
        createTime: '2022-04-11 11:16:00',
        updateTime: '2022-04-11 11:16:00',
        dataStatus: 0, //
        uppdateBy: 'x',
      },
      {
        id: '223456',
        interfaceId: '123456',
        paramType: '1', //0:请求参数，1:响应参数
        paramKey: 1,
        paramMapKey: '',
        paramName: 'name2',
        paramValue: '',
        dataType: 0, //0.文本 1.数值 2.时间
        creator: 'ujiangjiahao',
        createTime: '2022-04-11 11:16:00',
        updateTime: '2022-04-11 11:16:00',
        dataStatus: 0, //
        uppdateBy: 'x',
      },
    ],
  });
};

//节点配置
const getNodeConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    requestId: 'xx',
    resultDesc: '成功',
    success: true,
    data: {
      robotId: 'xxx',
      highConfig: {
        allowFlows: ['front_mock_id_1'],
        configType: 2,
        clearAction: {
          configType: 1,
          // action: {
          //   actionText: undefined,
          //   actionType: undefined,

          //   textLabels: ['话术标签1'],
          // },
          messageList: undefined,
          responseList: [],
          times: 3,
        },
        rejectAction: {
          configType: 1,
          action: {
            actionText: undefined,
            actionType: undefined,
            textLabels: ['话术标签2'],
          },
          messageList: [
            {
              // content: '世界如此之美好',
              messageMode: '001',
              placeholder: ['123', '456', '789'],
              telPhone: [2, '011'],
            },
          ],
          responseList: [{ actionText: 'buhaoyisi', textLabels: undefined }],
          times: 3,
        },
        silenceAction: {
          configType: 1,
          action: {
            actionText: '2',
            actionType: 1,

            textLabels: ['话术标签3'],
          },
          messageList: undefined,
          responseList: [],
          times: 3,
        },
        unclearAction: {
          configType: 1,
          action: {
            actionText: '123',
            actionType: 2,

            textLabels: ['话术标签1'],
            toFlowId: ['front_mock_id_1'],
          },
          messageList: undefined,
          responseList: [],
          times: 3,
          wishId: '100',
        },
        threshold: 0.9,
        thresholdGap: 0.02,
      },
      systemConfigList: [
        {
          id: '111',
          robotId: 'xxx',
          configKey: 'threshold',
          configName: '阈值',
          configValue: 0.9,
          dataType: 0,
        },
        {
          id: '222',
          robotId: 'xxx',
          configKey: 'thresholdGap',
          configName: '得分差值',
          configValue: 0.02,
          dataType: 0,
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/interface/listPage': getInterface, // 接口配置分页列表
  'GET /aichat/robot/interface/param': getInterfaceDetail, // 接口配置详情

  'GET /aichat/robot/config/listPage': getConfig, // 全局变量分页
  'GET /aichat/robot/config/list': getConfig, // 全局变量所有

  'GET /aichat/robot/node/getOverConfig': getNodeConfig, // 节点
  'POST /aichat/robot/node/overConfig': editConfig, // 节点
};
