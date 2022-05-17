import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

export async function addQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/robotFaqAdd`, {
    method: 'POST',
    data,
  });
}

export async function editQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/robotFaqEdit`, {
    method: 'POST',
    data,
  });
}

export async function getQuestionInfo(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/robotFaqInfo`, {
    method: 'GET',
    params,
  });
}
