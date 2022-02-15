import { request } from '@/services/request';

const baseUrl: string = '';

/** 获取所有机器人列表 **/
export async function getMachineList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/list`, {
    method: 'GET',
    params,
  });
}

/** 修改状态 **/
export async function changeMachineStatus(params?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/changeStatus`, {
    method: 'POST',
    params,
  });
}

/** 删除机器 **/
export async function deleteMachine(params?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/delete`, {
    method: 'POST',
    params,
  });
}

/** 添加新的机器人 **/
export async function addNewMachine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/add`, {
    method: 'POST',
    data,
  });
}

/** 编辑机器人 **/
export async function editMachine(data?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/edit`, {
    method: 'POST',
    data,
  });
}
