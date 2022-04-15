export const wordSlotTableList: any = [
  {
    dataIndex: 'slotName',
    title: '名称',
    fixed: 'left',
  },
  {
    dataIndex: 'slotDesc',
    title: '描述',
  },
  {
    dataIndex: 'slotSource',
    title: '来源',
    valueEnum: {
      // 0: { text: '来自实体', status: 0 },
      1: { text: '来自意图', status: 1 },
      // 2: { text: '用户文本', status: 2 },
      // 3: { text: '规则模版', status: 3 },
      // 4: { text: '正则', status: 4 },
      // 5: { text: '函数返回值', status: 5 },
      // 6: { text: '全局变量', status: 6 },
      // 7: { text: '接口', status: 7 },
      // 8: { text: '业务参数', status: 8 },
    },
  },
  // {
  //   dataIndex: 'nodeName',
  //   title: '所属节点',
  // },
  {
    dataIndex: 'number',
    title: '应用次数',
  },
  // {
  //   dataIndex: 'entity',
  //   title: '引用实体',
  // },
  {
    dataIndex: 'creator',
    title: '更新人',
  },
  {
    dataIndex: 'createTime',
    title: '更新时间',
  },
];

export const operateSlotFormList = [
  {
    name: 'slotName',
    label: '名称',
    type: 'input',
    placeholder: '请输入名称',
    rules: [
      { required: true, message: '请输入名称' },
      { max: 50, min: 1 },
      {
        pattern: /^[A-Za-z_\-]+$/g,
        message: '只支持英文，_和-',
      },
    ],
  },
  {
    name: 'slotDesc',
    label: '描述',
    type: 'input',
    placeholder: '请输入描述',
    rules: [{ required: false }, { max: 200, min: 0 }],
  },
  {
    name: 'slotSource',
    label: '槽值来源',
    type: 'select',
    placeholder: '请选择槽值来源',
    rules: [{ required: true }],
  },
  {
    name: 'allowIntents',
    label: '允许来源意图',
    type: 'multiSelect',
    placeholder: '请选择允许来源意图',
    rules: [{ required: false }],
  },
  {
    name: 'nonIntents',
    label: '禁止来源意图',
    type: 'multiSelect',
    placeholder: '请选择禁止来源意图',
    rules: [{ required: false }],
  },
];

export const slotSourceFormList = [
  // {
  //   value: 0,
  //   name: '来自实体',
  // },
  {
    value: 1,
    name: '来自意图',
  },
  // {
  //   value: 2,
  //   name: '用户文本',
  // },
  // {
  //   value: 3,
  //   name: '规则模版',
  // },
  // {
  //   value: 4,
  //   name: '正则',
  // },
  // {
  //   value: 5,
  //   name: '函数返回值',
  // },
  // {
  //   value: 6,
  //   name: '全局变量',
  // },
  // {
  //   value: 7,
  //   name: '接口',
  // },
  // {
  //   value: 8,
  //   name: '业务参数',
  // },
];
