import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取所有话术标签列表 **/
export async function getLabelList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/actionLabel/actionLabelList`, {
    method: 'GET',
    params,
  });
}

/** 删除话术标签 **/
export async function deleteLabel(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/actionLabel/actionLabelDelete`, {
    method: 'POST',
    data,
  });
}

/** 添加新的话术标签 **/
export async function addNewLabel(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/actionLabel/actionLabelAdd`, {
    method: 'POST',
    data,
  });
}

/** 编辑话术标签 **/
export async function editLabel(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/actionLabel/actionLabelUpdate`, {
    method: 'POST',
    data,
  });
}
