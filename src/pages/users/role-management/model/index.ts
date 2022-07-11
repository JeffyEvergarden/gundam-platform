import { useState } from 'react';
import { message } from 'antd';

import { queryRoleList } from './api';
import config from '@/config';
import { AUTH_LIST } from '@/auth';
import { object } from '@umijs/deps/compiled/@hapi/joi';

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

const processTree = (arr: any[]) => {
  if (!Array.isArray(arr)) {
    return undefined;
  }

  let tree = arr.map((item: any) => {
    let obj: any = {
      title: item.label,
      key: item.code,
      _key: item.value,
    };
    if (Array.isArray(item.children)) {
      obj.children = processTree(item.children);
    }
    return obj;
  });

  return tree;
};

export const useRoleInfoModel = () => {
  const AUTH_TREE: any[] = processTree(AUTH_LIST) || [];

  const autoExpendKeys: any[] = AUTH_TREE?.map((item: any) => item.key) || [];

  return {
    AUTH_TREE,
    autoExpendKeys,
  };
};
