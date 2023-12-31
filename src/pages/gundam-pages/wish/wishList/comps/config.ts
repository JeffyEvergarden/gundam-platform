export const operateFormList = [
  {
    label: '意图名称',
    name: 'intentName',
    type: 'input',
    placeholder: '请输入意图名称',
    rules: [
      { required: true, message: '请输入意图名称' },
      //   { trigger: 'blur' },
      // { pattern: '/[^a-zA-Z0-9\u4E00-\u9FA5_-]/' },
      {
        pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
        message: '请输入汉字、字母、下划线、数字、横杠',
      },
      { max: 150, min: 1 },
    ],
  },
  {
    label: '澄清名称',
    name: 'inquiryText',
    type: 'input',
    placeholder: '请输入澄清名称',
    rules: [
      { required: true, message: '请输入澄清名称' },
      { max: 200, min: 1 },
    ],
  },
  {
    label: '意图类型',
    name: 'headIntent',
    type: 'radio',
    rules: [{ required: true, message: '请选择意图类型' }],
  },
  {
    label: '是否联想',
    name: 'suggest',
    type: 'radio2',
  },
  {
    label: '是否澄清',
    name: 'clarify',
    type: 'radio2',
    show: true,
  },
  {
    label: '描述',
    name: 'intentDesc',
    type: 'input',
    placeholder: '请输入描述',
    rules: [{ required: false }, { max: 200, min: 0 }],
  },
];

export const tableList: any = [
  {
    dataIndex: 'intentName',
    title: '意图名称',
    search: true,
    ellipsis: true,
    fixed: 'left',
    width: 200,
  },
  {
    dataIndex: 'headIntent',
    title: '意图类型',
    search: true,
    ellipsis: true,
    width: 100,
    initialValue: '',
    valueEnum: {
      0: { text: '头部意图', status: 0 },
      1: { text: '辅助意图', status: 1 },
    },
  },
  {
    dataIndex: 'inquiryText',
    title: '澄清名称',
    search: false,
    ellipsis: true,
    width: 200,
  },
  {
    dataIndex: 'suggest',
    title: '是否联想',
    search: false,
    ellipsis: true,
    width: 100,
    initialValue: '',
    valueEnum: {
      0: { text: '否', status: 0 },
      1: { text: '是', status: 1 },
    },
  },
  {
    dataIndex: 'clarify',
    title: '是否澄清',
    search: false,
    ellipsis: true,
    width: 100,
    initialValue: '',
    valueEnum: {
      0: { text: '否', status: 0 },
      1: { text: '是', status: 1 },
    },
  },
  // {
  //   dataIndex: 'headIntent',
  //   title: '是否头部意图',
  //   search: true,
  //   valueType: 'select',
  //   width: 160,
  //   valueEnum: {
  //     0: { text: '是', status: 0 },
  //     1: { text: '否', status: 1 },
  //     '': { text: '全部', status: '' },
  //   },
  // },
  {
    dataIndex: 'flowInfoName',
    title: '业务流程',
    search: false,
    ellipsis: true,
    width: 220,
  },
  {
    dataIndex: 'intentDesc',
    title: '描述',
    search: false,
    ellipsis: true,
    width: 260,
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
    ellipsis: true,
    width: 120,
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    search: false,
    ellipsis: true,
    width: 120,
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
        content: '[词槽1]',
        number: 2,
      },
    ],
  },
  {
    id: '001',
    intentName: '2',
    intentDesc: '2',
    content: '2',
    sequence: '2',
    match: '2',
    ruleClips: [
      {
        matched: '1',
        content: '[特征词1]',
        number: 1,
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
