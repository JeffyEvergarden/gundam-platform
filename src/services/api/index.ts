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
export async function getFlowList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/flow/flowList`, {
    method: 'GET',
    params,
  });
}
