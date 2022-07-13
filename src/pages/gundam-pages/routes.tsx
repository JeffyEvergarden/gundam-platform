import {
  BuildOutlined,
  CrownOutlined,
  DatabaseOutlined,
  FontColorsOutlined,
  LineChartOutlined,
  MessageOutlined,
  MonitorOutlined,
  ReadOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

export default [
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/mainDraw',
    name: '主流程配置',
    code: 'robot_mg-main_page',
    access: 'routerAuth',
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
        code: 'robot_mg-global-node_conf',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/detail/globalConfig',
        name: '全局变量配置',
        code: 'robot_mg-global-var_conf',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/detail/interfaceConfig',
        name: '接口配置',
        code: 'robot_mg-global-inteface_conf',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/detail/FAQConfig',
        name: 'FAQ配置',
        code: 'robot_mg-global-faq_conf',
        access: 'routerAuth',
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
    code: 'robot_mg-global-faq_conf',
    access: 'routerAuth',
  },
  {
    icon: <DatabaseOutlined />,
    path: '/gundamPages/wordSlotLibrary',
    name: '词槽管理',
    code: 'robot_mg-wordslot-list',
    access: 'routerAuth',
  },
  {
    icon: <BuildOutlined />,
    path: '/gundamPages/lexiconManage',
    name: '词库管理',
    code: 'robot_mg-word-list',
    access: 'routerAuth',
  },
  {
    icon: <FontColorsOutlined />,
    path: '/gundamPages/spokenLabel',
    name: '话术标签管理',
    code: 'robot_mg-label-list',
    access: 'routerAuth',
  },
  {
    icon: <ShareAltOutlined />,
    path: '/gundamPages/businessDraw',
    exact: true,
    _info: { fuck: true },
    name: '业务流程管理',
    code: 'robot_mg-businessflow-list',
    access: 'routerAuth',
  },
  {
    icon: <MessageOutlined />,
    path: '/gundamPages/module',
    name: 'FAQ管理',
    // code: '0-0-4',
    hideFn: (info: any) => {
      return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
    },
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/faq',
        name: 'FAQ-标准',
        code: 'robot_mg-faq-list',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/clearlist',
        name: 'FAQ-澄清',
        code: 'robot_mg-faq_clear-list',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/blacklist',
        name: 'FAQ-黑名单',
        code: 'robot_mg-faq_black-list',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/reviewedList',
        name: '待审核',
        code: 'robot_mg-faq_audit-list',
        access: 'routerAuth',
        showBadge: true,
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/pendingList',
        name: '待处理',
        code: 'robot_mg-faq_pending-list',
        access: 'routerAuth',
        showBadge: true,
      },
    ],
  },
  {
    icon: <ReadOutlined />,
    path: '/gundamPages/knowledgeLearn',
    name: '知识学习',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/unknowQuestion',
        name: '未知问题',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/batchTest',
        name: '批量检测',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/checkWhite',
        name: '检测白名单',
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
        code: 'robot_mg-report_visitor_count-view',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsSession',
        name: '访客会话明细',
        code: 'robot_mg-report_visitor_session-view',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/problemRate',
        name: '问题匹配率统计',
        code: 'robot_mg-report_problem_match-view',
        access: 'routerAuth',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/recommendAndClare',
        name: '推荐问和澄清统计',
        code: 'robot_mg-report_recommend_and_clarify-view',
        access: 'routerAuth',
      },
    ],
  },
];
