import {
  BuildOutlined,
  CrownOutlined,
  DatabaseOutlined,
  FontColorsOutlined,
  LineChartOutlined,
  MessageOutlined,
  MonitorOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

export default [
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/mainDraw',
    name: '主流程配置',
  },
  {
    icon: <SettingOutlined />,
    path: '/gundamPages/detail',
    name: '全局配置',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/nodeConfig',
        name: '节点配置',
      },
      {
        path: '/gundamPages/detail/globalConfig',
        name: '全局变量配置',
      },
      {
        path: '/gundamPages/detail/interfaceConfig',
        name: '接口配置',
      },
      {
        path: '/gundamPages/detail/FAQConfig',
        name: 'FAQ配置',
        hideFn: (info: any) => {
          return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
        },
      },
    ],
  },
  {
    icon: <MonitorOutlined />,
    path: '/gundamPages/wish',
    name: '意图管理',
  },
  {
    icon: <DatabaseOutlined />,
    path: '/gundamPages/wordSlotLibrary',
    name: '词槽管理',
  },
  {
    icon: <BuildOutlined />,
    path: '/gundamPages/lexiconManage',
    name: '词库管理',
  },
  {
    icon: <FontColorsOutlined />,
    path: '/gundamPages/spokenLabel',
    name: '话术标签管理',
  },
  {
    icon: <ShareAltOutlined />,
    path: '/gundamPages/businessDraw',
    exact: true,
    _info: { fuck: true },
    name: '业务流程管理',
  },
  {
    icon: <MessageOutlined />,
    path: '/gundamPages/module',
    name: 'FAQ管理',
    hideFn: (info: any) => {
      return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
    },
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/faq',
        name: 'FAQ-标准',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/clearlist',
        name: 'FAQ-澄清',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/blacklist',
        name: 'FAQ-黑名单',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/reviewedList',
        name: '待审核',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/pendingList',
        name: '待处理',
      },
    ],
  },
  {
    icon: <LineChartOutlined />,
    path: '/gundamPages/reportForm',
    name: '报表管理',
    hideFn: (info: any) => {
      return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
    },
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsNumbers',
        name: '访客次数统计',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsSession',
        name: '访客会话明细',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/problemRate',
        name: '问题匹配率统计',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/recommendAndClare',
        name: '推荐问和澄清统计',
      },
    ],
  },
];
