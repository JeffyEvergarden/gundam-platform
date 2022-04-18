import { Request, Response } from 'express';

const successCode = '0000';
const editConfig = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

const getConfig = (req: any, res: any) => {
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
          id: '1',
          configType: 0,
          configName: 'thresholdGap',
          configValue: '1.0',
          configDesc: 'var1',
          configKey: 'THRESHOLD_GAP',
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
      allowFlows: ['front_mock_id_1'],
      clearAction: {
        action: {
          actionText: undefined,
          actionType: undefined,
          messageList: undefined,
          textLabels: ['话术标签1'],
        },
        responseList: [],
        times: 3,
      },
      rejectAction: {
        action: {
          actionText: undefined,
          actionType: undefined,
          messageList: [
            {
              content: '世界如此之美好',
              messageNode: '001',
              placeholder: ['123', '456', '789'],
              telPhone: [2, '011'],
            },
          ],
          textLabels: ['话术标签2'],
        },
        responseList: [{ actionText: 'buhaoyisi', textLabels: undefined }],
        times: 3,
      },
      silenceAction: {
        action: {
          actionText: '2',
          actionType: 1,
          messageList: undefined,
          textLabels: ['话术标签3'],
        },
        responseList: [],
        times: 3,
      },
      unclearAction: {
        action: {
          actionText: '123',
          actionType: 2,
          messageList: undefined,
          textLabels: ['话术标签1'],
          toFlowId: ['front_mock_id_1'],
        },
        responseList: [],
        times: 3,
        unclearName: '客户未听清意图',
      },
      threshold: 0.9,
      thresholdGap: 0.02,
    },
  });
};

export default {
  // 'POST /aichat/robot/config/configInfo': getConfig, //
  // 'POST /aichat/robot/config/configUpdate': editConfig, //

  'GET /aichat/robot/interface/listPage': getInterface, // 接口配置分页列表
  'GET /aichat/robot/interface/param': getInterfaceDetail, // 接口配置详情

  'GET /aichat/robot/config/listPage': getConfig, // 全局变量分页
  'GET /aichat/robot/config/list': getConfig, // 全局变量所有

  'GET /aichat/robot/node/list': getNodeConfig, // 节点
};
