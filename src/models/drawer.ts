import { useState, useRef } from 'react';
import {
  queryLabelList,
  queryFlowList,
  queryMessageList,
  queryWordSlotTableList,
  queryWishList,
  queryNodeConfig,
  queryTreeList,
  queryCreateUser,
} from '@/services/api';
import config from '@/config/index';
import { message } from 'antd';

export default function useDrawerModel() {
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

  const [_flowListWithHand, _setFlowListWithHand] = useState<any[]>([]); // 原业务流程列表

  const [_wordSlotList, _setWordSlotList] = useState<any[]>([]); // 词槽列表

  const [_messageList, _setMessageList] = useState<any[]>([]); // 信息列表

  // faq 问题树形结构
  const [treeData, setTreeData] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);

  const allowRequest = (str: any, id?: any, t?: number) => {
    const timeObj: any = timeFc.current;
    const _time = timeObj[str]; // 上次调用时间
    let now = Date.now();

    if (id) {
      const idFcObj = idFc.current;
      const _idFc: any = idFcObj[str]; // 记录上次查询Id

      if (_idFc !== id) {
        // 如果查询id 不等于上次查询id
        idFcObj[str] = id; // 进行记录
        timeObj[str] = now;
        return true; // 可以查询
      }
    }

    if (!_time) {
      // 没有调过该接口
      timeObj[str] = now;
      console.log(str + '第一次调用');
      return true;
    }

    const s = _time && now - _time;
    console.log(str + ':' + (s / 1000).toFixed(0));
    // 15秒内不允许重新调
    if (_time && s > (t ? t : 15) * 1000) {
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
      console.log('短时间重复调用__进行中断');
      return;
    } else {
      console.log('可以调用获取flow');
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
    // 包含头部意图的
    let data: any[] =
      originData.filter?.((item: any) => {
        return item.headIntent;
      }) || [];
    let data1: any[] =
      data.filter?.((item: any) => {
        return item.flowType != 3;
      }) || [];
    _setFlowListWithHand(data);
    _setFlowList(data1);
    _setOriginFlowList(originData);
  };

  // 话术标签
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

    _setGlobalNodeList(data);
  };

  const processTreeData = (data: any[], parent?: any) => {
    if (!Array.isArray(data)) {
      return [];
    }

    let _data = data.map((item: any) => {
      let obj: any = {
        title: item?.title,
        key: item?.key,
        // parent: parent,
      };
      let children: any = processTreeData(item?.children, obj);
      obj.children = children;
      return obj;
    });
    return _data;
  };

  const getTreeData = async (id?: any) => {
    console.log('questiontree:------');
    if (!allowRequest('questiontree', id)) {
      console.log('短时间调用获取问题分类树结构_中断');
      return;
    } else {
      console.log('可以调用获取问题分类树结构');
    }
    if (!id) {
      console.log('问题分类接口获取不到机器人id');
      return;
    }
    let res: any = await queryTreeList({ robotId: id });
    if (res.resultCode === config.successCode) {
      let data: any = Array.isArray(res.data) ? res.data : [];
      // 数据加工
      let _data = processTreeData(data); // 设置了parents会造成model层报错， 这里的数据不能进行delete操作
      let root: any[] = [
        {
          title: '全部分类',
          key: '0',
          parent: undefined,
          children: _data,
        },
      ];
      setTreeData(root);
    }
  };

  const getCreateUser = async (id?: any, isRecycle?: any) => {
    let res: any = await queryCreateUser({ robotId: id, recycle: isRecycle });
    if (res.resultCode === config.successCode) {
      setUserList(['全部', ...res?.data]);
    } else {
      message.error(res.resultDesc);
    }
  };

  return {
    _wishList,
    _setWishList,
    _globalNodeList,
    _setGlobalNodeList,
    _labelList,
    _setLabelList,
    _flowList,
    _flowListWithHand,
    _setFlowList,
    _wordSlotList,
    _setWordSlotList,
    _messageList,
    _setMessageList,
    _originFlowList,
    treeData,
    userList,
    getMessageList, // 短信模版
    getWishList, // 意图
    getWordSlotList, // 词槽
    getFlowList, // 业务流程
    getLabelList, // 话术标签
    getGlobalConfig, //高级配置 节点
    getTreeData, // 获取faq问题分类树形结构
    getCreateUser,
    selectBody,
  };
}
