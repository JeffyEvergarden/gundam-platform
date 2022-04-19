import { useState } from 'react';
import { queryLabelList, queryFlowList, queryGlobalValConfig } from '@/services/api';
import config from '@/config';

export default function useGundamModel() {
  const localBusinessFlowId =
    sessionStorage.getItem('businessFlowId') || localStorage.getItem('businessFlowId') || '';

  const [info, setInfo] = useState<any>({});

  // 机器人的全局变量
  const [globalVarList, setGlobalVarList] = useState<any>([]);

  // 业务流程id
  const [businessFlowId, setBusinessFlowId] = useState<any>(localBusinessFlowId);

  // 全局变量
  const getGlobalValConfig = async (id: any) => {
    if (!id) {
      console.log('机器人的全局变量配置获取不到机器人id');
      return null;
    }
    let res: any = await queryGlobalValConfig({ robotId: id, configType: 1 });
    let data: any[] = res?.data?.list || [];

    data = data?.map((item: any) => {
      return {
        name: item.configKey,
        label: item.configName,
        desc: item.configDesc,
        type: item.dataType,
      };
    });
    console.log(data);

    setGlobalVarList(data);
  };

  return {
    info,
    setInfo,
    businessFlowId,
    setBusinessFlowId,
    globalVarList,
    getGlobalValConfig,
  };
}
