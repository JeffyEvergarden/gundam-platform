export const HIGH_CONFIG_SELECT = [
  {
    name: 'channel',
    label: '渠道',
    type: 'single',
    children: [
      {
        name: 'all',
        label: '全部',
      },
      {
        name: 'wechat',
        label: '微信',
      },
      {
        name: 'app',
        label: 'APP',
      },
      {
        name: 'alipay',
        label: '支付宝',
      },
      {
        name: 'zsyh',
        label: '招商银行',
      },
      {
        name: 'jtyw',
        label: '集团邮务',
      },
      {
        name: 'zygw',
        label: '中邮官网',
      },
      {
        name: 'ycsjyh',
        label: '邮储手机银行',
      },
    ],
  },
  {
    name: 'status',
    label: '状态',
    type: 'single',
    children: [
      {
        name: 0,
        label: '全部',
      },
      {
        name: 1,
        label: '发布',
      },
      {
        name: 2,
        label: '等待审核',
      },
      {
        name: 3,
        label: '过期',
      },
      {
        name: 4,
        label: '被退回',
      },
      {
        name: 5,
        label: '等待生效',
      },
    ],
  },
  {
    name: 'sort',
    label: '排序',
    type: 'single',
    children: [
      {
        name: 0,
        label: '默认',
      },
      {
        name: 1,
        label: '时间排序',
      },
      {
        name: 2,
        label: '时间倒序',
      },
    ],
  },
  {
    name: 'creator',
    label: '创建人',
    type: 'multi',
    children: [
      {
        name: 0,
        label: '全部',
      },
      {
        name: '爱德华',
        label: '爱德华乔邦尼斯',
      },
      {
        name: '霍华德',
        label: '霍华德尼克斯',
      },
      {
        name: '布拉杰.杰特',
        label: '布拉杰.杰特',
      },
      {
        name: '杰兰特',
        label: '杰兰特',
      },
    ],
  },
];
