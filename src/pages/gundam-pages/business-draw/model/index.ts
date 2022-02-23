import { useState } from 'react';
import { message } from 'antd';

import { getBusinessTableData, addBusinessItem, editBusinessItem, deleteBusinessItem } from './api';

export const successCode = 100;

// 菜单管理的表格数据
export const useTableModel = () => {
  const getFlowTableList = async (params?: any) => {
    let res: any = await getBusinessTableData(params);
    let { datas = [] } = res;
    if (!Array.isArray(datas)) {
      datas = [];
    }
    return res;
  };

  const addFlowData = async (params?: any) => {
    let res: any = await addBusinessItem(params);
    return res;
  };

  const editFlowData = async (params?: any) => {
    let res: any = await editBusinessItem(params);
    return res;
  };

  const deleteFlowData = async (params?: any) => {
    let res: any = await deleteBusinessItem(params);
    return res;
  };

  return {
    getFlowTableList,
    addFlowData,
    editFlowData,
    deleteFlowData,
  };
};
