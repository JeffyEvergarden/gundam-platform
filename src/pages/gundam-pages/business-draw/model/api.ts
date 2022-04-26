import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有业务流程列表 **/
export async function getBusinessTableData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowList`, {
    method: 'GET',
    params,
  });
}

/** 新增业务流程 **/
export async function addBusinessItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowAdd`, {
    method: 'POST',
    data: params,
  });
}

/** 编辑业务流程 **/
export async function editBusinessItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowUpdate`, {
    method: 'POST',
    data: params,
  });
}

/** 删除业务流程 **/
export async function deleteBusinessItem(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowDelete`, {
    method: 'POST',
    data: params,
  });
}
