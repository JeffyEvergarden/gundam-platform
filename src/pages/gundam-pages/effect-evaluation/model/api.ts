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
    timeout: 180 * 1000,
  });
}

//样本集明细页面
export async function getDetailTable(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailListPage`, {
    method: 'GET',
    params,
  });
}

export async function _addDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailAdd`, {
    method: 'POST',
    data,
  });
}

export async function _editDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailEdit`, {
    method: 'POST',
    data,
  });
}

export async function _deleteDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailBatchDelete`, {
    method: 'POST',
    data,
    timeout: 180 * 1000,
  });
}

export async function _confirmDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailBatchConfirm`, {
    method: 'POST',
    data,
    timeout: 180 * 1000,
  });
}

export async function _confirmAllDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailBatchAllConfirm`, {
    method: 'POST',
    data,
    timeout: 180 * 1000,
  });
}

export async function _tagDetailSample(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/sampleDetailBatchTag`, {
    method: 'POST',
    data,
  });
}

//模型评估
export async function getEvaluationTable(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/modelAssessListPage`, {
    method: 'GET',
    params,
  });
}

export async function _resultEvaluation(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/modelAssessResultListPage`, {
    method: 'GET',
    params,
  });
}

export async function _addEvaluation(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/modelAssessAdd`, {
    method: 'POST',
    data,
  });
}

export async function _deleteEvaluation(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/assess/modelAssessDelete`, {
    method: 'POST',
    data,
  });
}
