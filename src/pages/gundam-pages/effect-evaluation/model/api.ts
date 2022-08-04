import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

export async function getTable(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sample/samplePageList`, {
    method: 'GET',
    params,
  });
}

export async function _addSample(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sample/addSample`, {
    method: 'POST',
    params,
  });
}

export async function _editSample(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sample/updateSample`, {
    method: 'POST',
    params,
  });
}

export async function _deleteSample(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/sample/deleteSample`, {
    method: 'POST',
    params,
  });
}
