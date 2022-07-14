import { request } from '@/services/request';
import config from '@/config';

const baseUrl: string = config.basePath;

/** 获取所有菜单列表 **/
export async function queryRoleList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/role/list`, {
    method: 'GET',
    params,
  });
}

export async function getRoleInfo(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/role/getPermission`, {
    method: 'GET',
    params,
  });
}

export async function addRoleInfo(data?: Record<string, any>) {
  return request(`${baseUrl}/users/role/addInfo`, {
    method: 'POST',
    data,
  });
}

export async function updateRoleInfo(data?: Record<string, any>) {
  return request(`${baseUrl}/users/role/updateInfo`, {
    method: 'POST',
    data,
  });
}

export async function updateRoleAuth(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/role/savePermission`, {
    method: 'POST',
    data,
  });
}
