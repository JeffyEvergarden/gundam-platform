import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  addNewMachine,
  changeMachineStatus,
  deleteMachine,
  editMachine,
  getMachineInfo,
  getMachineList,
  getPublishStatus,
  getPublishTest,
  publishProd,
  _getGlobalValConfig,
} from './api';

export const successCode = config.successCode;

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getMachineList(params);
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
    // console.log('tableList', datas);
    setTableList(list || []);
    return { data: list, total: totalPage };
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    setOpLoading,
    getTableList, // 获取表格数据
  };
};

// 机器人管理相关操作接口
export const useOpModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // 获取机器人id
  const getInfo = async (params: any) => {
    let res = await getMachineInfo(params);
    if (res.resultCode === successCode) {
      let data: any = res?.data || {};
      let obj: any = {
        robotTypeLabel: res?.data?.robotType ? 'voice' : 'text',
      };
      return { ...data, ...obj };
    } else {
      message.warning('获取不到机器人信息');
      return null;
    }
  };

  // 全局变量配置
  const getGlobalValConfig = async (params: any) => {
    let res = await _getGlobalValConfig(params);
    if (res.resultCode === successCode) {
      let data: any = res?.data || {};
      return data;
    } else {
      message.warning('获取不到全局变量配置');
      return null;
    }
  };

  // -----
  const changeStatus = async (datas: any) => {
    setLoading(true);
    let res: any = await changeMachineStatus(datas);
    setLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
    }
  };
  // -----
  const _deleteMachine = async (datas: any) => {
    setLoading(true);
    let res: any = await deleteMachine(datas);
    setLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
    }
  };

  const _addNewMachine = async (datas: any) => {
    setLoading(true);
    let res: any = await addNewMachine(datas);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success('创建机器人成功');
      return res;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
    }
  };

  const _editMachine = async (datas: any) => {
    setLoading(true);
    let res: any = await editMachine(datas);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success('修改机器人信息成功');
      return true;
    } else {
      message.error(res?.resultDesc || '未知系统异常');
    }
  };

  return {
    changeStatus, // 修改状态接口
    deleteMachine: _deleteMachine, // 删除机器人接口
    addNewMachine: _addNewMachine, // 添加机器人
    editMachine: _editMachine, // 编辑机器人
    opLoading: loading,
    getInfo,
    getGlobalValConfig, //全局变量配置
  };
};

export const usePublishModel = () => {
  const [loading, setLoading] = useState<boolean>(false); // 接口状态

  const [testLoading, setTestLoading] = useState<boolean>(false); //

  const [status, setStatus] = useState<any>(); // 发布状态

  const [testStatus, setTestStatus] = useState<any>(); // 测试发布状态

  const [productionTime, setProductionTime] = useState<any>(''); // 时间

  const [testTime, setTestTime] = useState<any>(''); // 时间

  const [result, setResult] = useState<any>('未知系统异常');
  const [testResult, setTestResult] = useState<any>('未知系统异常');

  const publishProduction = async (robotId: any) => {
    setLoading(true);
    let res: any = await publishProd({
      robotId,
    });
    setLoading(false);
    if (res.resultCode === successCode) {
      message.info('发布中...');
      getTime(robotId);
      // setProductionTime(res.datas?.publishTime || '-');
      // setStatus(res.datas?.status || false);
      // setResult(res.datas?.desc || '未知错误');
    } else {
      message.warning(res.resultDesc || '发布生产失败');
    }
  };

  const publishTest = async (robotId: any) => {
    setTestLoading(true);
    let res: any = await getPublishTest({
      robotId,
    });
    setTestLoading(false);
    if (res.resultCode === successCode) {
      message.info('发布中...');
      getTime(robotId);
      // setTestTime(res.datas?.publishTime || '-');
      // setTestStatus(res.datas?.status || false);
      // setTestResult(res.datas?.desc || '未知错误');
    } else {
      message.warning(res.resultDesc || '发布测试失败');
    }
  };

  const getTime = async (robotId: any) => {
    let res: any = await getPublishStatus({
      robotId,
    });
    setProductionTime(res.data?.prodTime || '-');
    setStatus(res.data?.prodStatus || 0);
    setResult(res.data?.prodDesc || '-');
    setTestTime(res.data?.testTime || '-');
    setTestStatus(res.data?.testStatus || 0);
    setTestResult(res.data?.testDesc || '-');
  };

  return {
    publishProduction,
    publishTest,
    loading,
    testLoading,
    productionTime,
    testTime,
    getTime,
    status,
    testStatus,
    result,
    testResult,
  };
};
