import { useState } from 'react';
import { getReviewedList } from './api';
import config from '@/config/index';
import { message } from 'antd';

const successCode = config.successCode;

export const useReviewedModal = () => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async () => {
    setLoading(true);
    await getReviewedList().then((res) => {
      if (res.resultCode == successCode) {
        setList(res?.data?.list);
      } else {
        setList([]);
      }
      setLoading(false);
      return { data: res?.data?.list, total: res?.data?.totalPage };
    });
  };

  return {
    list,
    getList,
    loading,
  };
};
