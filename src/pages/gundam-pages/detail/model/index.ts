import { message } from 'antd';
import { useState } from 'react';

import {
  editConfig,
  getConfig,
  getFAQList,
  getInterfaceCurrentList,
  getRejectFAQList,
  _editFAQ,
  _editRejectFAQ,
} from './api';
//变量配置接口
import { addNewGlobal, deleteGlobal, editNewGlobal, getConfigCurrentList } from './api';
//节点配置
import { _getNodeConfig, _saveNode } from './api';

import {
  addNewChannelConfig,
  deleteChannelConfig,
  editChannelConfig,
  getChannelConfigList,
} from './api';

import config from '@/config/index';

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
    // if (res.resultCode === successCode) {
    //   message.success(res?.resultDesc || '修改标签信息成功');
    //   return true;
    // } else {
    //   return res?.resultDesc || '未知系统异常';
    // }
    return res;
  };

  return {
    getNodeConfig,
    saveNode,
    configLoading,
  };
};

//变量配置 faq配置
export const useFAQModel = () => {
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setConfigLoading(true);
    let res: any = await getFAQList(params);
    console.log(res);
    let data: any = res.data;
    data.map((item: any) => {
      if (item.validateRule) {
        item.validateRule = JSON?.parse?.(item?.validateRule);
      }
      return item;
    });

    setConfigLoading(false);

    return { data };
  };

  const editFAQ = async (data: any) => {
    setConfigLoading(true);
    let res: any = await _editFAQ(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      // message.success(res?.resultDesc);
      return res;
    } else {
      // message.error(res?.resultDesc || '未知系统异常');
      return false;
    }
  };

  const getRejectTableList = async (params: any) => {
    setConfigLoading(true);
    let res: any = await getRejectFAQList(params);
    setConfigLoading(false);
    console.log(res);
    return res?.data || [];
  };

  const editRejectTableList = async (data: any) => {
    setConfigLoading(true);
    let res: any = await _editRejectFAQ(data);
    setConfigLoading(false);
    if (res.resultCode === successCode) {
      // message.success(res?.resultDesc);
      return res;
    } else {
      // message.error(res?.resultDesc || '未知系统异常');
      return false;
    }
  };

  return {
    editFAQ,
    getTableList,
    configLoading,
    getRejectTableList,
    editRejectTableList,
  };
};

//
export const useChannelConfigModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getChannelList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getChannelConfigList(params);
    setTableLoading(false);
    let list = res.data || [];
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
    // console.log('tableList', datas);
    setTableList(list || []);
    return { data: list, total: list.length };
  };

  const addNewChannel = async (data: any) => {
    setOpLoading(true);
    let res: any = await addNewChannelConfig(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
      return false;
    }
  };

  const editChannel = async (data: any) => {
    setOpLoading(true);
    let res: any = await editChannelConfig(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('修改成功');
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
      return false;
    }
  };

  const deleteChannel = async (data: any) => {
    setOpLoading(true);
    let res: any = await deleteChannelConfig(data);
    setOpLoading(false);
    if (res.resultCode === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
      return false;
    }
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    setOpLoading,
    getChannelList, // 获取表格数据
    addNewChannel,
    editChannel,
    deleteChannel,
  };
};
