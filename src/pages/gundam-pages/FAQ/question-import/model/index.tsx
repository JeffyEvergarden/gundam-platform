import { useState } from 'react';
import { getImportList } from './api';
import config from '@/config/index';
import { message } from 'antd';

const successCode = config.successCode;

export const useImportModal = () => {
  // 列表
  const [loading, setLoading] = useState<boolean>(false);
  const [importList, setImportList] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const _getImportList = async (params: any) => {
    setLoading(true);
    let res: any = await getImportList(params);
    setLoading(false);
    if (res.resultCode === successCode) {
      let data = res?.data?.list || [];
      setImportList(data);
      setTotalPage(res?.data?.totalPage || 0);
      return { data, total: res?.data?.totalPage };
    } else {
      setImportList([]);
      message.warning('获取FAQ列表失败');
      return { data: [], total: 0 };
    }
  };

  return {
    loading,
    importList,
    totalPage,
    _getImportList,
  };
};
