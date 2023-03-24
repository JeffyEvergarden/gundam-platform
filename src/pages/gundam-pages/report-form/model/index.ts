import { useState } from 'react';
import { successCode } from '../../ai-simulation/model';
import {
  visitorList,
  session,
  questionMatch,
  reject,
  faqAndClareList,
  searchAssociationList,
  searchCustomerTrackList,
} from './api';

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

  const searchAssociation = async (params?: any) => {
    setTableLoading(true);
    let res: any = await searchAssociationList(params);
    setTableLoading(false);
    return res;
  };

  const searchCustomerTrack = async (params: any) => {
    setTableLoading(true);
    let res: any = await searchCustomerTrackList(params);
    setTableLoading(false);
    if (res.resultCode == successCode) {
      let arr = mergeTable(res?.data?.list);
      console.log(arr);

      return { data: arr, total: res?.data?.totalPage };
    } else {
      return { data: [], total: 0 };
    }
  };

  const mergeTable = (list: any) => {
    let obj = {};
    let arr = list.map((item: any) => {
      if (obj[item.sesstionId]) {
        obj[item.sesstionId] += 1;
        return item;
      } else {
        obj[item.sesstionId] = 1;
        return { ...item, first: true };
      }
    });
    return arr.map((item: any) => {
      return { ...item, span: item.first ? obj[item.sesstionId] : 0 };
    });
  };

  return {
    getVisitorList,
    getDialogue,
    question,
    rejectList,
    getFaqAndClareList,
    searchAssociation,
    searchCustomerTrack,
    tableLoading,
  };
};
