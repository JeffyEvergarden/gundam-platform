import { useState } from 'react';
import { message } from 'antd';

import { getChatInitData, getTextDialogData } from './api';

import config from '@/config/index';

export const successCode = config.successCode;

// 菜单管理的表格数据
export const useChatModel = () => {
  const getRobotChatData = async (params?: any) => {
    let res: any = await getChatInitData(params);
    return res;
  };

  const getDialogData = async (params?: any) => {
    let res: any = await getTextDialogData(params);
    return res;
  };

  return {
    getRobotChatData,
    getDialogData,
  };
};
