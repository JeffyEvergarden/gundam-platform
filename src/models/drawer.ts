import { useState, useRef } from 'react';
import {
  queryLabelList,
  queryFlowList,
  queryMessageList,
  queryWordSlotTableList,
  queryWishList,
  queryNodeConfig,
} from '@/services/api';
import config from '@/config';

export default function useGundamModel() {
  const timeFc = useRef<any>({});

  const [_wishList, _setWishList] = useState<any>([]); // 意图列表

  const [_globalNodeList, _setGlobalNodeList] = useState<any>([]); // 机器人的全局节点
  // 业务流程列表
  const [_globalVarList, _setGlobalVarList] = useState<any>([]); // 机器人的全局变量

  const [_labelList, _setLabelList] = useState<any>([]); // 机器人的话术标签列表

  const [_flowList, _setFlowList] = useState<any[]>([]); // 业务流程列表

  const [_wordSlotList, _setWordSlotList] = useState<any[]>([]); // 词槽列表

  const [_messageList, _setMessageList] = useState<any[]>([]); // 信息列表

  const allowRequest = (str: any) => {
    const timeObj: any = timeFc.current;
    const _time = timeObj[str];
    let now = Date.now();
    if (!_time) {
      // 没有调过该接口
      timeObj[str] = now;
      return true;
    }
    // 15秒内不允许重新调
    if (_time && now - _time > 15 * 1000) {
      timeObj[str] = now;
      return true;
    }
    return false;
  };

  const getMessageList = async (id: any) => {
    if (!allowRequest('message')) {
      return;
    }
    let res: any = await queryMessageList({
      robotId: id,
      page: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.data?.list?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.templateId,
          label: item.templateTime,
          placeholder: item.placeholder,
          content: item.content,
        };
      }) || [];
    _setMessageList(data);
  };

  const getWishList = async (id?: any) => {
    if (!allowRequest('wish')) {
      return;
    }
    let res: any = await queryWishList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let data: any[] = res?.data?.list || res?.datas?.list || [];
    data = Array.isArray(data) ? data : [];
    data =
      data.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.intentName,
          intentName: item.intentName,
        };
      }) || [];
    _setWishList(data);
  };

  const getWordSlotList = async (id?: any) => {
    if (!allowRequest('wordslot')) {
      return;
    }
    let res: any = await queryWordSlotTableList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let data: any[] = res?.data?.list || [];
    data = Array.isArray(data) ? data : [];
    data =
      data.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.slotName,
          type: item.dataType,
          intentName: item.slotName,
        };
      }) || [];
    _setWordSlotList(data);
  };

  // 获取流程列表
  const getFlowList = async (id?: any) => {
    if (!allowRequest('flow')) {
      return;
    }
    let res: any = await queryFlowList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.data?.list.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.flowName,
        };
      }) || [];
    _setFlowList(data);
  };

  const getLabelList = async (id?: any) => {
    if (!allowRequest('label')) {
      return;
    }
    if (!id) {
      console.log('机器人的话术标签获取不到机器人id');
      return null;
    }
    let res: any = await queryLabelList({ robotId: id });
    let data: any[] = res?.data?.list || [];
    _setLabelList(data);
  };
  //高级配置信息
  const getGlobalConfig = async (id?: any) => {
    if (!id) {
      console.log('机器人的高级配置获取不到机器人id');
      return null;
    }
    let res: any = await queryNodeConfig({ robotId: id });
    let data: any[] = res?.data || {};
    console.log(data);

    _setGlobalNodeList(data);
  };

  return {
    _wishList,
    _setWishList,
    _globalNodeList,
    _setGlobalNodeList,
    _labelList,
    _setLabelList,
    _flowList,
    _setFlowList,
    _wordSlotList,
    _setWordSlotList,
    _messageList,
    _setMessageList,
    getMessageList, // 短信模版
    getWishList, // 意图
    getWordSlotList, // 词槽
    getFlowList, // 业务流程
    getLabelList, // 话术标签
    getGlobalConfig, //高级配置 节点
  };
}
