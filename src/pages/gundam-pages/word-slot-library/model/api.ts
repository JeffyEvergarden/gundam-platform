import { request } from '@/services/request';

import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有词槽列表 **/
export async function getWordSlotTableList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotList`, {
    method: 'GET',
    params,
  });
}

/** 获取某个词槽 **/
export async function getWordSlotItemDetail(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotInfo`, {
    method: 'POST',
    data: params,
  });
}

/** 新增词槽 **/
export async function addWordSlotItem(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotAdd`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 编辑词槽 **/
export async function editWordSlotItem(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotUpdate`, {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
  });
}

/** 删除词槽 **/
export async function deleteWordSlotItem(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotDelete`, {
    method: 'POST',
    data: params,
  });
}

/** 正则实体 **/
export async function zzReal(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/list`, {
    method: 'GET',
    params,
  });
}

/** 接口列表**/
export async function interFace(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/interface/list`, {
    method: 'GET',
    params,
  });
}

/** 参数列表**/
export async function paramList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/interface/param`, {
    method: 'GET',
    params,
  });
}

/** 入参值**/
export async function slotInfo(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotInfo`, {
    method: 'GET',
    params,
  });
}
