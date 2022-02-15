import { request } from '@/services/request';

const baseUrl: string = '/bdp/unifyportal';

/** 获取所有菜单列表 **/
export async function getMenuList(params?: Record<string, any>) {
  return request(`${baseUrl}/menu/getBackstageTreeList`, {
    method: 'GET',
    params,
  });
}

// 获取当前子菜单
export async function getCurrentMenu(params?: Record<string, any>) {
  return request(`${baseUrl}/menu/getListByParentId`, {
    method: 'GET',
    params,
  });
}
// 修改链接
export async function updateLink(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/updateSubmodule`, {
    method: 'POST',
    data,
  });
}

// 删除链接
export async function deleteLink(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/deleteMenu`, {
    method: 'POST',
    data,
  });
}

// 新增链接
export async function addNewLink(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/addSubmodule`, {
    method: 'POST',
    data,
  });
}

// 修改模块
export async function updateModule(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/updateModule`, {
    method: 'POST',
    data,
  });
}

// 删除模块
export async function deleteModule(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/deleteMenu`, {
    method: 'POST',
    data,
  });
}

// 新增模块
export async function addNewModule(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/addModule`, {
    method: 'POST',
    data,
  });
}

// 修改节点父节点
export async function updateNodeParent(data?: Record<string, any>) {
  return request(`${baseUrl}/menu/updateModuleTree`, {
    method: 'POST',
    data,
  });
}

// 获取通用配置信息
export async function getMenuForm(params?: Record<string, any>) {
  return request(`${baseUrl}/oldHome/getOldHome`, {
    method: 'GET',
    params,
  });
}

// 修改通用配置
export async function updateMenuForm(data?: Record<string, any>) {
  return request(`${baseUrl}/oldHome/addOldHome`, {
    method: 'POST',
    data,
  });
}
