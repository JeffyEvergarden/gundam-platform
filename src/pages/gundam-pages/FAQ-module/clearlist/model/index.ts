import { useState } from 'react';
import { message } from 'antd';
import { getClearList, deleteClearCorpus, addClearCorpus } from '../../model/api';
import config from '@/config/index';

export const successCode = config.successCode;

export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [opLoading, setOpLoading] = useState<boolean>(false);

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

  // 删除黑名单
  const deleteClearItem = async (data: any) => {
    let res: any = await deleteClearCorpus(data);
    if (res.resultCode === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res.resultMsg || '未知异常');
      return false;
    }
  };

  const addClearItem = async (data: any) => {
    setOpLoading(true);
    let res: any = await addClearCorpus(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.error(res.resultMsg || '未知异常');
      return false;
    }
  };

  return {
    tableList,
    getTableList,
    tableLoading,
    opLoading,
    deleteClearItem,
    addClearItem,
  };
};
