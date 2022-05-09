import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有问答列表 **/
export async function getQuestionList(params?: Record<string, any>) {
  return request(`${baseUrl}/faq/list`, {
    method: 'GET',
    params,
  });
}

export async function getTreeList(params?: Record<string, any>) {
  return request(`${baseUrl}/faq/tree`, {
    method: 'GET',
    params,
  });
}
