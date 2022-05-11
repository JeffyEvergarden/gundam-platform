import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function listSample(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/listPageSample`, {
    method: 'GET',
    params,
  });
}
export async function similarList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/similarList`, {
    method: 'GET',
    params,
  });
}
