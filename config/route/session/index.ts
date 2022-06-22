export default [
  {
    path: '/session',
    layout: true,
    component: '../layout',
    name: '会话管理',
    code: '0-0-1',
    access: 'routerAuth',
    routes: [
      {
        path: '/session/record',
        component: './session/session-record',
        name: '会话记录',
        code: '0-0-4',
        access: 'routerAuth',
      },
      { redirect: '/session/record' },
      { component: './404' },
    ],
  },
];
