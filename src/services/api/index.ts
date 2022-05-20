import { request } from '../request';

const baseUrl = '/aichat';
// 抓取权限
export async function queryAuthInfo(options?: Record<string, any>) {
  return request<Record<string, any>>(`${baseUrl}/ipBind/getAuthenUserInfo`, {
    method: 'get',
    ...(options || {}),
  });
}

// 抓取话术标签列表
export async function queryLabelList(params?: Record<string, any>) {
  return request<Record<string, any>>(`${baseUrl}/robot/actionLabel/actionLabelList`, {
    method: 'get',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

// 获取业务流程列表
export async function queryFlowList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowList`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

// 获取信息模版
export async function queryMessageList(params?: Record<string, any>) {
  return request<Record<string, any>>(`${baseUrl}/notification/templateListPage`, {
    method: 'get',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

/** 获取意图列表 **/
export async function queryWishList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentList`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

/** 获取词槽列表 **/
export async function queryWordSlotTableList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/slot/slotList`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

//获取所有全局变量配置
export async function queryGlobalValConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/listPage`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 1000,
      ...params,
    },
  });
}

//获取所有全局节点配置
export async function queryNodeConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/getOverConfig`, {
    method: 'GET',
    params,
  });
}

export async function queryTreeList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/typeList`, {
    method: 'GET',
    params,
  });
}

//faq用户信息
export async function queryCreateUser(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/listCreateUser`, {
    method: 'GET',
    params,
  });
}
