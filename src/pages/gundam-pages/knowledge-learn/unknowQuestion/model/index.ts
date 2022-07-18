import { useState } from 'react';

import {
  questionList,
  addBlackList,
  addBlackListBatch,
  getintentAddBatch,
  getfaqAddBatch,
} from './api';

export const useUnknownQuestion = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await questionList(params);
    setTableLoading(false);
    return res;
  };

  const addBlack = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addBlackList(params);
    setTableLoading(false);
    return res;
  };

  const addBlackBatch = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addBlackListBatch(params);
    setTableLoading(false);
    return res;
  };

  const intentAddBatch = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getintentAddBatch(params);
    setTableLoading(false);
    return res;
  };

  const faqAddBatch = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getfaqAddBatch(params);
    setTableLoading(false);
    return res;
  };

  return {
    getList,
    tableLoading,
    addBlack,
    addBlackBatch,
    intentAddBatch,
    faqAddBatch,
  };
};
