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

export async function addAnswer(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerAdd`, {
    method: 'POST',
    data,
  });
}

export async function editAnswer(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerEdit`, {
    method: 'POST',
    data,
  });
}

export async function deleteAnswer(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerDelete`, {
    method: 'POST',
    data,
  });
}

//检测能否新增或者编辑答案
export async function isAdd(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerIsEdit`, {
    method: 'POST',
    data,
  });
}

export async function getAnswerInfo(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerInfo`, {
    method: 'GET',
    params,
  });
}

export async function getApprovalInfo(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/approvalInfo`, {
    method: 'GET',
    params,
  });
}

export async function editApproval(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/approvalEdit`, {
    method: 'POST',
    data,
  });
}

export async function deleteApproval(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/approvalDelete`, {
    method: 'POST',
    data,
  });
}

export async function getFaqConfig(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/config/list`, {
    method: 'GET',
    params,
  });
}
