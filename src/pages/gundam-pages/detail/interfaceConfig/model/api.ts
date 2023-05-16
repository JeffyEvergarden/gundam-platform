import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

/** 新增接口 **/
export async function postAddInterface_api(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/addInterface`, {
    method: 'POST',
    data,
  });
}

/** 新增接口 **/
export async function postSaveInterface_api(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/editInterface`, {
    method: 'POST',
    data,
  });
}

export async function deleteInterface_api(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/deleteInterface`, {
    method: 'POST',
    data,
  });
}

/** 详情接口 **/
export async function getInterface_api(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/interfaceInfo`, {
    method: 'GET',
    params: data,
  });
}

export async function postTestInterface_api(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/test`, {
    method: 'POST',
    data,
  });
}
