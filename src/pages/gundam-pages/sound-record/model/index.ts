import { useState } from 'react';
import { getList } from './api';

export const useSoundModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params?: any) => {
    setLoading(true);
    let res: any = await getList(params);
    setLoading(false);

    setTableList(res.data || []);
    return { data: res.data?.list || [], total: res?.data?.totalPage || 0 };
  };

  return {
    getTableList,
    loading,
    opLoading,
    tableList,
  };
};
