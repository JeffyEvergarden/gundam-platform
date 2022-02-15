export const searchFormList = [
  {
    label: '意图名称',
    name: 'intentName',
    type: 'input',
  },
  {
    label: '是否头部意图',
    name: 'headIntent',
    type: 'select',
  },
];

export const operateFormList = [
  {
    label: '意图名称',
    name: 'intentName',
    type: 'input',
    rules: [
      { required: true, message: '请输入意图名称' },
      //   { trigger: 'blur' },
      { pattern: '/[^a-zA-Z0-9\u4E00-\u9FA5_-]/' },
      { max: 150, min: 1 },
    ],
  },
  {
    label: '澄清名称',
    name: 'inquiryText',
    type: 'input',
    rules: [
      { required: true, message: '请输入澄清名称' },
      { max: 200, min: 1 },
    ],
  },
  {
    label: '是否头部意图',
    name: 'headIntent',
    type: 'radio',
    rules: [{ required: true, message: '请选择是否头部意图' }],
  },
  {
    label: '描述',
    name: 'intentDesc',
    type: 'input',
    rules: [{ required: false }, { max: 200, min: 0 }],
  },
];

export const tableList = [
  {
    dataIndex: 'intentName',
    title: '意图名称',
  },
  {
    dataIndex: 'inquiryText',
    title: '澄清名称',
  },
  {
    dataIndex: 'headIntent',
    title: '是否头部意图',
    valueEnum: {
      '0': { text: '是', status: '0' },
      '1': { text: '否', status: '1' },
    },
  },
  {
    dataIndex: 'flowName',
    title: '业务流程',
  },
  {
    dataIndex: 'intentDesc',
    title: '描述',
  },
  //   {
  //     dataIndex: 'status',
  //     title: '状态',
  //     valueEnum: {
  //       '0': { text: '成功', status: '0' },
  //       '1': { text: '失败', status: '1' },
  //     },
  //   },
  {
    dataIndex: 'creator',
    title: '创建者',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
];

export const fakeData = [
  {
    intentName: '意图1',
    id: '001',
    inquiryText: '澄清1',
    headIntent: '0',
    flowName: '业务流程1',
    intentDesc: '意图描述1',
    status: '0',
    creator: 'yyb',
    createTime: '2022-02-14',
  },
];
