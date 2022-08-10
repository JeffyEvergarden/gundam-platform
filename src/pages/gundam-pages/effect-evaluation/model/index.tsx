import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  getDetailTable,
  getEvaluationTable,
  getTable,
  _addDetailSample,
  _addEvaluation,
  _addSample,
  _confirmAllDetailSample,
  _confirmDetailSample,
  _deleteDetailSample,
  _deleteEvaluation,
  _deleteSample,
  _editDetailSample,
  _editSample,
  _resultEvaluation,
  _tagDetailSample,
} from './api';

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
  const [result, setResult] = useState<any>({});
  const [addLoading, setAddLoading] = useState<boolean>(true);
  const [editLoading, setEditLoading] = useState<boolean>(true);

  const getList = async (params?: any) => {
    setLoading(true);
    let res: any = await getDetailTable(params);

    if (res.resultCode == successCode) {
      setTableList(res?.data?.list);
      setResult(res?.data);
    } else {
      setTableList([]);
    }
    setLoading(false);

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length || 0,
    };
  };

  const addDetailSample = async (params?: any) => {
    setAddLoading(false);
    let res: any = await _addDetailSample(params);
    setAddLoading(true);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const editDetailSample = async (params?: any) => {
    setEditLoading(true);
    let res: any = await _editDetailSample(params);
    setEditLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const deleteDetailSample = async (params?: any) => {
    let res: any = await _deleteDetailSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const confirmDetailSample = async (params?: any) => {
    let res: any = await _confirmDetailSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const confirmAllDetailSample = async (params?: any) => {
    let res: any = await _confirmAllDetailSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const tagDetailSample = async (params?: any) => {
    let res: any = await _tagDetailSample(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    addLoading,
    result,
    tableList,
    Loading,
    editLoading,
    getList,
    addDetailSample,
    editDetailSample,
    deleteDetailSample,
    confirmDetailSample,
    tagDetailSample,
    confirmAllDetailSample,
  };
};

export const useEvaluationModel = () => {
  const [tableList, setTableList] = useState<any>();
  const [resultData, setResultData] = useState<any>();
  const [Loading, setLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setLoading(true);
    let res: any = await _resultEvaluation(params);

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

  const getResultList = async (params?: any) => {
    setLoading(true);
    let res: any = await getEvaluationTable(params);

    if (res.resultCode == successCode) {
      setResultData(res?.data);
    } else {
      setResultData([]);
    }
    setLoading(false);

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length || 0,
    };
  };

  const addEvaluation = async (params?: any) => {
    let res: any = await _addEvaluation(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const deleteEvaluation = async (params?: any) => {
    let res: any = await _deleteEvaluation(params);
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
    resultData,
    Loading,
    getList,
    addEvaluation,
    getResultList,
    deleteEvaluation,
  };
};
