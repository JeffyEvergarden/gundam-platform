import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function intentRulePageList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/intentRulePageList`, {
    method: 'GET',
    params,
  });
}
