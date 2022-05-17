import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有问答列表 **/
export async function getQuestionList(params?: Record<string, any>) {
  return request(`${baseUrl}/faq/robotFaqPageList`, {
    method: 'GET',
    params,
  });
}

//删除问题
export async function deleteQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/faq/robotFaqDelete`, {
    method: 'POST',
    data,
  });
}

export async function getTreeList(params?: Record<string, any>) {
  return request(`${baseUrl}/faq/typeList`, {
    method: 'GET',
    params,
  });
}

export async function addNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/faq/tree/typeAdd`, {
    method: 'POST',
    data,
  });
}

export async function editNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/faq/tree/typeEdit`, {
    method: 'POST',
    data,
  });
}

export async function deleteNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/faq/tree/typeDelete`, {
    method: 'POST',
    data,
  });
}
