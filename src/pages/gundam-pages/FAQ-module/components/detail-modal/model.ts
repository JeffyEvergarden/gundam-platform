import config from '@/config/index';
import { useState } from 'react';
import { getRecordList, getSessionList } from '../../model/api';

export const successCode = config.successCode;

export const useSessionModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableTotal, setTableTotal] = useState<number>(0);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [recordList, setRecordList] = useState<any[]>([]);
  const [recordTotal, setRecordTotal] = useState<number>(0);
  const [recordLoading, setRecordLoading] = useState<boolean>(false);

  // 获取表格
  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getSessionList(params);
    setTableLoading(false);
    let { list = [], totalPage, pageSize } = res.data || {};
    if (!Array.isArray(list)) {
      list = [];
    }
    list = list.map((item: any, index: number) => {
      return {
        ...item,
        title: item.name,
        index,
      };
    });
    setTableList(list || []);
    setTableTotal(totalPage || 0);
    return { data: list, total: totalPage };
  };

  const getSessionRecordList = async (params?: any) => {
    setRecordLoading(true);
    let res: any = await getRecordList(params);
    setRecordLoading(false);
    // let { list = [], totalPage, pageSize } = res.data || {};
    let list = res.data || [];
    let totalPage = res.data?.length || 0;
    if (!Array.isArray(list)) {
      list = [];
    }
    list = list.map((item: any, index: number) => {
      let labels = Array.isArray(item.dialogueRecommendList) ? item.dialogueRecommendList : [];
      return {
        ...item,
        role: item.role === 1 ? '客户' : 'AI',
        userName: item.role === 1 ? '客户' : '',
        recordTime: item.createTime,
        message:
          (item.role === 1
            ? item.message
            : item?.aiTextHitType == 2 || item?.aiTextHitType == 6
            ? item.message
            : item.answerText || item.message) || '',
        labels,
        index,
      };
    });
    setRecordList(list || []);
    setRecordTotal(totalPage || 0);
    return { data: list, total: totalPage };
  };

  return {
    tableList,
    getTableList,
    tableTotal,
    tableLoading,
    recordList,
    setRecordList,
    recordTotal,
    recordLoading,
    getSessionRecordList,
  };
};
