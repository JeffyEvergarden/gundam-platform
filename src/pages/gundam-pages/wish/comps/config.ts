import { message } from 'antd';
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

export const tableList: any = [
  {
    dataIndex: 'intentName',
    title: '意图名称',
    search: true,
  },
  {
    dataIndex: 'inquiryText',
    title: '澄清名称',
    search: false,
  },
  {
    dataIndex: 'headIntent',
    title: '是否头部意图',
    search: true,
    valueType: 'select',
    valueEnum: {
      '0': { text: '是', status: '0' },
      '1': { text: '否', status: '1' },
    },
  },
  {
    dataIndex: 'flowName',
    title: '业务流程',
    search: false,
  },
  {
    dataIndex: 'intentDesc',
    title: '描述',
    search: false,
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
    search: false,
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    search: false,
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

export const sampleRulesColumns = [
  {
    dataIndex: 'intentName',
    title: '意图',
  },
  {
    dataIndex: 'intentDesc',
    title: '描述',
  },
  {
    dataIndex: 'content',
    title: '模版内容',
  },
  {
    dataIndex: 'sequence',
    title: '模版片段顺序',
  },
  {
    dataIndex: 'match',
    title: '必须匹配',
  },
];

export const featureWordColumns = [
  {
    dataIndex: 'featureName',
    title: '特征词名称',
  },
  {
    dataIndex: 'desc',
    title: '描述',
  },
  {
    dataIndex: 'wordNumber',
    title: '词典数量值',
  },
];

export const sampleRulesFakeDatas = [
  {
    id: '000',
    intentName: '1',
    intentDesc: '1',
    content: '1',
    sequence: '1',
    match: '1',
    ruleClips: [
      {
        matched: '0',
        content: '[111]',
        number: 2,
      },
    ],
  },
];

export const ruleModalFormList = [
  {
    name: 'intentName',
    label: '意图',
    type: 'input',
    placeholder: '请输入意图名称',
    rules: [{ required: false }],
  },
  {
    name: 'threshold',
    label: '阈值',
    type: 'inputNumber',
    placeholder: '',
    rules: [{ required: false }],
  },
  {
    name: '',
    label: '',
    type: '',
    placeholder: '',
    rules: [{ required: false }],
  },
  {
    name: '',
    label: '',
    type: '',
    placeholder: '',
    rules: [{ required: false }],
  },
  {
    name: '',
    label: '',
    type: '',
    placeholder: '',
    rules: [{ required: false }],
  },
  {
    name: '',
    label: '',
    type: '',
    placeholder: '',
    rules: [{ required: false }],
  },
];

export const addFeatureFormList = [
  {
    name: 'featureName',
    label: '名称',
    type: 'input',
    placeholder: "kw_仅支持小写英文、数字与下划线'_'",
    readonly: true,
    rules: [{ required: true, message: "kw_仅支持小写英文、数字与下划线'_'" }],
  },
  {
    name: 'desc',
    label: '描述',
    type: 'input',
    placeholder: '请输入特征词描述，方便用时识别',
    readonly: false,
    rules: [{ required: false, message: '' }],
  },
  {
    name: 'wordNumber',
    label: '词典值',
    type: 'text',
    placeholder: '请输入词典值，一行一个',
    readonly: true,
    rules: [{ required: true, message: '请输入词典值' }],
  },
];

export const featureWordTableFakeData = [
  {
    featureName: '1',
    desc: '1',
    wordNumber: '1',
    id: '11',
  },
];
