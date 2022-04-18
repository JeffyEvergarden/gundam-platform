import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取机器人配置信息 **/
export async function getConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configInfo`, {
    method: 'POST',
    data,
  });
}

/** 编辑机器人配置信息 **/
export async function editConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configUpdate`, {
    method: 'POST',
    data,
  });
}

/** 接口配置分页列表 **/
export async function getInterfaceCurrentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/listPage`, {
    method: 'GET',
    params,
  });
}

/** 接口配置列表 **/
export async function getInterfaceList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/list`, {
    method: 'GET',
    params,
  });
}

/** 接口配置详情 **/
export async function getInterfaceDetail(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/param`, {
    method: 'GET',
    params,
  });
}

/** 变量配置分页列表 **/
export async function getConfigCurrentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/listPage`, {
    method: 'GET',
    params,
  });
}

/** 变量配置新增 **/
export async function addNewGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/add`, {
    method: 'POST',
    data,
  });
}

/** 变量配置编辑 **/
export async function editNewGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/update`, {
    method: 'POST',
    data,
  });
}

/** 变量配置编辑 **/
export async function deleteGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/del`, {
    method: 'POST',
    data,
  });
}

/** 获取全局节点信息 **/
export async function _getNodeConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/list`, {
    method: 'GET',
    params,
  });
}

/** 获取全局节点信息 **/
export async function _saveNode(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/save`, {
    method: 'GET',
    params,
  });
}
