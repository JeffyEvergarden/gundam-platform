import { useState } from 'react';
import { message } from 'antd';

import { queryRoleList } from './api';
import config from '@/config';

export const successCode = config.successCode;

export const useRoleModel = () => {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getRoleList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await queryRoleList(params);
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
    // console.log('roleList', datas);
    setRoleList(list || []);
    return { data: list, total: totalPage };
  };

  return {
    roleList,
    setRoleList,
    tableLoading,
    opLoading,
    setOpLoading,
    getRoleList, // 获取表格数据
  };
};
