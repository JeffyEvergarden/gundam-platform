import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

/** 获取所有词库列表 **/
export async function lexiconList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/listPage`, {
    method: 'GET',
    params,
  });
}

/** 删除词库 **/
export async function delLexicon(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/del`, {
    method: 'post',
    data,
  });
}

/** 新增词库 **/
export async function add(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/add`, {
    method: 'post',
    data,
  });
}

/** 编辑词库 **/
export async function edit(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/entity/update`, {
    method: 'post',
    data,
  });
}
