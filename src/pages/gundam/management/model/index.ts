import { useState } from 'react';
import { message } from 'antd';

import {
  getMachineList,
  changeMachineStatus,
  deleteMachine,
  addNewMachine,
  editMachine,
} from './api';

export const successCode = '000000';

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getMachineList(params);
    setTableLoading(false);
    let { data = [] } = res;
    if (!Array.isArray(data)) {
      data = [];
    }
    data = data.map((item: any, index: number) => {
      return {
        ...item,
        title: item.name,
        index,
      };
    });
    // console.log('tableList', data);
    setTableList(data || []);
    return { data };
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    setOpLoading,
    getTableList, // 获取表格数据
  };
};

// 机器人管理相关操作接口
export const useOpModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // -----
  const changeStatus = async (data: any) => {
    setLoading(true);
    let res: any = await changeMachineStatus(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };
  // -----
  const _deleteMachine = async (data: any) => {
    setLoading(true);
    let res: any = await deleteMachine(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  const _addNewMachine = async (data: any) => {
    setLoading(true);
    let res: any = await addNewMachine(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success('创建机器人成功');
      return res;
    } else {
      return res;
    }
  };

  const _editMachine = async (data: any) => {
    setLoading(true);
    let res: any = await editMachine(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success('修改机器人信息成功');
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  return {
    changeStatus, // 修改状态接口
    deleteMachine: _deleteMachine, // 删除机器人接口
    addNewMachine: _addNewMachine, // 添加机器人
    editMachine: _editMachine, // 编辑机器人
    opLoading: loading,
  };
};
