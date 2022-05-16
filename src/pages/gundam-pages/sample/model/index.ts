import { useState } from 'react';
import { listSample, similarList } from './api';

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

  const getsimilarList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await similarList(params);
    setTableLoading(false);
    return res;
  };

  return {
    getList,
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
