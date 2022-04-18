export default [
  {
    path: '/gundam',
    layout: true,
    component: '../layout',
    name: '机器人管理',
    routes: [
      {
        path: '/gundam/home/list',
        component: './gundam/management',
        name: '机器人列表',
      },
      { redirect: '/gundam/home/list' },
      { component: './404' },
    ],
  },
  {
    path: '/gundamPages',
    hideInMenu: true,
    layout: false,
    component: './gundam-pages',
    name: '机器人详情',
    routes: [
      {
        path: '/gundamPages/home',
        redirect: '/gundamPages/mainDraw',
        name: '首页',
      },
      {
        path: '/gundamPages/detail',
        component: './gundam-pages/detail',
        name: '机器人配置',
        routes: [
          {
            path: '/gundamPages/detail/nodeConfig',
            component: './gundam-pages/detail/nodeConfig',
            name: '业务流程管理',
          },
          {
            path: '/gundamPages/detail/globalConfig',
            component: './gundam-pages/detail/globalConfig',
            name: '业务流程管理-详情配置',
          },
          {
            path: '/gundamPages/detail/interfaceConfig',
            component: './gundam-pages/detail/interfaceConfig',
            name: '业务流程管理',
          },
          { redirect: '/gundamPages/detail' },
        ],
      },
      {
        path: '/gundamPages/wish',
        component: './gundam-pages/wish',
        name: '意图管理',
      },
      {
        path: '/gundamPages/wordSlotLibrary',
        component: './gundam-pages/word-slot-library',
        name: '词槽管理',
      },
      {
        path: '/gundamPages/lexiconManage',
        component: './gundam-pages/lexicon-manage',
        name: '词库管理',
      },
      {
        path: '/gundamPages/spokenLabel',
        component: './gundam-pages/spoken-label',
        name: '话术标签管理',
      },
      {
        path: '/gundamPages/mainDraw',
        component: './gundam-pages/main-draw/layout',
        name: '主流程配置',
      },
      {
        path: '/gundamPages/businessDraw',
        component: './gundam-pages/business-draw/layout',
        name: '业务流程管理',
        routes: [
          {
            path: '/gundamPages/businessDraw/list',
            component: './gundam-pages/business-draw',
            name: '业务流程管理',
          },
          {
            path: '/gundamPages/businessDraw/detail',
            component: './gundam-pages/business-draw/pages/draw-page',
            name: '业务流程管理-详情配置',
          },
          { redirect: '/gundamPages/businessDraw/list' },
        ],
      },
      {
        path: '/gundamPages/aiSimulation',
        component: './gundam-pages/ai-simulation',
        name: '机器人模拟',
      },
      { redirect: '/gundamPages/mainDraw' },
      { component: './404' },
    ],
  },
];
