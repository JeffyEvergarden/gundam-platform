import { request } from '@/services/request';

import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有意图列表 **/
export async function getWordSlotTableList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotList`, {
    method: 'GET',
    params,
  });
}

/** 新增意图 **/
export async function addWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotAdd`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 编辑意图 **/
export async function editWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotUpdate`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 删除意图 **/
export async function deleteWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotDelete`, {
    method: 'POST',
    data: params,
  });
}
