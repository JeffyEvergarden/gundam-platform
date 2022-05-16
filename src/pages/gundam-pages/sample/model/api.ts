import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function listSample(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/listPageSample`, {
    method: 'GET',
    params,
  });
}
export async function similarList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/similarList`, {
    method: 'GET',
    params,
  });
}

export async function _getSimilarList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/similarPageList`, {
    method: 'GET',
    params,
  });
}

export async function _editSimilar(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqSimilarEdit`, {
    method: 'POST',
    data,
  });
}

export async function _deleteSimilar(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqSimilarDelete`, {
    method: 'POST',
    data,
  });
}

export async function _addSimilar(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqSimilarAdd`, {
    method: 'POST',
    data,
  });
}
