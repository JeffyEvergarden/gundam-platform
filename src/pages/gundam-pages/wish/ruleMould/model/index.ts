import { useState } from 'react';
import {
  intentRulePageList,
  slotList,
  featureListAll,
  intentFeaturePageList,
  addRule,
  intentRuleEdit,
  ruledelete,
  intentMoveRule,
  addFeature,
  editFeature,
  deleteFeatures,
} from './api';

export const changeData = (data: any, field: any) => {
  let count = 0; //重复项的第一项
  let indexCount = 1; //下一项
  while (indexCount < data.length) {
    let item = data.slice(count, count + 1)[0]; //获取没有比较的第一个对象
    if (!item[`${field}rowSpan`]) {
      item[`${field}rowSpan`] = 1; //初始化为1
    }
    if (item[field] === data[indexCount][field]) {
      //第一个对象与后面的对象相比，有相同项就累加，并且后面相同项设置为0
      item[`${field}rowSpan`]++;
      data[indexCount][`${field}rowSpan`] = 0;
    } else {
      count = indexCount;
    }
    indexCount++;
  }
  return data;
};

export const useRuleModule = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getRuleList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentRulePageList(params);
    let tempArr: any = [];

    res?.data?.list?.map((item: any, index: any) => {
      item?.robotIntentRuleDetailList?.map((el: any) => {
        tempArr.push({
          id: item.id + '-' + el.id,
          idFather: item.id,
          idChid: el.id,
          robotId: item.robotId,
          intentRuleName: item.intentRuleName,
          threshold: item.threshold,
          dataStatus: item.dataStatus,
          updateBy: item.updateBy,
          creator: item.creator,
          createTime: item.createTime,
          robotIntentRuleDetailListId: el.id,
          intentRuleId: el.intentRuleId,
          required: el.required,
          fragment: el.fragment,
          orderNumber: el.orderNumber,
          order: index,
        });
      });
    });
    setTableLoading(false);

    changeData(tempArr, 'intentRuleName');
    let pageInfo = {
      dataTableData: tempArr,
      totalPage: res?.data?.totalPage,
      pageSize: res?.data?.pageSize,
      page: res?.data?.page,
      res,
    };

    return pageInfo;
  };

  const slotInfo = async (params?: any) => {
    setTableLoading(true);
    let res: any = await slotList(params);
    setTableLoading(false);
    return res;
  };

  const getFeatureListAll = async (params?: any) => {
    setTableLoading(true);
    let res: any = await featureListAll(params);
    setTableLoading(false);
    return res;
  };

  const getFeatureList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentFeaturePageList(params);
    setTableLoading(false);
    return res;
  };

  const ruleAdd = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addRule(params);
    setTableLoading(false);
    return res;
  };

  const ruleEdit = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentRuleEdit(params);
    setTableLoading(false);
    return res;
  };

  const deleteRule = async (params?: any) => {
    setTableLoading(true);
    let res: any = await ruledelete(params);
    setTableLoading(false);
    return res;
  };

  const moveRule = async (params?: any) => {
    setTableLoading(true);
    let res: any = await intentMoveRule(params);
    setTableLoading(false);
    return res;
  };

  const featuresAdd = async (params?: any) => {
    setTableLoading(true);
    let res: any = await addFeature(params);
    setTableLoading(false);
    return res;
  };

  const featureEdit = async (params?: any) => {
    setTableLoading(true);
    let res: any = await editFeature(params);
    setTableLoading(false);
    return res;
  };

  const delFeatures = async (params?: any) => {
    setTableLoading(true);
    let res: any = await deleteFeatures(params);
    setTableLoading(false);
    return res;
  };

  return {
    getRuleList,
    slotInfo,
    ruleAdd,
    ruleEdit,
    deleteRule,
    moveRule,
    getFeatureList,
    getFeatureListAll,
    delFeatures,
    featuresAdd,
    featureEdit,
    tableLoading,
  };
};
