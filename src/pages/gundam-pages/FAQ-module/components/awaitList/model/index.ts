import { useState } from 'react';
import config from '@/config/index';
import { message } from 'antd';
import {
  getApprovalList,
  getPendingList,
  _approvalPass,
  _approvalReturn,
  _approvalDelete,
} from '../../../model/api';

const successCode = config.successCode;

export const useApprovalModel = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getApprovalList(params);
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
  };

  const getPList = async (params: any) => {
    setLoading(true);
    let res = await getPendingList(params);
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
  };

  const approvalPass = async (params: any) => {
    let res = await _approvalPass(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const approvalReturn = async (params: any) => {
    let res = await _approvalReturn(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  const approvalDelete = async (params: any) => {
    let res = await _approvalDelete(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      return true;
    } else {
      message.error(res.resultDesc);
      return false;
    }
  };

  return {
    list,
    totalPage,
    getList,
    getPList,
    approvalPass,
    approvalReturn,
    approvalDelete,
    loading,
  };
};
