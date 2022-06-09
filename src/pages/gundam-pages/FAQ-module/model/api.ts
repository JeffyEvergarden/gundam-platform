import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有黑名单列表 **/
export async function getBlackList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/blacklist/blacklistPageList`, {
    method: 'GET',
    params,
  });
}
// 黑名单删除
export async function deleteBlackCorpus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/blacklist/blacklistQuestionDelete`, {
    method: 'POST',
    data,
  });
}

// 黑名单新增
export async function addBlackCorpus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/blacklist/blacklistQuestionAdd`, {
    method: 'POST',
    data,
  });
}

// ----------------------------------------------------
// 澄清模块
// 获取澄清列表
export async function getClearList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/clarifyPageList`, {
    method: 'GET',
    params,
  });
}

export async function deleteClearCorpus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/clarifyDelete`, {
    method: 'POST',
    data,
  });
}

export async function addClearCorpus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/clarifyAdd`, {
    method: 'POST',
    data,
  });
}

export async function updateClearCorpus(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/clarifyDetailAdd`, {
    method: 'POST',
    data,
  });
}

// ----------------------------------------------------

// 获取会话列表
export async function getSessionList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/clarifySessionPageList`, {
    method: 'GET',
    params,
  });
}

// 获取聊天列表
export async function getRecordList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/clarify/dialogueLogList`, {
    method: 'GET',
    params,
  });
}

//获取待审核  待处理列表
export async function getApprovalList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqApprovalPageList`, {
    method: 'GET',
    params,
  });
}

//获取历史申请记录
export async function getHistoryList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/faqApprovalHistoryPageList`, {
    method: 'GET',
    params,
  });
}

//获取现有答案列表
export async function getAnswerList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/answerList`, {
    method: 'GET',
    params,
  });
}
