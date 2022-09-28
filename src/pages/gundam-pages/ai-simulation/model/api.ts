import { request } from '@/services/request';

import config from '@/config/index';

const baseUrl: string = config.basePath;

const CancelToken = request.CancelToken;

export const cancelObj: any = {};

import { stringify } from 'qs';

/** 对话初始化接口 **/
export async function getChatInitData(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/dialogueUrl`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 文本对话接口 **/
export async function textDialogData(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/textRobotDialogueText`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 语音对话接口 **/
export async function soundRobotDialogueText(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/soundRobotDialogueText`, {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 语音对话接口 **/
export async function getAssociationText(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/faq/searchSuggest`, {
    method: 'POST',
    data: params,
    cancelToken: new CancelToken((c) => {
      cancelObj.cancel = c;
    }),
  });
}

/** 联想点击埋点 **/
export async function textRobotSuggestClick(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/textRobotSuggestClick`, {
    method: 'POST',
    data: data,
  });
}

/** 发送埋点 **/
export async function textRobotSearchEvent(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/textRobotSearchEvent`, {
    method: 'POST',
    data: data,
  });
}

/** 推荐问埋点 **/
export async function textRobotRecommendDialogue(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/textRobotRecommendDialogue`, {
    method: 'POST',
    data: data,
  });
}

// export async function testAction(params?: Record<string, any>) {
//   return request(`${baseUrl}/robot/sound/mergeSound?${JSON.stringify(params)}`, {
//     method: 'GET',
//   });
// }
