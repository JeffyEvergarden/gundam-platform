import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

export async function getReviewedList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqApprovalPageList`, {
    method: 'GET',
    params,
  });
}
