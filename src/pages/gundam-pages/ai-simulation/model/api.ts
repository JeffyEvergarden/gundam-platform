import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 对话初始化接口 **/
export async function getChatInitData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/dialogueUrl`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 文本对话接口 **/
export async function getTextDialogData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/dialogueText`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
