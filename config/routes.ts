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
    path: '/demo',
    layout: false,
    name: 'demo事例',
    component: './demo',
    noAuth: true,
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
