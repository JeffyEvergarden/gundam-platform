import { useState } from 'react';
import { message } from 'antd';

import { getWordSlotTableList, addWordSlotItem, editWordSlotItem, deleteWordSlotItem } from './api';

export const successCode = 100;

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getWordSlotTable = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getWordSlotTableList(params);
    setTableLoading(false);
    let { datas = [] } = res;
    if (!Array.isArray(datas)) {
      datas = [];
    }
    return res;
  };

  const addWordSlot = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addWordSlotItem(params);
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

  const editWordSlot = async (params?: any) => {
    setTableLoading(true);
    let res: any = await editWordSlotItem(params);
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

  const deleteWordSlot = async (params?: any) => {
    setTableLoading(true);
    let res: any = await deleteWordSlotItem(params);
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
    getWordSlotTable,
    addWordSlot,
    editWordSlot,
    deleteWordSlot,
    tableLoading,
  };
};
