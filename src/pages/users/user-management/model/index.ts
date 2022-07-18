import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';

import { getUsersList, updateUserAuth } from './api';

export const successCode = config.successCode;

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getUsersList(params);
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
    // console.log('tableList', data);
    setTableList(list || []);
    return { data: list, total: totalPage };
  };

  const updateAuth = async (data?: any) => {
    setOpLoading(true);
    let res: any = await updateUserAuth(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('编辑用户角色成功');
      return true;
    } else {
      message.warning(res.resultDesc || '未知异常');
      return false;
    }
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    setOpLoading,
    getTableList, // 获取表格数据
    updateAuth,
  };
};
