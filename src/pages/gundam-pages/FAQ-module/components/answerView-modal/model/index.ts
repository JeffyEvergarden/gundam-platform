import { useState } from 'react';
import config from '@/config/index';
import { message } from 'antd';
import { getAnswerList } from '../../../model/api';

const successCode = config.successCode;

export const useAnswerListModel = () => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getAnswerList(params);
    console.log(res);
    if (res.resultCode == successCode) {
      setList(res?.data);
    } else {
      setList([]);
    }
    setLoading(false);
    return { data: res?.data };
  };

  return {
    list,
    getList,
    loading,
  };
};
