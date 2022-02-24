import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取机器人配置信息 **/
export async function getConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configInfo`, {
    method: 'POST',
    data,
  });
}

/** 编辑机器人配置信息 **/
export async function editConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configUpdate`, {
    method: 'POST',
    data,
  });
}
