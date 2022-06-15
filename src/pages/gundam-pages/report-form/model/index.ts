import { useState } from 'react';
import { visitorList, session, questionMatch, reject, faqAndClareList } from './api';

export const useReportForm = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getVisitorList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await visitorList(params);
    setTableLoading(false);
    return res;
  };

  const getDialogue = async (params?: any) => {
    setTableLoading(true);
    let res: any = await session(params);
    setTableLoading(false);
    return res;
  };

  const question = async (params?: any) => {
    setTableLoading(true);
    let res: any = await questionMatch(params);
    setTableLoading(false);
    return res;
  };

  const rejectList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await reject(params);
    setTableLoading(false);
    return res;
  };

  const getFaqAndClareList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await faqAndClareList(params);
    setTableLoading(false);
    return res;
  };

  return {
    getVisitorList,
    getDialogue,
    question,
    rejectList,
    getFaqAndClareList,
    tableLoading,
  };
};
