import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  getApprovalList,
  getPendingList,
  _approvalDelete,
  _approvalPass,
  _approvalReturn,
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
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data?.list || [];
      let reg = /\$\{getResoureUrl\}/g;
      const reg1 = /^\<\w+\>/;
      const reg2 = /\<\/\w+\>$/;

      data?.map?.((subitem: any) => {
        let answer = subitem.answer || '';
        if (reg1.test(answer) && reg2.test(answer)) {
          subitem.answer = answer.replace(reg, '/aichat/robot/file/getFile');
        }
        return subitem;
      });

      setList(data);
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
      setTotalPage(0);
    }
    setLoading(false);
    return { data, total: res?.data?.totalPage };
  };

  const getPList = async (params: any) => {
    setLoading(true);
    let res = await getPendingList(params);
    console.log(res);
    if (res.resultCode == successCode) {
      let data = res?.data?.list || [];
      let reg = /\$\{getResoureUrl\}/g;
      const reg1 = /^\<\w+\>/;
      const reg2 = /\<\/\w+\>$/;

      data?.map?.((subitem: any) => {
        let answer = subitem.answer || '';
        if (reg1.test(answer) && reg2.test(answer)) {
          subitem.answer = answer.replace(reg, '/aichat/robot/file/getFile');
        }
        return subitem;
      });
      setList(data);
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
      setTotalPage(0);
    }
    setLoading(false);
    return { data: res?.data?.list, total: res?.data?.totalPage };
  };

  const approvalPass = async (params: any) => {
    setLoading(true);
    let res = await _approvalPass(params);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc);
      setLoading(false);
      return true;
    } else {
      message.error(res.resultDesc);
      setLoading(false);
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
