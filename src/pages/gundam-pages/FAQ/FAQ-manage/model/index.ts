import { useState } from 'react';
import { getQuestionList } from './api';
import config from '@/config/index';
import { message } from 'antd';

const successCode = config.successCode;

export const useFaqModal = () => {
  // 列表
  const [loading, setLoading] = useState<boolean>(false);
  const [faqList, setFaqList] = useState<any[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);

  const getFaqList = async (params: any) => {
    setLoading(true);
    let res: any = await getQuestionList(params);
    setLoading(false);
    if (res.resultCode === successCode) {
      let data = res?.data?.list || [];
      setFaqList(data);
      setTotalSize(res?.data?.totalSize || 0);
      return true;
    } else {
      setFaqList([]);
      message.warning('获取FAQ列表失败');
      return false;
    }
  };

  const getMoreFaqList = async (params: any) => {
    setLoading(true);
    let res: any = await getQuestionList(params);
    setLoading(false);
    console.log();
    if (res.resultCode === successCode) {
      let data = res?.data?.list || [];
      setTotalSize(res?.data?.totalSize || 0);
      setFaqList([...faqList, ...data]);
      return true;
    } else {
      message.warning('获取FAQ列表失败');
      return false;
    }
  };

  return {
    loading,
    faqList,
    totalSize,
    setFaqList,
    getFaqList,
    getMoreFaqList,
  };
};
