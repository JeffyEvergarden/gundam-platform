import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  deleteDetailList,
  getBatchList,
  getDetailList,
  getWhiteList,
  saveTestTsak,
  temporaryTest as _temporaryTest,
} from './api';

const successCode = config.successCode;

export const useBatchModel = () => {
  const [list, setList] = useState<any>([]);
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
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
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
    totalPage,
    getList,
    loading,
    deleteBatch,
  };
};
//检测管理
export const useTestModel = () => {
  const saveTest = async (params: any) => {
    let res = await saveTestTsak(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const temporaryTest = async (params: any) => {
    let res = await _temporaryTest(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    saveTest,
    temporaryTest,
  };
};

export const useDetailModel = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getDetailList(params);
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

  return {
    list,
    totalPage,
    getList,
    loading,
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

  return {
    list,
    totalPage,
    getList,
    loading,
  };
};
