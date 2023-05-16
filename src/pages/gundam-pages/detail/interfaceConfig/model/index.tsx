import { useState } from 'react';
import {
  postAddInterface_api,
  postSaveInterface_api,
  getInterface_api,
  deleteInterface_api,
  postTestInterface_api,
} from './api';
import { message } from 'antd';

import config from '@/config/index';

export const successCode = config.successCode;

export const useInterfaceModel = () => {
  const [btLoading, setBtLoading] = useState<any>(false);

  const [btLoading2, setBtLoading2] = useState<any>(false);

  const getInterfaceDetail = async (data: any) => {
    let res: any = await getInterface_api(data);
    if (res.resultCode == successCode) {
      return res.data || {};
    } else {
      message.warning(res.resultDesc || '未知错误');
      return false;
    }
  };

  const postAddInterface = async (data: any) => {
    setBtLoading(true);
    let res: any = await postAddInterface_api(data);
    setBtLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc || '新增成功');
      return true;
    } else {
      message.warning(res.resultDesc || '未知错误');
      return false;
    }
  };

  const postSaveInterface = async (data: any) => {
    setBtLoading(true);
    let res: any = await postSaveInterface_api(data);
    setBtLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc || '保存成功');
      return true;
    } else {
      message.warning(res.resultDesc || '未知错误');
      return false;
    }
  };

  const deleteInterface = async (data: any) => {
    setBtLoading(true);
    let res: any = await deleteInterface_api(data);
    setBtLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc || '删除成功');
      return true;
    } else {
      message.warning(res.resultDesc || '未知错误');
      return false;
    }
  };

  const postTestInterface = async (data: any) => {
    setBtLoading2(true);
    let res: any = await postTestInterface_api(data);
    setBtLoading2(false);
    if (res.resultCode == successCode) {
      return res || {};
    } else {
      message.warning(res.resultDesc || '未知错误');
      return {};
    }
  };

  return {
    btLoading,
    btLoading2,
    getInterfaceDetail,
    postAddInterface,
    postSaveInterface,
    deleteInterface,
    postTestInterface,
  };
};
