import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

/** 批量检测 **/
export async function getBatchList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/testPageList`, {
    method: 'GET',
    params,
  });
}

/** 检测计划保存 **/
export async function saveTestTask(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/saveTestTask`, {
    method: 'POST',
    data,
  });
}
/** 回显检测计划 **/
export async function testTaskInfo(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/testTaskInfo`, {
    method: 'GET',
    params,
  });
}

/** 临时检测 **/
export async function saveTemporaryTask(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/saveTemporaryTask`, {
    method: 'POST',
    data,
  });
}

/** 删除明细 **/
export async function deleteDetailList(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/testDetailDelete`, {
    method: 'POST',
    data,
  });
}

/** 明细 **/
export async function getDetailList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/testDetailPageList`, {
    method: 'GET',
    params,
  });
}

/** 明细转移  合并 **/
export async function _sampleTransfer(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/sampleTransfer`, {
    method: 'POST',
    data,
  });
}

/** 白名单列表 **/
export async function getWhiteList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/testWhiteList/whiteListPageList`, {
    method: 'GET',
    params,
  });
}

/** 添加到白名单 **/
export async function addWhiteList(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/testWhiteList/whiteListAdd`, {
    method: 'POST',
    data,
  });
}

/** 添加到白名单 **/
export async function deleteWhiteList(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/testWhiteList/whiteListDelete`, {
    method: 'POST',
    data,
  });
}
