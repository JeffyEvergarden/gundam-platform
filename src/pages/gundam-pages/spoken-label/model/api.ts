import { request } from '@/services/request';

const baseUrl: string = '/robot';

/** 获取所有话术标签列表 **/
export async function getLabelList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/actionLabel/actionLabelList`, {
    method: 'GET',
    params,
  });
}

/** 删除话术标签 **/
export async function deleteLabel(params?: { [key: string]: any }) {
  return request(`${baseUrl}/actionLabel/actionLabelDelete`, {
    method: 'POST',
    params,
  });
}

/** 添加新的话术标签 **/
export async function addNewLabel(data?: { [key: string]: any }) {
  return request(`${baseUrl}/actionLabel/actionLabelAdd`, {
    method: 'POST',
    data,
  });
}

/** 编辑话术标签 **/
export async function editLabel(data?: { [key: string]: any }) {
  return request(`${baseUrl}/actionLabel/actionLabelUpdate`, {
    method: 'POST',
    data,
  });
}
