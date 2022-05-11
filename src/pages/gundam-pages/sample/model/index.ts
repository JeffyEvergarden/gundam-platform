import { useState } from 'react';
import { listSample, similarList } from './api';

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
