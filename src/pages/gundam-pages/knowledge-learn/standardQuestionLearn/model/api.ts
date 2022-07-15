import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function unknownQuestionByFaqPageList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/unknownQuestionByFaqPageList`, {
    method: 'GET',
    params,
  });
}