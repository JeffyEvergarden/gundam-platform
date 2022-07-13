export default [
  {
    path: '/session',
    layout: true,
    component: '../layout',
    name: '会话管理',
    access: 'routerAuth',
    routes: [
      {
        path: '/session/record',
        component: './session/session-record',
        name: '会话记录',
        access: 'routerAuth',
      },
      { redirect: '/session/record' },
      { component: './404' },
    ],
  },
];
