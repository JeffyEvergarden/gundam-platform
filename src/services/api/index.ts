import { request } from '../request';

const baseUrl = '/bdp/unifyportal';
// 抓取权限
export async function queryAuthInfo(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${baseUrl}/ipBind/getAuthenUserInfo`, {
    method: 'get',
    ...(options || {}),
  });
}
