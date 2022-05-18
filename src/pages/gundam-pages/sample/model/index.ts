import { useState } from 'react';
import {
  listSample,
  similarList,
  intentCorpusEdit,
  delIntentFeature,
  intentSame,
  intentAddList,
} from './api';

//相似问接口
import { _getSimilarList, _editSimilar, _deleteSimilar, _addSimilar } from './api';

export const useSampleModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

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
    setTableLoading(true);
    let res: any = await intentSame(params);
    setTableLoading(false);
    return res;
  };

  const intentAdd = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentAddList(params);
    setTableLoading(false);
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
  };
};

export const useSimilarModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getSimilarList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _getSimilarList(params);
    setTableLoading(false);
    return res;
  };

  const editSimilar = async (params?: any) => {
    return await _editSimilar(params);
  };

  const deleteSimilar = async (params?: any) => {
    return await _deleteSimilar(params);
  };

  const addSimilar = async (params?: any) => {
    return await _addSimilar(params);
  };

  return {
    getSimilarList,
    editSimilar,
    deleteSimilar,
    addSimilar,
    tableLoading,
  };
};
