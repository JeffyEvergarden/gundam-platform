import config from '@/config/index';
import { request } from '@/services/request';
const baseUrl: string = config.basePath;

export async function unknownQuestionByFaqPageList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/unknownQuestionByRecommendPageList`, {
    method: 'GET',
    params,
  });
}

export async function sessionList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/sessionList`, {
    method: 'GET',
    params,
  });
}

export async function delStard(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/unknownQuestionDelete`, {
    method: 'POST',
    data: params,
  });
}
