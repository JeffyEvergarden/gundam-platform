import { message } from 'antd';
import { useState } from 'react';
import { successCode } from '../../ai-simulation/model';
import { getList, _deleteSound } from './api';

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

  const deleteSound = async (params?: any) => {
    setOpLoading(true);
    let res: any = await _deleteSound(params);
    setOpLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    getTableList,
    deleteSound,
    loading,
    opLoading,
    tableList,
  };
};
