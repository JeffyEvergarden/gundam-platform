// 节点定义

export const startNode: any = {
  color: '#1890FF',
  shape: 'flow-rect',
  size: '140*45',
  _nodetype: 'start',
  type: 'node',
  label: '开始节点',
};

export const normalNode: any = {
  color: '#1890FF',
  shape: 'flow-rect',
  size: '140*45',
  _nodetype: 'normal',
  type: 'node',
};

export const businessNode: any = {
  color: '#FEB444',
  shape: 'flow-rect',
  size: '180*45',
  _nodetype: 'business',
  type: 'node',
  style: {
    lineWidth: 1,
    lineHeight: 20,
    stroke: '#f90',
    strokeOpacity: 1,
  },
};

export const spBusinessNode: any = {
  color: '#FF6065',
  shape: 'flow-rect',
  size: '140*45',
  _nodetype: 'sp_business',
  type: 'node',
  style: {
    lineWidth: 3,
    stroke: '#FF6065',
    strokeOpacity: 1,
  },
};

export const operationNode: any = {
  color: '#B7EB8F',
  shape: 'flow-rect',
  size: '140*45',
  _nodetype: 'operation',
  type: 'node',
  style: {
    lineWidth: 1,
    stroke: '#B7EB8F',
    strokeOpacity: 1,
  },
};

const map: any = {
  0: 'normal', // 普通节点
  1: 'business', // 普通的业务流程节点
  2: 'start',
  3: 'sp_business', // 特殊的业务流程节点 (不可删除)
  4: 'operation', //运算节点
  5: 'select', //选择节点
};

const typeMap: any = {
  normal: 0,
  business: 1,
  start: 2,
  sp_business: 3,
  operation: 4,
  select: 5,
};

export const parserType = (val: number) => {
  return map[val] || 'normal';
};

export const processType = (type: string) => {
  return typeMap[type] || 0;
};
