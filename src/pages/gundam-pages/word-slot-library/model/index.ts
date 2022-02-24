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
    return res;
  };

  const editWordSlot = async (params?: any) => {
    setTableLoading(true);
    let res: any = await editWordSlotItem(params);
    return res;
  };

  const deleteWordSlot = async (params?: any) => {
    setTableLoading(true);
    let res: any = await deleteWordSlotItem(params);
    return res;
  };

  return {
    getWordSlotTable,
    addWordSlot,
    editWordSlot,
    deleteWordSlot,
    tableLoading,
  };
};
