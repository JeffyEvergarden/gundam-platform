import { useState } from 'react';
import { message } from 'antd';

import {
  getWordSlotTableList,
  getWordSlotItemDetail,
  addWordSlotItem,
  editWordSlotItem,
  deleteWordSlotItem,
  zzReal,
  interFace,
  paramList,
  slotInfo,
} from './api';

export const successCode = 100;

// 菜单管理的表格数据
export const useKeyWordModel = () => {
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

  const getWordSlotDetail = async (params?: any) => {
    let res: any = await getWordSlotItemDetail(params);
    return res;
  };

  const addWordSlot = async (params?: any) => {
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

  const getzzReal = async (params?: any) => {
    setTableLoading(true);
    let res: any = await zzReal(params);
    return res;
  };

  const interFaceList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await interFace(params);
    return res;
  };

  const getparamList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await paramList(params);
    return res;
  };

  const getslotInfo = async (params?: any) => {
    setTableLoading(true);
    let res: any = await slotInfo(params);
    return res;
  };

  return {
    getWordSlotTable,
    getWordSlotDetail,
    addWordSlot,
    editWordSlot,
    deleteWordSlot,
    getzzReal,
    interFaceList,
    getparamList,
    getslotInfo,
    tableLoading,
  };
};
