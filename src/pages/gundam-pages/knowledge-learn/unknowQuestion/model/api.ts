import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function questionList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/knowledgeLearn/unknownQuestionPageList`, {
    method: 'GET',
    params,
  });
}

export async function addBlackList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/blacklist/blacklistQuestionAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function addBlackListBatch(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/blacklist/blacklistQuestionBatchAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function getintentAddBatch(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentCorpusBatchAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function getfaqAddBatch(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqSimilarBatchAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteQuetion(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/deleteQuetion`, {
    method: 'POST',
    data: params,
  });
}
