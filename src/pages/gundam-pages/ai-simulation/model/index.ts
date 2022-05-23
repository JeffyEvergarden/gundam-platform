import { useState } from 'react';
import { message } from 'antd';

import { getChatInitData, textDialogData, soundRobotDialogueText } from './api';

import config from '@/config/index';

export const successCode = config.successCode;

// 菜单管理的表格数据
export const useChatModel = () => {
  const getRobotChatData = async (params?: any) => {
    let res: any = await getChatInitData(params);
    return res;
  };

  const textRobotDialogueText = async (params?: any) => {
    let res: any = await textDialogData(params);
    return res;
  };
  const soundRobotDialogue = async (params?: any) => {
    let res: any = await soundRobotDialogueText(params);
    return res;
  };

  return {
    getRobotChatData,
    textRobotDialogueText,
    soundRobotDialogue,
  };
};
