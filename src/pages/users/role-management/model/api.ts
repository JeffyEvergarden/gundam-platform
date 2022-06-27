import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有菜单列表 **/
export async function getRoleList(params?: Record<string, any>) {
  return request(`${baseUrl}/users/role/list`, {
    method: 'GET',
    params,
  });
}
