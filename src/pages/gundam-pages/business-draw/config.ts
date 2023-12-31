export const businessTableColumnsList: any = [
  {
    dataIndex: 'flowName',
    title: '业务流程名称',
    fixed: 'left',
  },
  {
    dataIndex: 'flowDesc',
    title: '描述',
    search: false,
  },
  {
    dataIndex: 'headIntentName',
    title: '触发意图名称',
    search: false,
  },
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

export const operateFlowFormList = [
  {
    name: 'flowName',
    label: '流程名称',
    type: 'input',
    placeholder: '请输入流程名称',
    rules: [
      { required: true, message: '请输入流程名称' },
      {
        pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
        message: '请输入汉字、字母、下划线、数字、横杠',
      },
      {
        max: 150,
        min: 1,
      },
    ],
  },
  {
    name: 'flowDesc',
    label: '流程描述',
    type: 'input',
    placeholder: '请输入流程描述',
    rules: [
      {
        max: 150,
        min: 0,
      },
    ],
  },
  {
    name: 'headIntent',
    label: '触发意图',
    type: 'select',
    placeholder: '请选择触发意图',
    rules: [{ max: 200, min: 0 }],
  },
];
