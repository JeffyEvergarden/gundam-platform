import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

const CancelToken = request.CancelToken;

export const cancelObj: any = {};

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
export async function textDialogData(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/textRobotDialogueText`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 语音对话接口 **/
export async function soundRobotDialogueText(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/soundRobotDialogueText`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 语音对话接口 **/
export async function getAssociationText(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/faq/searchSuggest`, {
    method: 'POST',
    data: params,
    cancelToken: new CancelToken((c) => {
      cancelObj.cancel = c;
    }),
  });
}
