import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

//样本集页面
export async function getTable(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleListPage`, {
    method: 'GET',
    params,
  });
}

export async function _addSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleAdd`, {
    method: 'POST',
    data,
  });
}

export async function _editSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleUpdate`, {
    method: 'POST',
    data,
  });
}

export async function _deleteSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDelete`, {
    method: 'POST',
    data,
  });
}

export async function importSample(data?: any) {
  return request(`${baseUrl}/robot/assess/sampleUpload`, {
    method: 'POST',
    // data,
    body: data,
  });
}

//样本集明细页面
export async function getDetailTable(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailListPage`, {
    method: 'GET',
    params,
  });
}
