import { useState } from 'react';
import { message } from 'antd';
import { getBlackList, deleteBlackCorpus, addBlackCorpus } from '../../model/api';
import config from '@/config/index';

export const successCode = config.successCode;

export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [opLoading, setOpLoading] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);

  // 获取表格
  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getBlackList(params);
    setTableLoading(false);
    let { list = [], totalPage, pageSize } = res.data;
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
    return { data: list, total: totalPage };
  };

  // 删除黑名单
  const deleteBlack = async (data: any) => {
    let res: any = await deleteBlackCorpus(data);
    if (res.resultCode === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res.resultMsg || '未知异常');
      return false;
    }
  };

  const addBlack = async (data: any) => {
    setOpLoading(true);
    let res: any = await addBlackCorpus(data);
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
    deleteBlack,
    addBlack,
    opLoading,
    total,
  };
};
