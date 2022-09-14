import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

export async function getList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sound/pageList`, {
    method: 'GET',
    params,
  });
}

export async function uploadSound(data?: any) {
  return request(`${baseUrl}/robot/sound/upload`, {
    method: 'POST',
    body: data,
    timeout: 180 * 1000,
  });
}
