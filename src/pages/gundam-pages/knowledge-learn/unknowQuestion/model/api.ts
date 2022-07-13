import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function questionList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/unknownQuestionPageList`, {
    method: 'GET',
    params,
  });
}
