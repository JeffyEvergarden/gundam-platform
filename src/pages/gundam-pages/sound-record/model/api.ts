import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

/** 获取所有话术标签列表 **/
export async function getList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sound/pageList`, {
    method: 'GET',
    params,
  });
}
