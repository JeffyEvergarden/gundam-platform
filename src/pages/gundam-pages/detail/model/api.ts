import { request } from '@/services/request';

const baseUrl: string = '/robot';

/** 获取机器人配置信息 **/
export async function getConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/config/configInfo`, {
    method: 'POST',
    params,
  });
}

/** 编辑机器人配置信息 **/
export async function editConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/config/configUpdate`, {
    method: 'POST',
    params,
  });
}
