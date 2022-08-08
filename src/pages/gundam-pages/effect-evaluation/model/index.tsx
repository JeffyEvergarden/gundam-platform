import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import { getDetailTable, getTable, _addSample, _deleteSample, _editSample } from './api';

export const successCode = config.successCode;

export const useSampleModel = () => {
  const [tableList, setTableList] = useState<any>();
  const [Loading, setLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setLoading(true);
    let res: any = await getTable(params);

    if (res.resultCode == successCode) {
      setTableList(res?.data?.list);
    } else {
      setTableList([]);
    }
    setLoading(false);

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length || 0,
    };
  };

  const addSample = async (params?: any) => {
    let res: any = await _addSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const editSample = async (params?: any) => {
    let res: any = await _editSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const deleteSample = async (params?: any) => {
    let res: any = await _deleteSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    tableList,
    Loading,
    getList,
    addSample,
    editSample,
    deleteSample,
  };
};

export const useDetailSampleModel = () => {
  const [tableList, setTableList] = useState<any>();
  const [Loading, setLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setLoading(true);
    let res: any = await getDetailTable(params);

    if (res.resultCode == successCode) {
      setTableList(res?.data?.list);
    } else {
      setTableList([]);
    }
    setLoading(false);

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length || 0,
    };
  };

  const addSample = async (params?: any) => {
    let res: any = await _addSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const editSample = async (params?: any) => {
    let res: any = await _editSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const deleteSample = async (params?: any) => {
    let res: any = await _deleteSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    tableList,
    Loading,
    getList,
    addSample,
    editSample,
    deleteSample,
  };
};
