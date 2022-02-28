import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 添加节点 **/
export async function addNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/nodeAdd`, {
    method: 'POST',
    data,
  });
}

/** 删除节点 **/
export async function deleteNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/nodeDelete`, {
    method: 'POST',
    data,
  });
}

/** 修改节点 **/
export async function updateNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/nodeUpdate`, {
    method: 'POST',
    data,
  });
}

/** 获取机器人默认配置 **/
export async function getMachineMainDraw(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/nodeLineInfo`, {
    method: 'POST',
    data,
  });
}

/** 保存机器人画布 **/
export async function saveMachineMainDraw(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/nodeLineSave`, {
    method: 'POST',
    data,
  });
}

// 保存机器人
export async function saveNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/nodeSave`, {
    method: 'POST',
    data,
  });
}

// 获取连线信息
export async function saveLine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/lineSave`, {
    method: 'POST',
    data,
  });
}

/** 获取节点配置信息 **/
export async function getNodesConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/nodeInfo`, {
    method: 'POST',
    data,
  });
}

// 获取连线配置
export async function getLineConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/mainDraw/lineRuleInfo`, {
    method: 'POST',
    data,
  });
}

// -----------------------------

/** 获取意图列表 **/
export async function getIntentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentList`, {
    method: 'GET',
    params,
  });
}

/** 获取词槽列表 **/
export async function getWordSlotTableList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotList`, {
    method: 'GET',
    params,
  });
}

/** 获取流程图列表 **/
export async function getFlowList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowList`, {
    method: 'GET',
    params,
  });
}
