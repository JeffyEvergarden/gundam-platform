import { useState } from 'react';
import { queryLabelList, getFlowList } from '@/services/api';
import config from '@/config';

export default function useGundamModel() {
  // 机器人的全局变量
  const [_wishList, _setWishList] = useState<any>([]); // 意图列表

  const [_globalVarList, _setGlobalVarList] = useState<any>([]);
  // 机器人的话术标签列表
  const [_labelList, _setLabelList] = useState<any>([]);
  // 业务流程列表
  const [_flowList, _setFlowList] = useState<any[]>([]); // 业务流程列表

  return {
    _wishList,
    _setWishList,
    _globalVarList,
    _setGlobalVarList,
    _labelList,
    _setLabelList,
    _flowList,
    _setFlowList,
  };
}
