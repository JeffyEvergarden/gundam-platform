import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import { addNodeLeaf, deleteNodeLeaf, editNodeLeaf, getQuestionList, getTreeList } from './api';

const successCode = config.successCode;

export const useFaqModal = () => {
  // 列表
  const [loading, setLoading] = useState<boolean>(false);
  const [faqList, setFaqList] = useState<any[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [resData, setResData] = useState<any>();

  const getFaqList = async (params: any) => {
    setLoading(true);
    let res: any = await getQuestionList({ ...params });
    setLoading(false);
    if (res.resultCode === successCode) {
      let data = res?.data?.list || [];
      let reg = /\$\{getResoureUrl\}/g;
      const reg1 = /^\<\w+\>/;
      const reg2 = /\<\/\w+\>$/;

      data?.map((item: any) => {
        item.more = false;
        item.answerList = item.answerList || [];
        item.answerList?.map?.((subitem: any) => {
          let answer = subitem.answer || '';
          if (reg1.test(answer) && reg2.test(answer)) {
            subitem.answer = answer.replace(reg, '/aichat/robot/file/getFile');
          }
          return subitem;
        });
        return item;
      });

      setFaqList(data);
      setTotalSize(res?.data?.totalPage || 0);
      setResData(res?.data);
      return { data, total: res?.data?.totalPage };
    } else {
      setFaqList([]);
      message.warning(res?.resultDesc);
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
    resData,
    faqList,
    totalSize,
    setFaqList,
    getFaqList,
    getMoreFaqList,
  };
};

export const useTreeModal = () => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [childList, setChildList] = useState<any>([]);
  let arr: any = [];

  const findparent: any = (obj: any, idx: any) => {
    let index: any = idx++ || 1;
    if (obj?.parent) {
      findparent(obj?.parent, index);

      return index;
    }
  };

  const processTreeData = (data: any[], parent?: any) => {
    if (!Array.isArray(data)) {
      return null;
    }
    let _data = data.map((item: any) => {
      let obj: any = {
        title: item.faqCount ? `${item.title} [${item.faqCount}]` : item.title,
        key: item.key,
        parent: parent || item.parent || '0',
        deep: parent?.deep + 1 || 1,
        count: item.faqCount,
        classify: item.title,
        type: item.type || 1,
      };
      let children: any = processTreeData(item.children, obj);

      //所有子
      if (!children?.length) {
        arr.push(obj);
      }
      obj.children = children;
      return obj;
    });
    console.log(arr);

    setChildList(arr);
    return _data;
  };

  const getTreeData = async (data: any) => {
    let res: any = await getTreeList(data);
    if (res.resultCode === successCode) {
      let data: any = Array.isArray(res?.data?.list) ? res?.data?.list : [];
      // 数据加工
      data = processTreeData(data);
      let root: any[] = [
        {
          title: res?.data?.faqTotal ? `全部分类 [${res?.data?.faqTotal}]` : '全部分类',
          key: '0',
          parent: undefined,
          children: data,
          count: res?.data?.faqTotal || 0,
          deep: 0,
          classify: '全部分类',
          type: 1,
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
    childList,
    getTreeData,
    addLeaf,
    editLeaf,
    deleteLeaf,
  };
};
