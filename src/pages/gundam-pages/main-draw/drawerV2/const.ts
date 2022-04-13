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
    name: 4,
    label: '变量',
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

export const selectMap = {
  意图名称: 0,
  词槽: 1,
  输入文本: 2,
  变量: 4,
  高级配置变量: 5,
};
