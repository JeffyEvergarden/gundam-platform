import { request } from '@/services/request';

import config from '@/config';

const baseUrl: string = config.basePath;

/** 对话初始化接口 **/
export async function getChatInitData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentList`, {
    method: 'POST',
    params,
  });
}

/** 文本对话接口 **/
export async function getTextDialogData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/intent/intentAdd`, {
    method: 'POST',
    data: params,
  });
}
