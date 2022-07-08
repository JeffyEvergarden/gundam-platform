import { CHANNAL_LIST } from '../../FAQ/const';

export const HIGH_CONFIG_SELECT = [
  {
    name: 'channelList',
    label: '渠道',
    type: 'single',
    children: [
      {
        name: 'all',
        label: '全部',
      },
      ...CHANNAL_LIST.map((item) => {
        return {
          name: item.value,
          ...item,
        };
      }),
    ],
  },
  {
    name: 'orderType',
    label: '排序',
    type: 'single',
    children: [
      {
        name: 1,
        label: '时间倒序',
      },
      {
        name: 2,
        label: '时间正序',
      },
      {
        name: 3,
        label: '浏览量正序',
      },
      {
        name: 4,
        label: '浏览量倒序',
      },
      {
        name: 5,
        label: '满意倒序',
      },
      {
        name: 6,
        label: '满意正序',
      },
      {
        name: 7,
        label: '不满意倒序',
      },
      {
        name: 8,
        label: '不满意正序',
      },
    ],
  },
  {
    name: 'creatorList',
    label: '创建人',
    type: 'multi',
    children: [
      {
        name: null,
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
