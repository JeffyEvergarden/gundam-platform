import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有菜单列表 **/
export async function getUsersList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/users/userlist`, {
    method: 'GET',
    params,
  });
}
