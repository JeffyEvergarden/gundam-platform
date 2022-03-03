export const ACTION_LIST: any = [
  {
    name: '否',
    label: '否',
  },
  {
    name: '转人工',
    label: '转人工',
  },
  {
    name: '转ivr',
    label: '转ivr',
  },
];

// 普通规则
export const RUlE_LIST: any[] = [
  {
    name: '用户意图',
    label: '用户意图',
    type: 'wish', // 多选 取意图列表
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
    name: '槽值填充状态',
    label: '槽值填充状态',
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
        name: '<=',
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
    name: '当前用户输入文本',
    label: '当前用户输入文本',
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
    name: '系统时间',
    label: '系统时间',
    type: 'date',
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
        name: '<=',
        label: '大于等于',
      },
    ],
  },
  {
    name: '变量',
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
        name: '<=',
        label: '大于等于',
      },
    ],
  },
];

// 线规则
export const EDGE_RULE_LIST: any[] = [
  {
    name: '高级配置变量',
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
        name: '<=',
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
