import { useState } from 'react';
import { message } from 'antd';
import { getSessionList, getRecordList } from '../../model/api';
import config from '@/config/index';

export const successCode = config.successCode;

export const useSessionModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [recordList, setRecordList] = useState<any[]>([]);
  const [recordLoading, setRecordLoading] = useState<boolean>(false);

  // 获取表格
  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getSessionList(params);
    setTableLoading(false);
    let { list = [], totalPage, totalSize } = res.data || {};
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
    return { data: list, total: totalPage };
  };

  const getSessionRecordList = async (params?: any) => {
    setRecordLoading(true);
    let res: any = await getRecordList(params);
    setRecordLoading(false);
    let { list = [], totalPage, totalSize } = res.data;
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
    setRecordList(list || []);
    return { data: list, total: totalPage };
  };

  return {
    tableList,
    getTableList,
    tableLoading,
    recordList,
    setRecordList,
    recordLoading,
    getSessionRecordList,
  };
};
