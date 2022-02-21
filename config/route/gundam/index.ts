export default [
  {
    path: '/robot',
    layout: true,
    component: '../layout',
    name: '机器人管理',
    routes: [
      {
        path: '/robot/home/list',
        component: './gundam/management',
        name: '机器人列表',
      },
      { redirect: '/robot/home/list' },
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
        component: './gundam-pages/home',
        name: '首页',
      },
      {
        path: '/gundamPages/detail',
        component: './gundam-pages/detail',
        name: '机器人配置',
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
        path: '/gundamPages/spokenLabel',
        component: './gundam-pages/spoken-label',
        name: '话术标签管理',
      },
      {
        path: '/gundamPages/mainDraw',
        component: './gundam-pages/main-draw',
        name: '主流程管理',
      },
      {
        path: '/gundamPages/businessDraw',
        component: './gundam-pages/business-draw',
        name: '业务流程管理',
      },
      {
        path: '/gundamPages/aiSimulation',
        component: './gundam-pages/ai-simulation',
        name: '机器人模拟',
      },
      { redirect: '/gundamPages/home' },
      { component: './404' },
    ],
  },
];
