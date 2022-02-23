import { useState } from 'react';
import { message } from 'antd';

import { getIntentList, addNewIntent, editIntent, deleteIntent } from './api';

export const successCode = 100;

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getIntentTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getIntentList(params);
    setTableLoading(false);
    let { datas = [] } = res;
    if (!Array.isArray(datas)) {
      datas = [];
    }
    return res;
  };

  const addIntentItem = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addNewIntent(params);
    setTableLoading(false);
    let { data = [] } = res;
    if (!Array.isArray(data)) {
      data = [];
    }
    return {
      data: data,
      total: res.totalSize || 1,
      pageSize: res.pageSize || 10,
      current: res.pageSize || 1,
    };
  };

  const editIntentItem = async (params?: any) => {
    setTableLoading(true);
    let res: any = await editIntent(params);
    setTableLoading(false);
    let { data = [] } = res;
    if (!Array.isArray(data)) {
      data = [];
    }
    return {
      data: data,
      total: res.totalSize || 1,
      pageSize: res.pageSize || 10,
      current: res.pageSize || 1,
    };
  };

  const deleteIntentItem = async (params?: any) => {
    setTableLoading(true);
    let res: any = await deleteIntent(params);
    setTableLoading(false);
    let { data = [] } = res;
    if (!Array.isArray(data)) {
      data = [];
    }
    return {
      data: data,
      total: res.totalSize || 1,
      pageSize: res.pageSize || 10,
      current: res.pageSize || 1,
    };
  };

  return {
    getIntentTableList,
    addIntentItem,
    editIntentItem,
    deleteIntentItem,
    tableLoading,
  };
};
