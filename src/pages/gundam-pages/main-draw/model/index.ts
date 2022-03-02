import { useState } from 'react';
import { message } from 'antd';
import config from '@/config';
import { normalNode, startNode, businessNode, parserType, processType } from './const';
import {
  addNode,
  deleteNode,
  updateNode,
  getMachineMainDraw,
  getIntentList,
  getWordSlotTableList,
  getFlowList,
  saveMachineMainDraw,
  getNodesConfig,
  saveNode,
  saveLine,
  getLineConfig,
} from './api';

// 获取默认节点参数
const getDefaultNode = (type: string) => {
  if (type === 'start') {
    return startNode;
  } else if (type === 'business') {
    return businessNode;
  }
  return normalNode;
};

export const useNodeOpsModel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const _addNode = async (data: any) => {
    setLoading(true);
    let res: any = await addNode(data);
    setLoading(false);
    if (res.resultCode !== config.successCode) {
      message.success('更新成功');
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      return res;
    }
  };

  const _updateNode = async (data: any) => {
    setLoading(true);
    let res: any = await updateNode(data);
    setLoading(false);
    if (res.resultCode !== config.successCode) {
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      message.success('更新成功');
      return res;
    }
  };

  const _deleteNode = async (data: any) => {
    setLoading(true);
    let res: any = await deleteNode(data);
    setLoading(false);
    if (res.resultCode !== config.successCode) {
      message.warning(res.resultDesc || '未知系统异常');
      return false;
    } else {
      return true;
    }
  };

  // 获取节点信息
  const _getNodesConfig = async (data: any) => {
    let res: any = await getNodesConfig(data);
    if (res.resultCode === config.successCode) {
      let config: any = res.datas || {};
      return config;
    } else {
      message.warning('获取节点信息失败');
      return {};
    }
  };

  const _saveNode = async (data: any) => {
    let res: any = await saveNode(data);
    if (res.resultCode === config.successCode) {
      message.success('保存成功');
      return true;
    } else {
      message.warning(res.resultDesc || '保存失败');
      return false;
    }
  };

  const _getLineConfig = async (data: any) => {
    let res: any = await getLineConfig(data);
    if (res.resultCode === config.successCode) {
      let config: any = res.datas || {};
      return config;
    } else {
      message.warning('获取节点信息失败');
      return {};
    }
  };

  const _saveLine = async (data: any) => {
    let res: any = await saveLine(data);
    if (res.resultCode === config.successCode) {
      message.success('保存成功');
      return res;
    } else {
      message.warning(res.resultDesc || '保存失败');
      return false;
    }
  };

  // 解析画布参数
  const parser = (data: any) => {
    let { nodes = [], edges = [] }: any = data;
    const map: any = {};
    nodes = nodes.map((item: any, index: number) => {
      const type = parserType(item.nodeType);
      if (item.frontId) {
        map[item.frontId] = true;
      }
      return {
        id: String(item.frontId),
        _id: item.id,
        label: item.label || item.nodeName || '',
        x: item.x,
        y: item.y,
        _nodetype: type, // 节点类型
        ...getDefaultNode(type),
      };
    });
    edges = edges
      .filter((item: any, index: number) => {
        return map[item.frontSource] && map[item.frontTarget];
      })
      .map((item: any, index: number) => {
        return {
          id: String(item.frontId),
          _id: item.id,
          label: item.label || item.nodeName || item.name || '',
          source: item.frontSource, // 后端的头id
          target: item.frontTarget, // 后端的尾id
          sourceAnchor: item.sourceAnchor, // 前锥点
          targetAnchor: item.targetAnchor, // 尾锥点
          _source: item.source, // 后端的头id
          _target: item.target, // 后端的尾id
        };
      });
    return {
      nodes,
      edges,
    };
  };

  const _getMachineMainDraw = async (data: any) => {
    let res: any = await getMachineMainDraw(data);
    if (res.resultCode === config.successCode) {
      let data: any = res?.datas || {};
      return parser(data);
    } else {
      message.error('获取不到画布信息');
      return {};
    }
  };

  // 加工画布参数
  const process = (obj: any) => {
    let { nodes = [], edges = [], ...preParams }: any = obj;
    nodes = nodes.map((item: any) => {
      return {
        nodeType: processType(item._nodetype), // 节点类型
        frontId: item.id, // 前端id
        nodeName: item.label,
        id: item._id, // 后端id
        x: item.x,
        y: item.y,
      };
    });
    edges = edges.map((item: any) => {
      return {
        frontId: item.id, // 前端id
        id: item._id, // 后端id (如果有的话)
        nodeName: item.label,
        name: item.label,
        frontSource: item.source, // 前端的头id
        frontTarget: item.target, // 前端的尾id
        sourceAnchor: item.sourceAnchor, // 前锥点
        targetAnchor: item.targetAnchor, // 尾锥点
        source: item._source, // 后端的头id
        target: item._target, // 后端的尾id
      };
    });
    return {
      nodes: nodes,
      edges: edges,
      ...preParams,
    };
  };

  const saveDraw = async (obj: any) => {
    let data: any = process(obj); // 加工参数
    let res: any = await saveMachineMainDraw(data);
    if (res.resultCode === config.successCode) {
      message.success('保存成功');
      return true;
    } else {
      message.error(message.warning(res.resultDesc || '未知系统异常'));
      return false;
    }
  };

  return {
    loading,
    addNode: _addNode, // 添加节点
    updateNode: _updateNode, // 修改节点
    deleteNode: _deleteNode, // 删除节点
    getMachineMainDraw: _getMachineMainDraw, //获取画布
    saveDraw, // 保存画布
    getNodesConfig: _getNodesConfig, // 获取节点配置
    getLineConfig: _getLineConfig, // 获取线配置
    saveNode: _saveNode, // 保存节点配置
    saveLine: _saveLine, // 保存线配置
  };
};

export const useSelectModel = () => {
  const [wishList, setWishList] = useState<any[]>([]); // 意图列表

  const [wordSlotList, setWordSlotList] = useState<any[]>([]); // 词槽列表

  const [flowList, setFlowList] = useState<any[]>([]); // 业务流程列表

  // 获取意图列表
  const _getWishList = async (id?: any) => {
    let res: any = await getIntentList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let data: any[] = res?.data || res?.datas;
    data = Array.isArray(data) ? data : [];
    data =
      data.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          intentName: item.intentName,
        };
      }) || [];
    setWishList(data);
  };

  const _getWordSlotList = async (id?: any) => {
    let res: any = await getWordSlotTableList({
      robotId: id,
      current: 1,
      pageSize: 1000,
    });
    let data: any[] = res?.data || res?.datas;
    data = Array.isArray(data) ? data : [];
    data =
      data.map?.((item: any, index: number) => {
        return {
          ...item,
          index,
          name: item.id,
          label: item.slotName,
          intentName: item.slotName,
        };
      }) || [];
    setWordSlotList(data);
  };

  // 获取流程列表
  const _getFlowList = async (id?: any) => {
    let res: any = await getFlowList({
      robotId: id,
      current: 1,
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
    flowList,
    wishList,
    wordSlotList,
    getWishList: _getWishList,
    getWordSlotList: _getWordSlotList,
    getFlowList: _getFlowList,
  };
};
