import { useState, useRef } from 'react';
import { queryLabelList, queryFlowList, queryGlobalValConfig } from '@/services/api';
import config from '@/config/index';

export default function useGundamModel() {
  const localBusinessFlowId =
    sessionStorage.getItem('businessFlowId') || localStorage.getItem('businessFlowId') || '';

  const [info, setInfo] = useState<any>({});

  // 机器人的全局变量
  const [globalVarList, setGlobalVarList] = useState<any>([]);

  // 业务流程id
  const [businessFlowId, setBusinessFlowId] = useState<any>(localBusinessFlowId);

  // 画布类型
  const [drawType, setDrawType] = useState<any>('');

  // 全局变量
  const getGlobalValConfig = async (id: any) => {
    if (!id) {
      console.log('机器人的全局变量配置获取不到机器人id');
      return null;
    }
    let res: any = await queryGlobalValConfig({ robotId: id, configType: 1 });
    let data: any[] = res?.data?.list || [];

    data = data?.map((item: any, index: number) => {
      return {
        index,
        id: item.id,
        name: item.configKey,
        label: item.configName,
        desc: item.configDesc,
        type: item.dataType,
      };
    });

    setGlobalVarList(data);
  };

  // 音频播放相关
  const voiceListener = useRef<any>({
    listeners: [],
  });

  const addListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;
    if (val && listeners.indexOf(val) === -1) {
      listeners.push(val);
    }
  };

  const removeListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;
    const index = listeners.indexOf(val);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  const stopOtherListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;

    listeners.forEach((obj: any) => {
      // 循环调用暂停
      if (obj !== val) {
        obj?.pause?.();
      }
    });
  };

  return {
    info, // 机器人信息
    setInfo,
    businessFlowId, // 流程画布
    setBusinessFlowId,
    globalVarList, // 全局变量列表
    getGlobalValConfig,
    drawType, // 画布类型
    setDrawType,
    // ------
    addListener,
    removeListener,
    stopOtherListener,
  };
}
