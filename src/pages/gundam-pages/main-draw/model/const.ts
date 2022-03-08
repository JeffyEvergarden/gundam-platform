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
  size: '140*45',
  _nodetype: 'business',
  type: 'node',
  style: {
    lineWidth: 1,
    stroke: '#f90',
    strokeOpacity: 1,
  },
};

const map: any = {
  0: 'normal',
  1: 'business',
  2: 'start',
};

const typeMap: any = {
  normal: 0,
  business: 1,
  start: 2,
};

export const parserType = (val: number) => {
  return map[val] || 'normal';
};

export const processType = (type: string) => {
  return typeMap[type] || 0;
};
