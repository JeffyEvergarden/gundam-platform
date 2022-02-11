import { request } from '@/services/request';

const baseUrl: string = '';

/** 获取所有菜单列表 **/
export async function getMachineList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/machine/list`, {
    method: 'GET',
    params,
  });
}
