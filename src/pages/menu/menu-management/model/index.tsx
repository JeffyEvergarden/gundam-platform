import { useState } from 'react';
import {
  getMenuList as getMenu,
  getCurrentMenu,
  addNewLink,
  deleteLink,
  updateLink,
  addNewModule,
  updateModule,
  deleteModule,
  updateNodeParent,
  getMenuForm,
  updateMenuForm,
} from './api';
import { message } from 'antd';

export const successCode = '100';

// 菜单管理界面
// ------
export const useMenuModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<any[]>([]);

  // 数据格式化
  const giveLevel = (arr: any[], level: number, parent?: any) => {
    if (!Array.isArray(arr)) {
      return [];
    }
    let newArr = arr.map((item: any) => {
      const obj: any = {
        level: level, // 树级
        parent: parent, // 父节点
        title: item.name, // 名称
        _icon: item.icon, // 图标
        id: item.id || item.key, // id
        key: item.id || item.key, // id
        parentId: item.parentId, // 父节点id
        sort: item.sort, // 序列
        children: item.subMenu,
        _origin: item,
        form: item,
      };
      if (level >= 2) {
        obj.isLeaf = true;
      }
      if (obj.children && Array.isArray(obj.children)) {
        obj.children = giveLevel(obj.children, level + 1, obj);
      }
      return obj;
    });
    return newArr;
  };

  // 加工数据
  const processData = (arr: []) => {
    let newArr: any[] = giveLevel(arr, 1, undefined);
    return newArr;
  };

  // 加载菜单数据
  const getMenuList = async () => {
    setLoading(true);
    let res: any = await getMenu();
    setLoading(false);
    let { data = [] } = res;
    data = processData(data);
    // console.log(data);
    setMenuList(data || []);
  };

  return {
    menuList,
    getMenuList,
    setMenuList,
    loading,
  };
};

// 菜单管理的表格数据
export const useTableModel = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setTableLoading(true);
    let res: any = await getCurrentMenu(params);
    console.log(res);
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

  // 添加新链接
  const addModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await addNewLink(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('添加成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };

  // 删除链接
  const deleteModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await deleteLink(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };

  // 删除链接
  const updateModuleLink = async (params: any) => {
    setOpLoading(true);
    let res: any = await updateLink(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('修改成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };

  // 添加新链接
  const addMenuModule = async (params: any) => {
    setOpLoading(true);
    let res: any = await addNewModule(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('添加成功');
      return res?.data || {};
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return {};
    }
  };

  // 删除模块
  const deleteMenuModule = async (params: any) => {
    setOpLoading(true);
    let res: any = await deleteModule(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('删除成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };

  // 修改模块
  const updateMenuModule = async (params: any) => {
    setOpLoading(true);
    let res: any = await updateModule(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      message.success('修改成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };
  // 修改父节点
  const changeParent = async (params: any) => {
    setOpLoading(true);
    let res: any = await updateNodeParent(params);
    setOpLoading(false);
    if (res?.code === successCode) {
      return true;
    } else {
      message.error(res?.msg || '节点变更异常');
      return false;
    }
  };

  return {
    tableList,
    setTableList,
    tableLoading,
    opLoading,
    setOpLoading,
    getTableList, // 获取表格数据
    addModuleLink, // 新增链接
    deleteModuleLink, // 删除链接
    updateModuleLink, // 修改链接
    addMenuModule, // 新增模块
    deleteMenuModule, // 删除模块
    updateMenuModule, // 添加模块
    changeParent, // 修改父节点
  };
};

// 菜单管理的 通用配置

export const useFormModel = () => {
  // 数据加工层
  const getFormInfo = async () => {
    let result: any = await getMenuForm().then((res: any) => {
      if (res?.data) {
        let data = res?.data;
        return {
          flag: data?.isDisplay || undefined,
          url: data?.oldUrl || undefined,
        };
      }
      return {};
    });
    return result;
  };

  const updateFormInfo = async () => {
    let res: any = await updateMenuForm();
    if (res?.code === successCode) {
      message.success('修改成功');
      return true;
    } else {
      message.error(res?.msg || '发生未知系统异常');
      return false;
    }
  };

  return {
    getFormInfo, // 获取通用配置
    updateMenuForm, // 修改通用配置
  };
};
