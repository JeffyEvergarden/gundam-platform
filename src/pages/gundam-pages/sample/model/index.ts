import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import {
  batchDelete,
  batchTransfer,
  delIntentFeature,
  intentAddList,
  intentCorpusEdit,
  intentSame,
  listSample,
  similarList,
  similarSame,
} from './api';

//相似问接口
import { _addSimilar, _deleteSimilar, _editSimilar, _getSimilarList } from './api';

export const useSampleModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await listSample(params);
    setTableLoading(false);
    return res;
  };

  const intentEdit = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentCorpusEdit(params);
    setTableLoading(false);
    return res;
  };

  const deleteIntentFeature = async (params?: any) => {
    setTableLoading(true);
    let res: any = await delIntentFeature(params);
    setTableLoading(false);
    return res;
  };

  const checkIntent = async (params?: any) => {
    setLoadingAdd(true);
    setTableLoading(true);
    let res: any = await intentSame(params);
    setTableLoading(false);
    setLoadingAdd(false);
    return res;
  };

  const intentAdd = async (params?: any) => {
    setLoadingAdd(true);
    setTableLoading(true);
    let res: any = await intentAddList(params);
    setTableLoading(false);
    setLoadingAdd(false);
    return res;
  };

  const getsimilarList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await similarList(params);
    setTableLoading(false);
    return res;
  };

  return {
    getList,
    intentEdit,
    deleteIntentFeature,
    checkIntent,
    intentAdd,
    getsimilarList,
    tableLoading,
    loadingAdd,
  };
};

export const useSimilarModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  const getSimilarList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _getSimilarList(params);
    setTableLoading(false);
    return res;
  };
  const checkSimilar = async (params?: any) => {
    setAddLoading(true);
    setTableLoading(true);
    let res: any = await similarSame(params);
    setTableLoading(false);
    setAddLoading(false);
    return res;
  };

  const editSimilar = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _editSimilar(params);
    setTableLoading(false);
    return res;
  };

  const deleteSimilar = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _deleteSimilar(params);
    setTableLoading(false);
    return res;
  };

  const addSimilar = async (params?: any) => {
    setAddLoading(true);
    setTableLoading(true);
    let res: any = await _addSimilar(params);
    setTableLoading(false);
    setAddLoading(false);
    return res;
  };

  const batchDeleteSimilar = async (params?: any) => {
    setAddLoading(true);
    let res: any = await batchDelete(params);
    setAddLoading(false);
    if (res.resultCode == config.successCode) {
      message.success(res.resultDesc || '成功');
      return true;
    } else {
      message.error(res.resultDesc || '失败');
      return false;
    }
  };

  const batchTransferSimilar = async (params?: any) => {
    setAddLoading(true);
    let res: any = await batchTransfer(params);
    setAddLoading(false);
    if (res.resultCode == config.successCode) {
      message.success(res.resultDesc || '成功');
      return true;
    } else {
      message.error(res.resultDesc || '失败');
      return false;
    }
  };

  return {
    getSimilarList,
    checkSimilar,
    editSimilar,
    deleteSimilar,
    addSimilar,
    batchDeleteSimilar,
    batchTransferSimilar,
    addLoading,
    tableLoading,
  };
};
