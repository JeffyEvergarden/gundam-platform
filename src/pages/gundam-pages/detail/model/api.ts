import { request } from '@/services/request';

const baseUrl: string = '/robot';

/** 获取机器人配置信息 **/
export async function getConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/config/configInfo`, {
    method: 'POST',
    params,
  });
}
