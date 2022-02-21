import { request } from '@/services/request';
import config from '@/config';

// const baseUrl: string = config.basePath;
const baseUrl: string = '';

/** 获取所有机器人列表 **/
export async function getMachineList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/robot/robotList`, {
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
