import { Request, Response } from 'express';
import { getFileInfo } from 'prettier';
import config from '../../../src/config';

const successCode = config.successCode;

const nodeOps = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
    data: {
      id: Math.random().toFixed(4),
    },
  });
};

const getConfig = (req: any, res: any) => {
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
      name: '名侦探柯南',
      nodeDesc: '高中生侦探',
      business: 'front_mock_id_1',
      nodeSlots: [
        // 词槽列表
        {
          slotDesc: '1', // 词槽描述
          slotId: '011', // 词槽id
          slotName: '123', // 词槽名称
          textLabels: [], // 结束话术标签
          endText: '1213', // 结束话术
          required: true, // 是否必填
          clearText: [
            // 澄清话术列表
            {
              actionText: 'helloworld', // 澄清话术
              textLabels: [], // 标签
            },
          ],
        },
      ],
      conversationList: [
        // 对话回应
        {
          actionType: 'text', // 选择框
          nodeText: [
            // 答复内容列表
            {
              actionText: 'sadsadjljqiwoueioqwu', // 内容
              textLabels: ['话术标签2'], // 标签
            },
          ],
          hungUp: true, // 结束挂机
          replyTransfer: '', // 动作 (下拉选择)
          isMessage: true, // 是否发送短信
          message: '', // 短信内容
          nodeTransferText: 'fake', // 过渡话术
          textLabels: [], // 过渡话术标签
          rules: [
            [
              // 且关系
              {
                ruleType: '用户意图', // 枚举值: 用户意图、变量、系统时间 等
                ruleKey: '011',
                condition: '==', // ==、!=、>=、>、<、<=、include、uninclude、like、unlike、unfill、fill
                ruleValue: '001',
              },
            ],
          ],
        },
      ],
    },
  });
};

const getInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      robotInfo: {
        id: '100',
        flowId: '100',
      },
      globalVarList: [
        {
          configKey: '01',
          configName: '小米',
          configDesc: '小米',
        },
        {
          configKey: '02',
          configName: '小米2',
          configDesc: '小米',
        },
        {
          configKey: '03',
          configName: '小米3',
          configDesc: '小米',
        },
      ],
    },
  });
};

const getLineConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      name: '七龙珠',
      level: 10,
      nodeDesc: '七龙珠',
    },
  });
};

// 菜单管理相关
export default {
  // 主流程管理相关
  'POST /aichat/robot/robot/robotConfig': getInfo, // 获取预先配置信息 (全局变量、主流程id)
  'POST /aichat/robot/mainDraw/nodeAdd': nodeOps, // 添加节点
  'POST /aichat/robot/mainDraw/nodeUpdate': nodeOps, // 修改业务状态
  'POST /aichat/robot/node/nodeDelete': nodeOps, // 删除节点
  'POST /aichat/robot/mainDraw/nodeLineInfo': getConfig, // 获取画布
  'POST /aichat/robot/mainDraw/nodeLineSave': nodeOps, // 保存画布
  'POST /aichat/robot/node/nodeInfo': getNodesConfig, // 获取节点信息
  'POST /aichat/robot/node/nodeSave': nodeOps, // 保存节点配置
  'POST /aichat/robot/mainDraw/lineSave': nodeOps, // 保存线配置
  'POST /aichat/robot/mainDraw/lineRuleInfo': getLineConfig, // 获取线配置
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
