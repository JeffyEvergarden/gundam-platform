import { useState } from 'react';
import { message } from 'antd';

import { getMachineList } from './api';

export const successCode = '100';

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
