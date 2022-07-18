import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

export async function sessionRecordPageList(params?: any) {
  return request(`${baseUrl}/robot/knowledgeLearn/sessionRecordPageList`, {
    method: 'GET',
    params,
  });
}
