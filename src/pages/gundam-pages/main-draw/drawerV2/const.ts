export const ACTION_LIST: any = [
  {
    name: 1,
    label: '系统挂机',
  },
  {
    name: 2,
    label: '转业务流程',
  },
  {
    name: 3,
    label: '转人工服务流程',
  },
];

// 普通规则
export const RUlE_LIST: any[] = [
  {
    name: 0,
    label: '意图名称',
    list: [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!=',
        label: '不等于',
      },
      {
        name: 'include',
        label: '包含',
      },
      {
        name: 'uninclude',
        label: '不包含',
      },
    ],
  },
  {
    name: 2,
    label: '输入文本',
    list: [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!==',
        label: '不等于',
      },
      {
        name: 'like',
        label: '包含',
      },
      {
        name: 'unlike',
        label: '不包含',
      },
    ],
  },
  {
    name: 1,
    label: '词槽',
    list: [
      {
        name: 'fill',
        label: '已填充', // 没有后续输入
      },
      {
        name: 'unfill',
        label: '未填充', // 没有后续输入
      },
    ],
  },
  {
    name: 4,
    label: '变量',
    list: [],
  },
];

// 线规则
export const EDGE_RULE_LIST: any[] = [
  {
    name: 5,
    label: '高级配置变量',
    list: [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '<',
        label: '小于',
      },
      {
        name: '<=',
        label: '小于等于',
      },
      {
        name: '>',
        label: '大于',
      },
      {
        name: '>=',
        label: '大于等于',
      },
    ],
  },
];

// 高级配置（连线下拉）
export const EDGE_VAR_LIST: any[] = [
  {
    name: '静默次数',
    label: '静默次数',
  },
  {
    name: '拒识次数',
    label: '拒识次数',
  },
  {
    name: '未听清次数',
    label: '未听清次数',
  },
];

// 一级筛选映射
export const selectMap = {
  意图名称: 0,
  词槽: 1,
  输入文本: 2,
  变量: 4,
  高级配置变量: 5,
};

// 四级筛选映射
export const VALUE_TYPE_MAP = {
  变量: 1,
  词槽: 2,
  自定义: 3,
};

// 四级筛选下拉
export const VALUE_TYPE_LIST = [
  {
    name: 1,
    label: '变量',
  },
  {
    name: 2,
    label: '词槽',
  },
  {
    name: 3,
    label: '自定义',
  },
];

// 条件过滤
export const conditionFilter = (valueType: any) => {
  let list: any[] = [];
  if (valueType === 'number' || valueType === 'date') {
    list = [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!==',
        label: '不等于',
      },
      {
        name: '<',
        label: '小于',
      },
      {
        name: '<=',
        label: '小于等于',
      },
      {
        name: '>',
        label: '大于',
      },
      {
        name: '>=',
        label: '大于等于',
      },
    ];
  } else if (valueType === 'text') {
    list = [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!==',
        label: '不等于',
      },
      {
        name: 'like',
        label: '包含',
      },
      {
        name: 'unlike',
        label: '不包含',
      },
    ];
  }
  return list;
};
