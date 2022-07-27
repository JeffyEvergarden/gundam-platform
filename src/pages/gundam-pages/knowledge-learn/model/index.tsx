import config from '@/config/index';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import {
  addWhiteList,
  deleteDetailList,
  deleteWhiteList,
  getBatchList,
  getDetailList,
  getWhiteList,
  saveTemporaryTask,
  saveTestTask,
  testTaskInfo,
  _sampleTransfer,
} from './api';

const successCode = config.successCode;

export const useBatchModel = () => {
  const [list, setList] = useState<any>([]);
  const [nextCheckTime, setNextCheckTime] = useState<any>('-');
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getBatchList(params);
    console.log(res);
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data?.list || [];
      setList(data);
      setNextCheckTime(
        res?.data?.nextTestTime ? moment?.(res?.data?.nextTestTime)?.format('YYYY-MM-DD') : '-',
      );
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
      setNextCheckTime('-');
      setTotalPage(0);
    }
    setLoading(false);
    return { data, total: res?.data?.totalPage };
  };

  const deleteBatch = async (params: any) => {
    let res = await deleteDetailList(params);
    if (res.resultCode == successCode) {
      return true;
    } else {
      return false;
    }
  };

  return {
    list,
    nextCheckTime,
    totalPage,
    getList,
    loading,
    deleteBatch,
  };
};
//检测管理
export const useTestModel = () => {
  const saveTest = async (params: any) => {
    let res = await saveTestTask(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const saveTemporary = async (params: any) => {
    let res = await saveTemporaryTask(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };
  const getTestTaskInfo = async (params: any) => {
    let res = await testTaskInfo(params);
    if (res.resultCode == successCode) {
      return res?.data;
    } else {
      return false;
    }
  };

  return {
    saveTest,
    saveTemporary,
    getTestTaskInfo,
  };
};

export const useDetailModel = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [SLoading, setSLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<any>();

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getDetailList(params);
    console.log(res);
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data?.list || [];
      setList(data);
      setTotalPage(res?.data?.totalPage);
      setResData(res?.data);
    } else {
      setList([]);
      setTotalPage(0);
      setResData({});
    }
    setLoading(false);
    return { data, total: res?.data?.totalPage };
  };

  const sampleTransfer = async (params: any) => {
    setSLoading(true);
    let res = await _sampleTransfer(params);
    setSLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    resData,
    list,
    totalPage,
    sampleTransfer,
    getList,
    loading,
    SLoading,
  };
};

export const useWhiteModel = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getWhiteList(params);
    console.log(res);
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data?.list || [];
      setList(data);
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
      setTotalPage(0);
    }
    setLoading(false);
    return { data, total: res?.data?.totalPage };
  };

  const addWhite = async (params: any) => {
    let res = await addWhiteList(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const deleteWhite = async (params: any) => {
    let res = await deleteWhiteList(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    list,
    totalPage,
    getList,
    addWhite,
    deleteWhite,
    loading,
  };
};
