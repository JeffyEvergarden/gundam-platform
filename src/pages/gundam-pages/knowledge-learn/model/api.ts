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
export async function saveTestTsak(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/saveTestTsak`, {
    method: 'GET',
    params,
  });
}

/** 临时检测 **/
export async function temporaryTest(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/batchTest/temporaryTest`, {
    method: 'GET',
    params,
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

/** 白名单列表 **/
export async function getWhiteList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/testWhiteList/whiteListPageList`, {
    method: 'GET',
    params,
  });
}
