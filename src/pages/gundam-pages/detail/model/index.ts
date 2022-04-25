import { useState } from 'react';
import { message } from 'antd';

import { getConfig, editConfig, getInterfaceCurrentList } from './api';
//变量配置接口
import { getConfigCurrentList, addNewGlobal, editNewGlobal, deleteGlobal } from './api';
//节点配置
import { _getNodeConfig, _saveNode } from './api';

import config from '@/config';

export const successCode = config.successCode;

// 机器人配置
export const useConfigModel = () => {
  const [configMsg, setConfigMsg] = useState<any>();
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getRobotConfig = async (params?: any) => {
    setConfigLoading(true);
    let res: any = await getConfig(params);
    setConfigLoading(false);
    setConfigMsg(res?.datas);
    return res?.datas;
  };

  const editRobotConfig = async (params?: any) => {
    setConfigLoading(true);
    let res: any = await editConfig(params);
    setConfigLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc || '成功');
    } else {
      message.info(res.resultDesc || '未知错误');
    }
    return res;
  };

  return {
    configMsg,
    configLoading,
    getRobotConfig,
    editRobotConfig,
  };
};

//接口配置
export const useInterfaceModel = () => {
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setConfigLoading(true);
    let res: any = await getInterfaceCurrentList(params);
    console.log(res);

    setConfigLoading(false);

    return { data: res.data.list, total: res.data.totalPage };
  };

  return {
    getTableList,
    configLoading,
  };
};

//变量配置
export const useGlobalModel = () => {
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setConfigLoading(true);
    let res: any = await getConfigCurrentList(params);
    console.log(res);

    setConfigLoading(false);

    return { data: res.data.list, total: res.data.totalPage };
  };

  const _deleteLabel = async (data: any) => {
    setConfigLoading(true);
    let res: any = await deleteGlobal(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '删除标签成功');
      return true;
    } else {
      message.error(res?.resultDesc || '未知错误');
    }
  };

  const addGlobal = async (data: any) => {
    setConfigLoading(true);
    let res: any = await addNewGlobal(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '新增标签成功');
      return res;
    } else {
      return res;
    }
  };

  const editGlobal = async (data: any) => {
    setConfigLoading(true);
    let res: any = await editNewGlobal(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '修改标签信息成功');
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  return {
    _deleteLabel,
    addGlobal,
    editGlobal,
    getTableList,
    configLoading,
  };
};

//节点配置
export const useNodeModel = () => {
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getNodeConfig = async (params: any) => {
    setConfigLoading(true);
    let res: any = await _getNodeConfig(params);
    setConfigLoading(false);

    return res.data;
  };

  const saveNode = async (data: any) => {
    setConfigLoading(true);
    let res: any = await _saveNode(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '修改标签信息成功');
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  return {
    getNodeConfig,
    saveNode,
    configLoading,
  };
};
