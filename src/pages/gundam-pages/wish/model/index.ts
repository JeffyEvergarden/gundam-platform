import { useState } from 'react';
import { message } from 'antd';

import { getIntentList, addNewIntent, editIntent, deleteIntent } from './api';

export const successCode = 100;

// 菜单管理的表格数据
export const useTableModel = () => {
  const getIntentTableList = async (params?: any) => {
    let res: any = await getIntentList(params);
    let { datas = [] } = res;
    if (!Array.isArray(datas)) {
      datas = [];
    }
    return res;
  };

  const addIntentItem = async (params?: any) => {
    let res: any = await addNewIntent(params);
    return res;
  };

  const editIntentItem = async (params?: any) => {
    let res: any = await editIntent(params);
    return res;
  };

  const deleteIntentItem = async (params?: any) => {
    let res: any = await deleteIntent(params);
    return res;
  };

  return {
    getIntentTableList,
    addIntentItem,
    editIntentItem,
    deleteIntentItem,
  };
};
