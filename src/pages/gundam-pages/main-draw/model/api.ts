import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 添加节点 **/
export async function addNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/maindraw/addNode`, {
    method: 'POST',
    data,
  });
}

/** 删除节点 **/
export async function deleteNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/maindraw/deleteNode`, {
    method: 'POST',
    data,
  });
}

/** 修改节点 **/
export async function updateNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/maindraw/updateNode`, {
    method: 'POST',
    data,
  });
}

export async function getMachineMainDraw(data?: { [key: string]: any }) {
  return request(`${baseUrl}/maindraw/config`, {
    method: 'POST',
    data,
  });
}
