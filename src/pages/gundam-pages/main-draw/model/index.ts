import { useState } from 'react';
import { message } from 'antd';
import config from '@/config';
import {
  addNode,
  deleteNode,
  updateNode,
  getMachineMainDraw,
  getIntentList,
  getWordSlotTableList,
} from './api';

export const useNodeOpsModel = () => {
  let _addNode = async (data: any) => {
    let res: any = await addNode(data);
    if (res.resultCode !== config.successCode) {
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      return true;
    }
  };

  let _updateNode = async (data: any) => {
    let res: any = await updateNode(data);
    if (res.resultCode !== config.successCode) {
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      return true;
    }
  };

  let _deleteNode = async (data: any) => {
    let res: any = await deleteNode(data);
    if (res.resultCode !== config.successCode) {
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      return true;
    }
  };

  let _getMachineMainDraw = async (data: any) => {
    let res: any = await getMachineMainDraw(data);
    if (res.resultCode === config.successCode) {
      let data: any = res?.data || {};
      return data;
    } else {
      return {};
    }
  };

  return {
    addNode: _addNode,
    updateNode: _updateNode,
    deleteNode: _deleteNode,
    getMachineMainDraw: _getMachineMainDraw,
  };
};

export const useSelectModel = () => {
  const [wishList, setWishList] = useState<any[]>([]);

  const [wordSlotList, setWordSlotList] = useState<any[]>([]);

  // 获取意图列表
  const _getWishList = async (id?: any) => {
    let res: any = await getIntentList({
      robotId: id,
      page: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.data?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          intentName: item.intentName,
        };
      }) || [];
    console.log(data);
    setWishList(data);
  };

  const _getWordSlotList = async (id?: any) => {
    let res: any = await getWordSlotTableList({
      robotId: id,
      page: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.data?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          intentName: item.slotName,
        };
      }) || [];
    console.log(data);
    setWordSlotList(data);
  };

  return {
    wishList,
    wordSlotList,
    getWishList: _getWishList,
    getWordSlotList: _getWordSlotList,
  };
};
