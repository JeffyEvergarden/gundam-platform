import { useState } from 'react';
import { queryLabelList, queryFlowList } from '@/services/api';
import config from '@/config';

export default function useGundamModel() {
  const localBusinessFlowId =
    sessionStorage.getItem('businessFlowId') || localStorage.getItem('businessFlowId') || '';

  const [info, setInfo] = useState<any>({});

  // 机器人的全局变量
  const [globalVarList, setGlobalVarList] = useState<any>([]);

  // 业务流程id
  const [businessFlowId, setBusinessFlowId] = useState<any>(localBusinessFlowId);

  return {
    info,
    setInfo,
    businessFlowId,
    setBusinessFlowId,
    globalVarList,
    setGlobalVarList,
  };
}
