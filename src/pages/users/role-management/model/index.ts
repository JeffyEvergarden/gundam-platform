import { useState } from 'react';
import { message } from 'antd';

import { queryRoleList, getRoleInfo, addRoleInfo, updateRoleAuth, updateRoleInfo } from './api';
import config from '@/config';
import { AUTH_LIST } from '@/auth';

export const successCode = config.successCode;

export const useRoleModel = () => {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const [roleInfo, setInfo] = useState<any>(false);

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

  const getRole = async (params: any) => {
    setOpLoading(true);
    let res = await getRoleInfo(params);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      setInfo(res.data);
      return res.data;
    } else {
      return false;
    }
  };

  const updateAuth = async (data: any) => {
    setOpLoading(true);
    let res = await updateRoleAuth(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultMsg || '修改失败');
      return false;
    }
  };

  const addRole = async (data: any) => {
    setOpLoading(true);
    let res = await addRoleInfo(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultMsg || '新建失败');
      return false;
    }
  };

  const updateRole = async (data: any) => {
    setOpLoading(true);
    let res = await updateRoleInfo(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultMsg || '修改失败');
      return false;
    }
  };

  return {
    roleList,
    setRoleList,
    tableLoading,
    opLoading,
    roleInfo,
    setOpLoading,
    getRoleList, // 获取表格数据
    getRole,
    updateAuth,
    addRole,
    updateRole,
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
