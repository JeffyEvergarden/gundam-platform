import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

/** 访客次数统计 **/
export async function visitorList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/visitor`, {
    method: 'GET',
    params,
  });
}

/** 访客会话明细**/
export async function session(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/session`, {
    method: 'GET',
    params,
  });
}
/** 问题匹配率**/
export async function questionMatch(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/questionMatch`, {
    method: 'GET',
    params,
  });
}
