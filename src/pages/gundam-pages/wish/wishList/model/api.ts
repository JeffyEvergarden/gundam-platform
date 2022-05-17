import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有意图列表 **/
export async function getIntentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentList`, {
    method: 'GET',
    params,
  });
}

export async function getIntentInfoData(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentInfo`, {
    method: 'POST',
    data,
  });
}

/** 新增意图 **/
export async function addNewIntent(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentAdd`, {
    method: 'POST',
    data: params,
  });
}

/** 编辑意图 **/
export async function editIntent(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentUpdate`, {
    method: 'POST',
    data: params,
  });
}

/** 删除意图 **/
export async function deleteIntent(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentDelete`, {
    method: 'POST',
    data: params,
  });
}
