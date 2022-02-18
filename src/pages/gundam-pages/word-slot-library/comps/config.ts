export const wordSlotTableList = [
  {
    dataIndex: 'slotName',
    title: '词槽名称',
  },
  {
    dataIndex: 'slotDesc',
    title: '描述',
  },
  {
    dataIndex: 'slotSource',
    title: '词槽来源',
    valueEnum: {
      '0': { text: '来自实体', status: '0' },
      '1': { text: '来自意图', status: '1' },
      '2': { text: '来自接口', status: '2' },
      '3': { text: '来自用户文本', status: '3' },
    },
  },
  {
    dataIndex: 'flowName',
    title: '所属业务流程',
  },
  {
    dataIndex: 'entity',
    title: '引用实体',
  },
  {
    dataIndex: 'creator',
    title: '创建者',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
];

export const soltTableFakeData = [
  {
    id: '011',
    slotName: '123',
    slotDesc: '1',
    slotSource: '0',
    flowName: '1',
    entity: '0',
    creator: 'yyb',
    createTime: '2022-02-16',
  },
  {
    id: '012',
    slotName: '110',
    slotDesc: '1',
    slotSource: '3',
    flowName: '1',
    entity: '0',
    creator: 'yyb',
    createTime: '2022-02-16',
  },
  {
    id: '013',
    slotName: '120',
    slotDesc: '描述',
    slotSource: '1',
    flowName: '1',
    entity: '0',
    creator: 'yyb',
    createTime: '2022-02-16',
  },
  {
    id: '014',
    slotName: '999',
    slotDesc: '描述',
    slotSource: '2',
    flowName: '1',
    entity: '0',
    creator: 'yyb',
    createTime: '2022-02-16',
  },
];

export const operateSlotFormList = [
  {
    name: 'slotName',
    label: '名称',
    type: 'input',
    placeholder: '请输入名称',
    rules: [{ required: true }],
  },
  {
    name: 'slotDesc',
    label: '描述',
    type: 'input',
    placeholder: '请输入描述',
    rules: [{ required: true }],
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
    type: 'select',
    placeholder: '请选择允许来源意图',
    rules: [{ required: false }],
  },
  {
    name: 'nonIntents',
    label: '禁止来源意图',
    type: 'selct',
    placeholder: '请选择禁止来源意图',
    rules: [{ required: false }],
  },
];
