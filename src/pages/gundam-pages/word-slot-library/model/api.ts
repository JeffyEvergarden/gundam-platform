import { request } from '@/services/request';

import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有词槽列表 **/
export async function getWordSlotTableList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotList`, {
    method: 'GET',
    params,
  });
}

/** 获取某个词槽 **/
export async function getWordSlotItemDetail(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotInfo`, {
    method: 'POST',
    data: params,
  });
}

/** 新增词槽 **/
export async function addWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotAdd`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 编辑词槽 **/
export async function editWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotUpdate`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 删除词槽 **/
export async function deleteWordSlotItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotDelete`, {
    method: 'POST',
    data: params,
  });
}
