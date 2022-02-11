import routes from './route';
export default [
  {
    path: '/',
    component: './home',
    name: '外呼机器人平台',
    layout: true,
    hideInMenu: true,
  },
  ...routes,
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
  {
    path: '/login',
    layout: false,
    hideInMenu: true,
    name: '登录',
    component: './user/Login',
    noAuth: true,
  },
  { path: '/403', component: './403', layout: true, hideInMenu: true },
  { component: './404', layout: true, hideInMenu: true, noAuth: true },
];
