export const ACTION_LIST_TEXT: any = [
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
  {
    name: 4,
    label: '转按键IVR服务',
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
      // {
      //   name: 'include',
      //   label: '包含',
      // },
      // {
      //   name: 'uninclude',
      //   label: '不包含',
      // },
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
        name: '!=',
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
      {
        name: 'reg',
        label: '符合正则',
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
      {
        name: 'lengthGreater',
        label: '长度大于',
      },
      {
        name: 'lengthEqual',
        label: '长度等于',
      },
      {
        name: 'lengthLess',
        label: '长度小于',
      },
    ],
  },
  {
    name: 4,
    label: '变量',
    list: [
      {
        name: 'fill',
        label: '已填充', // 没有后续输入
      },
      {
        name: 'unfill',
        label: '未填充', // 没有后续输入
      },
      {
        name: 'lengthGreater',
        label: '长度大于',
      },
      {
        name: 'lengthEqual',
        label: '长度等于',
      },
      {
        name: 'lengthLess',
        label: '长度小于',
      },
    ],
  },
  {
    name: 6,
    label: '自定义',
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
        name: 'like',
        label: '包含',
      },
      {
        name: 'unlike',
        label: '不包含',
      },
      {
        name: 'reg',
        label: '符合正则',
      },
      {
        name: 'lengthGreater',
        label: '长度大于',
      },
      {
        name: 'lengthEqual',
        label: '长度等于',
      },
      {
        name: 'lengthLess',
        label: '长度小于',
      },
    ],
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
        name: '>',
        label: '大于',
      },
    ],
  },
];

// 高级配置（连线下拉）
export const EDGE_VAR_LIST: any[] = [
  {
    name: '1',
    label: '静默次数',
  },
  {
    name: '2',
    label: '拒识次数',
  },
  {
    name: '3',
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
  自定义: 6,
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

//
export const RULE_KEY_TYPE_MAP = {
  text: 0,
  number: 1,
  date: 2,
  time: 3,
  array: 5,
};

// 条件过滤
export const conditionFilter = (valueType: any) => {
  let list: any[] = [];
  if (
    valueType === RULE_KEY_TYPE_MAP['number'] ||
    valueType === RULE_KEY_TYPE_MAP['date'] ||
    valueType === RULE_KEY_TYPE_MAP['time']
  ) {
    list = [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!=',
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
    // if (valueType === RULE_KEY_TYPE_MAP['date']) {
    //   list.push({
    //     name: 'between',
    //     label: '介于',
    //   });
    // }
  } else if (valueType === RULE_KEY_TYPE_MAP['text']) {
    list = [
      {
        name: '==',
        label: '等于',
      },
      {
        name: '!=',
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

export const wordSlotSourceMap = {
  0: '枚举实体',
  1: '意图',
  2: '用户文本',
  3: '规则模版',
  4: '正则实体',
  5: '函数返回值',
  6: '全局变量',
  7: '接口',
  8: '业务参数',
  9: '图谱',
};

export const OPERATOR_LIST = [
  {
    value: 'empty',
    label: '清空',
  },
  {
    value: '=',
    label: '赋值',
  },
  {
    value: '+',
    label: '计算-加',
  },
  {
    value: '-',
    label: '计算-减',
  },
  {
    value: '*',
    label: '计算-乘',
  },
  {
    value: '/',
    label: '计算-除',
  },
];
