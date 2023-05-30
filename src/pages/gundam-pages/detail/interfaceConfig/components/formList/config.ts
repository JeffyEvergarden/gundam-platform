// 参数类型列表
export const ParamsTypeList = [
  {
    name: 'text',
    value: 0,
    label: '文本',
  },
  {
    name: 'number',
    value: 1,
    label: '数值',
  },
  {
    name: 'date',
    value: 2,
    label: '日期',
  },
  {
    name: 'datetime',
    value: 3,
    label: '时间',
  },
  {
    name: 'boolean',
    value: 4,
    label: '布尔值',
  },
  {
    name: 'array',
    value: 5,
    label: '数组',
  },
];

export const typeMap = {
  text: 0,
  number: 1,
  date: 2,
  datetime: 3,
  boolean: 4,
  array: 5,
  0: 'text',
  1: 'number',
  2: 'date',
  3: 'datetime',
  4: 'boolean',
  5: 'array',
};

// boolean可选
export const BooleanList = [
  {
    name: 'true',
    label: 'true',
  },
  {
    name: 'false',
    label: 'false',
  },
];

// 参数输入方式
export const ParamsWayList = [
  {
    name: 0,
    label: '用户输入',
  },
  {
    name: 1,
    label: '系统输入',
  },
];

// 系统参数值可选
export const paramValueList = [
  {
    name: '$systemDate',
    label: '系统时间',
  },
  {
    name: '$UUID36',
    label: 'UUID',
  },
];

// 是否必填
export const RequiredList = [
  {
    name: 1,
    label: '是',
  },
  {
    name: 0,
    label: '否',
  },
];
