import { useState } from 'react';
import { message } from 'antd';
import { getClearList } from '../../model/api';
import config from '@/config/index';

export const successCode = config.successCode;

export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getClearList(params);
    setTableLoading(false);
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
    setTableList(list || []);
    return { data: list, total: totalPage };
  };

  return {
    tableList,
    getTableList,
    tableLoading,
  };
};
