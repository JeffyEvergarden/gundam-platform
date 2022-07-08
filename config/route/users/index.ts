export default [
  {
    path: '/users',
    layout: true,
    component: '../layout',
    name: '权限管理',
    routes: [
      {
        path: '/users/userManagement',
        component: './users/user-management',
        name: '用户管理',
      },
      {
        path: '/users/roleManagement*',
        component: './users/role-management/home',
        name: '角色管理',
      },
    ],
  },
];
