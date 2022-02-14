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
