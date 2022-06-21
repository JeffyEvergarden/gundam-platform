import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  addClearCorpus,
  deleteClearCorpus,
  getClearList,
  updateClearCorpus,
} from '../../model/api';

export const successCode = config.successCode;

export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [opLoading, setOpLoading] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);

  const [questionTotal, setQuestionTotal] = useState<number>(0);

  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getClearList(params);
    setTableLoading(false);
    let { list = [], totalPage = 0, totalSize, faqNum = 0 } = res.data;
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
    setTotal(totalPage || 0);
    setQuestionTotal(faqNum || 0);
    return { data: list, total: totalPage };
  };

  // 删除黑名单
  const deleteClearItem = async (data: any) => {
    let res: any = await deleteClearCorpus(data);
    if (res.resultCode === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res.resultDesc || '未知异常');
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
      message.error(res.resultDesc || '未知异常');
      return false;
    }
  };

  // 修改
  const updateClearItem = async (data: any) => {
    setOpLoading(true);
    let res: any = await updateClearCorpus(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.error(res.resultDesc || '未知异常');
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
    updateClearItem,
    total,
    questionTotal,
  };
};
