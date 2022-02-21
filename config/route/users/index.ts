export default [
  {
    path: '/users',
    layout: true,
    component: '../layout',
    name: '用户管理',
    routes: [
      {
        path: '/users/userManagement',
        component: './users/user-management',
        name: '用户列表',
      },
      {
        path: '/users/authManagement',
        component: './users/auth-management',
        name: '角色列表',
      },
    ],
  },
  {
    path: '/menu',
    layout: true,
    component: './menu',
    name: '菜单管理',
    routes: [
      {
        path: '/menu/home',
        component: './menu/menu-management',
        name: '菜单配置',
      },
      { redirect: '/menu/home' },
      { component: './404' },
    ],
  },
];
