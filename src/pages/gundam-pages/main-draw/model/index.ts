import config from '@/config/index';
import { message } from 'antd';
import { useState } from 'react';
import {
  addNode,
  deleteNode,
  getBizNodesConfig,
  getFlowList,
  getIntentList,
  getLineConfig,
  getMachineMainDraw,
  getNodesConfig,
  getWordSlotTableList,
  saveBizNode,
  saveLine,
  saveMachineMainDraw,
  saveNode,
  updateNode,
} from './api';
import {
  businessNode,
  normalNode,
  parserType,
  processType,
  spBusinessNode,
  startNode,
} from './const';

// 获取默认节点参数
const getDefaultNode = (type: string) => {
  if (type === 'start') {
    return startNode;
  } else if (type === 'business') {
    return businessNode;
  } else if (type === 'sp_business') {
    return spBusinessNode;
  }
  return normalNode;
};

export const useNodeOpsModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);

  const _addNode = async (data: any) => {
    setLoading(true);
    let res: any = await addNode(data);
    setLoading(false);
    if (res.resultCode !== config.successCode) {
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
    setInfoLoading(true);
    let getNodeWay: any = null;
    if (parserType(data.nodeType) === 'business') {
      getNodeWay = getBizNodesConfig;
    } else {
      getNodeWay = getNodesConfig;
    }
    let res: any = await getNodeWay(data);
    setInfoLoading(false);
    if (res.resultCode === config.successCode) {
      let config: any = res.data || {};
      return config;
    } else {
      message.warning('获取节点信息失败');
      return {};
    }
  };

  const _saveNode = async (data: any) => {
    let saveNodeWay: any = null;
    if (parserType(data.nodeType) === 'business') {
      saveNodeWay = saveBizNode;
    } else {
      saveNodeWay = saveNode;
    }
    let res: any = await saveNodeWay(data);
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
      let config: any = res.data || {};
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
    const _map: any = {};
    nodes = nodes.map((item: any, index: number) => {
      const type = parserType(item.nodeType);
      if (map[item.frontId]) {
        return null;
      }
      if (item.frontId) {
        map[item.frontId] = true;
      }
      _map[item.id] = item.frontId;

      let label = item.label || item.nodeName || '';

      // console.log(item);

      //初始回显
      if (item.nodeType == 1) {
        label = label
          ?.split('\n')
          ?.map((item: any) => {
            return item
              ?.split(':')
              ?.map((val: any, index: any) => {
                if (index == 1) {
                  if (val?.length > 10) {
                    val = val?.slice(0, 10) + '...';
                  } else {
                    val = val;
                  }
                }
                return val;
              })
              ?.join(':');
          })
          ?.join('\n');
        console.log(label);
      } else {
        if (label?.length > 10) {
          label = label.slice(0, 10) + '...';
        }
      }

      return {
        id: item.frontId ? String(item.frontId) : String(item.id),
        _id: item.id,
        label: label,
        _name: item.label || item.nodeName || '',
        x: typeof item.x === 'number' ? item.x : 100,
        y: typeof item.y === 'number' ? item.y : 100,
        _nodetype: type, // 节点类型
        ...getDefaultNode(type),
      };
    });
    nodes = nodes.filter((item: any) => {
      return item;
    });
    const edgeMap: any = {};
    edges = edges
      .map((item: any, index: number) => {
        item.frontSource = item.frontSource || _map[item.id] || '';
        item.frontTarget = item.frontTarget || _map[item.id] || '';
        let label: string = item.frontSource + '_' + item.frontTarget;
        if (edgeMap[label]) {
          return null;
        } else {
          edgeMap[label] = true;
        }
        return item;
      })
      .filter((item: any, index: number) => {
        return item && map[item.frontSource] && map[item.frontTarget];
      })
      .map((item: any, index: number) => {
        let label = item.label || item.lineName || item.nodeName || item.name || '';
        let level = isNaN(item.priority) ? 1 : Number(item.priority);
        let _label;
        if (label.length > 10) {
          _label = label.slice(0, 10) + '...';
        }
        _label = `${level ? level + '.' : ''}${_label || label}`;

        return {
          id: item.frontId ? String(item.frontId) : String(item.id),
          _id: item.id,
          label: _label,
          _name: label,
          level: level,
          source: item.frontSource, // 后端的头id
          target: item.frontTarget, // 后端的尾id
          sourceAnchor: isNaN(item.sourceAnchor) ? 1 : Number(item.sourceAnchor), // 前锥点
          targetAnchor: isNaN(item.targetAnchor) ? 3 : Number(item.targetAnchor), // 尾锥点
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
      let data: any = res?.data || {};
      return parser(data);
    } else {
      message.error('获取不到画布信息');
      return {};
    }
  };

  // 加工画布参数
  const process = (obj: any) => {
    let { nodes = [], edges = [], ...preParams }: any = obj;
    console.log(nodes);

    nodes = nodes.map((item: any) => {
      return {
        nodeType: processType(item._nodetype), // 节点类型
        frontId: item.id, // 前端id
        nodeName: item._name || item.label,
        id: item._id, // 后端id
        x: item.x,
        y: item.y,
      };
    });
    edges = edges.map((item: any) => {
      return {
        frontId: item.id, // 前端id
        id: item._id, // 后端id (如果有的话)
        lineName: item._name || item.label || '',
        name: item._name || item.label || '',
        priority: item.level || 1,
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
      message.error(res.resultDesc || '未知系统异常');
      return false;
    }
  };

  return {
    loading,
    infoLoading,
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
    });
    let data: any[] = res?.data || res?.datas;
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
    setWishList(data);
  };

  const _getWordSlotList = async (id?: any) => {
    let res: any = await getWordSlotTableList({
      robotId: id,
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
          type: item.dataType,
          intentName: item.slotName,
        };
      }) || [];
    setWordSlotList(data);
  };

  // 获取流程列表
  const _getFlowList = async (id?: any) => {
    let res: any = await getFlowList({
      robotId: id,
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
