import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有机器人列表 **/
export async function getMachineList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotList`, {
    method: 'GET',
    params,
  });
}

/** 获取单个机器人列表 **/
export async function getMachineInfo(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotConfig`, {
    method: 'GET',
    params,
  });
}

/** 修改状态 **/
export async function changeMachineStatus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotStatus`, {
    method: 'POST',
    data,
  });
}

/** 删除机器 **/
export async function deleteMachine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotDelete`, {
    method: 'POST',
    data,
  });
}

/** 添加新的机器人 **/
export async function addNewMachine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotAdd`, {
    method: 'POST',
    data,
  });
}

/** 编辑机器人 **/
export async function editMachine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotUpdate`, {
    method: 'POST',
    data,
  });
}

// 发布测试机器人
export async function publishProd(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/publishProd`, {
    method: 'POST',
    data,
  });
}
// 发布生产机器人
export async function getPublishTest(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/publishTest`, {
    method: 'POST',
    data,
  });
}
// 获取发布机器人
export async function getPublishStatus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/getPublishStatus`, {
    method: 'POST',
    data,
  });
}

//全局变量配置
export async function _getGlobalValConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/list`, {
    method: 'GET',
    params,
  });
}
