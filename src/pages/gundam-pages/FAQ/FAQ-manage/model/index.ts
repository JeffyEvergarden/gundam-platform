import { useState } from 'react';
import { getQuestionList, getTreeList, addNodeLeaf, editNodeLeaf, deleteNodeLeaf } from './api';
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
      data?.map((item: any) => {
        item.more = false;
        return item;
      });

      setFaqList(data);
      setTotalSize(res?.data?.totalPage || 0);
      return { data, total: res?.data?.totalPage };
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
      setTotalSize(res?.data?.totalPage || 0);
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

export const useTreeModal = () => {
  const [treeData, setTreeData] = useState<any[]>([]);

  const processTreeData = (data: any[], parent?: any) => {
    if (!Array.isArray(data)) {
      return null;
    }

    let _data = data.map((item: any) => {
      let obj: any = {
        title: item.title,
        key: item.key,
        parent: parent,
      };
      let children: any = processTreeData(item.children, obj);
      obj.children = children;
      return obj;
    });
    return _data;
  };

  const getTreeData = async () => {
    let res: any = await getTreeList();
    if (res.resultCode === successCode) {
      let data: any = Array.isArray(res.data) ? res.data : [];
      // 数据加工
      data = processTreeData(data);
      let root: any[] = [
        {
          title: '全部分类',
          key: '0',
          parent: undefined,
          children: data,
        },
      ];
      setTreeData(root || []);
    } else {
      setTreeData([]);
    }
  };

  // 添加叶子节点
  const addLeaf = async (data: any) => {
    let res: any = await addNodeLeaf(data);

    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '网络异常');
      return false;
    }
  };

  // 编辑叶子节点
  const editLeaf = async (data: any) => {
    let res: any = await editNodeLeaf(data);

    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '网络异常');
      return false;
    }
  };
  // 删除叶子节点
  const deleteLeaf = async (data: any) => {
    let res: any = await deleteNodeLeaf(data);

    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '网络异常');
      return false;
    }
  };

  return {
    treeData,
    getTreeData,
    addLeaf,
    editLeaf,
    deleteLeaf,
  };
};
