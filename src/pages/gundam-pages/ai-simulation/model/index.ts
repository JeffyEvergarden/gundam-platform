import { useState } from 'react';

import {
  cancelObj,
  getAssociationText,
  getChatInitData,
  soundRobotDialogueText,
  textDialogData,
} from './api';

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

  const [associationList, setAssociationList] = useState<any[]>([]);

  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getAssociationTextList = async (params: any) => {
    // 去取消
    let fn = cancelObj.cancel;
    fn && fn();
    setOpLoading(true);
    let res: any = await getAssociationText(params);
    console.log(res);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      let list: any = res?.data || [];
      list = list.map((item: any, index: number) => {
        return {
          ...item,
          label: item.suggestQuery,
          index,
        };
      });
      setAssociationList(list);
      return true;
    } else {
      return false;
    }
  };

  return {
    getRobotChatData,
    textRobotDialogueText,
    soundRobotDialogue,
    associationList,
    setAssociationList,
    opLoading,
    getAssociationTextList,
  };
};
