export default [
  {
    path: '/session',
    layout: true,
    component: '../layout',
    name: '会话管理',
    routes: [
      {
        path: '/session/record',
        component: './session/session-record',
        name: '会话记录',
      },
      { redirect: '/session/record' },
      { component: './404' },
    ],
  },
];
