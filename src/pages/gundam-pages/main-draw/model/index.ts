import { useState } from 'react';
import { message } from 'antd';
import config from '@/config';
import { addNode, deleteNode, updateNode, getMachineMainDraw } from './api';

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
