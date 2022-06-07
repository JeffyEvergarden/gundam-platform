import { useState } from 'react';
import { getReviewedList } from './api';
import config from '@/config/index';
import { message } from 'antd';

const successCode = config.successCode;

export const useReviewedModal = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async () => {
    setLoading(true);
    await getReviewedList().then((res) => {
      console.log(res);

      if (res.resultCode == successCode) {
        setList(res?.data?.list);
        setTotalPage(res?.data?.totalPage);
      } else {
        setList([]);
        setTotalPage(0);
      }
      setLoading(false);
      return { data: res?.data?.list, total: res?.data?.totalPage };
    });
  };

  return {
    list,
    totalPage,
    getList,
    loading,
  };
};
