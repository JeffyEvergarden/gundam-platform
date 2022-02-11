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
        component: './gundam-pages/home',
        name: '机器人详情首页',
      },
      {
        path: '/gundamPages/detail',
        component: './gundam-pages/detail',
        name: '机器人详情信息',
      },
      { redirect: '/gundamPages/home' },
      { component: './404' },
    ],
  },
];
