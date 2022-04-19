import { Request, Response } from 'express';
import { template } from 'lodash';
import { getFileInfo } from 'prettier';
import config from '../../../src/config';

const successCode = config.successCode;

const nodeOps = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      id: Math.random().toFixed(4),
    },
  });
};

const getConfig = (req: any, res: any) => {
  const body = req.body || {};
  res.json({
    resultCode: successCode,
    data: {
      nodes: [
        {
          frontId: '01', // 前端节点id
          id: '01', // 后端id
          nodeType: 2, // 节点类型
          label: '开始',
          x: 100,
          y: 100,
        },
        {
          frontId: '02',
          id: '02',
          nodeType: 0,
          label: '普通节点1',
          x: 500,
          y: 500,
        },
        {
          frontId: '03',
          id: '03',
          nodeType: 1,
          label: '业务节点1',
          x: 700,
          y: 200,
        },
        { frontId: '04', id: '04', nodeType: 3, label: '特殊业务节点', x: 100, y: 300 },
      ],
      edges: [
        {
          frontId: '001', // 前端id
          id: '001', // 后端id (如果有的话)
          frontSource: '01', // 前端的头id
          frontTarget: '03', // 前端的尾id
          sourceAnchor: 1, // 前锥点
          targetAnchor: 3, // 尾锥点
          source: '01', // 后端的头id
          target: '01', // 后端的尾id
        },
      ],
    },
  });
};

const getNodesConfig = (req: any, res: any) => {
  console.log('-------getNodesConfig');
  res.json({
    resultCode: successCode,
    data: {
      // name: '名侦探柯南',
      nodeDesc: '高中生侦探',
      nodeSlots: [
        {
          slotId: '011',
          required: 1,
          action: {
            actionType: 1,
            actionText: '1231231',
            textLabels: ['话术标签2'],
            messageList: [
              {
                messageMode: '001',
                telPhone: [2, '012'],
                content: '世界如此之美好',
                placeholder: ['123', '456', '789'],
              },
            ],
          },
          slotName: '前端mock词槽1',
          slotDesc: '描述1',
        },
      ],
      strategyList: [
        {
          ruleList: [
            {
              rules: [
                { ruleType: 0, condition: '==', ruleValue: '001' },
                {
                  ruleType: 1,
                  ruleKey: '011',
                  ruleKeyType: 0,
                  condition: '==',
                  valueType: 3,
                  ruleValue: '30',
                },
                {
                  ruleType: 1,
                  ruleKey: '013',
                  ruleKeyType: 2,
                  condition: '==',
                  valueType: 3,
                  ruleValue: '2022-04-29 11:32:41',
                },
              ],
            },
          ],
          conversationList: [{ actionText: '123123123', textLabels: [] }],
          actionType: 1,
          actionText: '12312312',
          textLabels: ['话术标签2'],
        },
      ],
      highConfig: {
        silenceAction: { times: 3, action: {} },
        rejectAction: { times: 3, action: {} },
        clearAction: { times: 3, action: {} },
        unclearAction: { unclearName: '客户未听清意图', times: 3, action: {} },
      },
      nodeFlowId: 'front_mock_id_1',
      nodeName: '名侦探柯南',
      robotId: '100',
      flowId: '100',
      nodeType: 0,
    },
  });
};

const getInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      id: '100',
      flowId: '100',
      robotName: '命运官位指定阿尔托莉亚潘多拉',
      robotType: 1,
    },
  });
};

const getLineConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      robotId: '100',
      flowId: '100',
      name: '七龙珠',
      level: 1,
      ruleList: [
        {
          rules: [
            {
              ruleType: 1,
              ruleKey: '011',
              ruleKeyType: 0,
              condition: '==',
              valueType: 3,
              ruleValue: '20',
            },
            {
              ruleType: 1,
              ruleKey: '013',
              ruleKeyType: 2,
              condition: '!==',
              valueType: 3,
              ruleValue: '2022-04-01 04:42:41',
            },
          ],
        },
      ],
      id: '001',
      frontId: '001',
      source: '01',
      target: '03',
      frontTarget: '03',
      frontSource: '01',
      sourceAnchor: 1,
      targetAnchor: 3,
      targetType: 1,
      sourceType: 2,
    },
  });
};

const getMessageList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalSize: 200,
      page: 1,
      list: [
        {
          templateId: '001',
          templateTitle: 'fake',
          content: '世界如此之美好',
          placeholder: ['123', '456', '789'],
        },
        {
          templateId: '002',
          templateTitle: '命运多舛',
          content: '世界如此之美好',
          placeholder: ['123', '456', '789'],
        },
      ],
    },
  });
};

// 菜单管理相关
export default {
  // 主流程管理相关
  'GET /aichat/robot/robot/robotConfig': getInfo, // 获取预先配置信息 (全局变量、主流程id)
  'POST /aichat/robot/mainDraw/nodeAdd': nodeOps, // 添加节点
  'POST /aichat/robot/mainDraw/nodeUpdate': nodeOps, // 修改业务状态
  'POST /aichat/robot/node/nodeDelete': nodeOps, // 删除节点
  'POST /aichat/robot/mainDraw/nodeLineInfo': getConfig, // 获取画布
  'POST /aichat/robot/mainDraw/nodeLineSave': nodeOps, // 保存画布
  'POST /aichat/robot/node/nodeInfo': getNodesConfig, // 获取节点信息
  'GET /aichat/robot/node/getBizNodeInfo': getNodesConfig,
  'POST /aichat/robot/node/nodeSave': nodeOps, // 保存节点配置
  'POST /aichat/robot/node/bizNodeConfigSave': nodeOps, // 保存节点配置
  'POST /aichat/robot/mainDraw/lineSave': nodeOps, // 保存线配置
  'POST /aichat/robot/mainDraw/lineRuleInfo': getLineConfig, // 获取线配置
  'GET /aichat/notification/templateListPage': getMessageList,
};

// 接口1、获取机器人信息 传robotid
// 返回：基础信息、主流程id、全局变量

// 目标是得到:
// 机器人id  ---> 主流程id
// 主流程 id
// 业务流程 id

// 接口2、添加节点 参数需要
// 前端id  id   --->
// 节点名称 label
// 复制创建  copy_id  ---> 表单复制 后端的id
// 节点类型   业务节点还是普通节点 _nodetype  ==> normal / start / business
// ----  开始节点: x =100、y=100、 前端id: 100
// 返回 ---> // 后端id

// 入参

// 接口3、修改节点
// 后端id
// 节点名称 名称

// 删除节点
// 后端id

// 接口4、保存画布
// 节点 ---->
// 线 ----> 后端头尾id、前端头尾id

// 接口5、回显画布的接口
// 节点 ----> 返回至少保证有：前端id、后端id、x、y、节点名称、节点类型
// 线 ----> 返回至少保证有：后端头尾id、前端头尾id

// 接口6、节点表单配置保存   // 业务节点、普通节点，开始节点  ----> 3个编辑接口

// 接口7、 线节点  ----> （源、尾 点位置, 表单） {前端id源、尾}  创建编辑 1个接口
