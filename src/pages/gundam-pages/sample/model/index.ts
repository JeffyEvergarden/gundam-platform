import { useState } from 'react';
import {
  listSample,
  similarList,
  intentCorpusEdit,
  delIntentFeature,
  intentSame,
  intentAddList,
  similarSame,
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
  const checkSimilar = async (params?: any) => {
    setTableLoading(true);
    let res: any = await similarSame(params);
    setTableLoading(false);
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
    setTableLoading(true);
    let res: any = await _addSimilar(params);
    setTableLoading(false);
    return res;
  };

  return {
    getSimilarList,
    checkSimilar,
    editSimilar,
    deleteSimilar,
    addSimilar,
    tableLoading,
  };
};
