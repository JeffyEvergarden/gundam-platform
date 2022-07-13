export default [
  {
    path: '/users',
    layout: true,
    name: '权限管理',
    component: './users',
    routes: [
      {
        path: '/users/userManagement',
        component: './users/user-management',
        name: '用户管理',
        code: 'auth-user-list', // 前端权限编码
        access: 'routerAuth',
      },
      {
        path: '/users/roleManagement/:type',
        name: '角色管理',
        component: './users/role-management/home',
        code: 'auth-role-list', // 前端权限编码
        access: 'routerAuth',
      },
    ],
  },
];
