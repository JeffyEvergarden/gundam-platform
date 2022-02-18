import { useState } from 'react';
import { message } from 'antd';

import { getLabelList, deleteLabel, addNewLabel, editLabel } from './api';

export const successCode = '000000';

// 菜单管理的表格数据
export const useLabelModel = () => {
  const [labelList, setLabelList] = useState<any[]>([]);
  const [labelLoading, setLabelLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getLabelTableList = async (params?: any) => {
    setLabelLoading(true);
    let res: any = await getLabelList(params);
    setLabelLoading(false);
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
    // console.log('labelList', data);
    setLabelList(data || []);
    return { data };
  };

  return {
    labelList,
    setLabelList,
    labelLoading,
    opLoading,
    setOpLoading,
    getLabelTableList, // 获取表格数据
  };
};

// 标签管理相关操作接口
export const useOpModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // -----
  const _deleteLabel = async (data: any) => {
    setLoading(true);
    let res: any = await deleteLabel(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '删除标签成功');
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  const _addNewLabel = async (data: any) => {
    setLoading(true);
    let res: any = await addNewLabel(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '新增标签成功');
      return res;
    } else {
      return res;
    }
  };

  const _editLabel = async (data: any) => {
    setLoading(true);
    let res: any = await editLabel(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc || '修改标签信息成功');
      return true;
    } else {
      return res?.resultDesc || '未知系统异常';
    }
  };

  return {
    deleteLabel: _deleteLabel, // 删除标签接口
    addNewLabel: _addNewLabel, // 添加标签
    editLabel: _editLabel, // 编辑标签
    opLoading: loading,
  };
};
