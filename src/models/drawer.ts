import { useState, useRef } from 'react';
import {
  queryLabelList,
  queryFlowList,
  queryMessageList,
  queryWordSlotTableList,
  queryWishList,
  queryNodeConfig,
} from '@/services/api';
import config from '@/config/index';

export default function useGundamModel() {
  const timeFc = useRef<any>({});

  const idFc = useRef<any>({});

  const selectBody = useRef<any>({});

  const [_wishList, _setWishList] = useState<any>([]); // 意图列表

  const [_globalNodeList, _setGlobalNodeList] = useState<any>([]); // 机器人的全局节点
  // 业务流程列表
  const [_globalVarList, _setGlobalVarList] = useState<any>([]); // 机器人的全局变量

  const [_labelList, _setLabelList] = useState<any>([]); // 机器人的话术标签列表

  const [_flowList, _setFlowList] = useState<any[]>([]); // 过滤后业务流程列表

  const [_originFlowList, _setOriginFlowList] = useState<any[]>([]); // 原业务流程列表

  const [_wordSlotList, _setWordSlotList] = useState<any[]>([]); // 词槽列表

  const [_messageList, _setMessageList] = useState<any[]>([]); // 信息列表

  const allowRequest = (str: any, id?: any, t?: number) => {
    if (id) {
      const idFcObj = idFc.current;
      const _idFc: any = idFcObj[str];
      if (_idFc !== id) {
        // 如果查询id 不等于上次查询id
        idFcObj[str] = id; // 进行记录
        return true; // 可以查询
      }
    }

    const timeObj: any = timeFc.current;
    const _time = timeObj[str];
    let now = Date.now();
    if (!_time) {
      // 没有调过该接口
      timeObj[str] = now;
      return true;
    }
    // 15秒内不允许重新调
    if (_time && now - _time > (t ? t : 15) * 1000) {
      timeObj[str] = now;
      return true;
    }
    return false;
  };

  const getMessageList = async (id: any) => {
    if (!allowRequest('message', id)) {
      return;
    }
    let res: any = await queryMessageList({
      robotId: id,
      pushType: 'sms',
      page: 1,
      pageSize: 1000,
    });
    let data: any[] =
      res?.data?.list?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.templateId,
          label: item.templateTitle,
          placeholder: item.placeholder,
          content: item.content,
        };
      }) || [];
    _setMessageList(data);
  };

  const getWishList = async (id?: any, forceUpDate: boolean = false) => {
    if (!forceUpDate && !allowRequest('wish', id)) {
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
    if (!allowRequest('wordslot', id)) {
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
          id: item.id,
          name: item.slot,
          label: item.slotName,
          type: item.dataType,
          intentName: item.slotName,
        };
      }) || [];
    _setWordSlotList(data);
  };

  // 获取流程列表
  const getFlowList = async (id?: any) => {
    if (!allowRequest('flow', id)) {
      return;
    }
    let res: any = await queryFlowList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let originData: any[] =
      res?.data?.list?.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.flowName,
        };
      }) || [];
    let data: any[] =
      res?.data?.list
        .filter?.((item: any) => {
          return item.flowType != 3;
        })
        .filter?.((item: any) => {
          return item.headIntent;
        })
        ?.map?.((item: any, index: number) => {
          return {
            ...item,
            index,
            name: item.id,
            label: item.flowName,
          };
        }) || [];
    console.log(data, originData);

    _setFlowList(data);
    _setOriginFlowList(originData);
  };

  const getLabelList = async (id?: any) => {
    if (!allowRequest('label', id)) {
      return;
    }
    if (!id) {
      console.log('机器人的话术标签获取不到机器人id');
      return;
    }
    let res: any = await queryLabelList({ robotId: id });
    let data: any[] = res?.data?.list || [];
    _setLabelList(data);
  };
  //高级配置信息
  const getGlobalConfig = async (id?: any) => {
    if (!allowRequest('high', id, 8)) {
      return;
    }
    if (!id) {
      console.log('机器人的高级配置获取不到机器人id');
      return;
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
    _originFlowList,
    getMessageList, // 短信模版
    getWishList, // 意图
    getWordSlotList, // 词槽
    getFlowList, // 业务流程
    getLabelList, // 话术标签
    getGlobalConfig, //高级配置 节点
    selectBody,
  };
}
