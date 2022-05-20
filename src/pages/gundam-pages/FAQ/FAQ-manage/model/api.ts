import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有问答列表 **/
export async function getQuestionList(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/robotFaqPageList`, {
    method: 'POST',
    data,
  });
}

//删除问题
export async function deleteQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/robotFaqDelete`, {
    method: 'POST',
    data,
  });
}

export async function getTreeList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/typeList`, {
    method: 'GET',
    params,
  });
}

export async function addNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/typeAdd`, {
    method: 'POST',
    data,
  });
}

export async function editNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/typeEdit`, {
    method: 'POST',
    data,
  });
}

export async function deleteNodeLeaf(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/typeDelete`, {
    method: 'POST',
    data,
  });
}
