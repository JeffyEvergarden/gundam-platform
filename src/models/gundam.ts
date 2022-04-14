import { useState } from 'react';
import { queryLabelList, getFlowList } from '@/services/api';
import config from '@/config';

export default function useGundamModel() {
  const localBusinessFlowId =
    sessionStorage.getItem('businessFlowId') || localStorage.getItem('businessFlowId') || '';

  const [info, setInfo] = useState<any>({});

  // 机器人的全局变量
  const [globalVarList, setGlobalVarList] = useState<any>([]);

  // 业务流程id
  const [businessFlowId, setBusinessFlowId] = useState<any>(localBusinessFlowId);

  // 机器人的话术标签列表
  const [labelList, setLabelList] = useState<any>([]);

  const getLabelList = async () => {
    if (!info.id) {
      console.log('机器人的话术标签获取不到机器人id');
      return null;
    }
    let res: any = await queryLabelList({ robotId: info.id });
    let data: any[] = res?.data?.list || [];
    setLabelList(data);
  };

  const [flowList, setFlowList] = useState<any[]>([]); // 业务流程列表

  // 获取业务流程列表
  const _getFlowList = async () => {
    let res: any = await getFlowList({
      robotId: info.id,
      page: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.datas?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.flowName,
        };
      }) || [];
    setFlowList(data);
  };

  return {
    info,
    setInfo,
    globalVarList,
    setGlobalVarList,
    labelList,
    getLabelList,
    flowList,
    getFlowList: _getFlowList,
    businessFlowId,
    setBusinessFlowId,
  };
}
