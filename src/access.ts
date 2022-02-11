/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser?: API.CurrentUser | undefined;
  routerAuth: any;
}) {
  const { currentUser } = initialState || {};
  const { routerAuth } = currentUser || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin', // 是否是管理员
    routerAuth: (route: any) => {
      // console.log(route);
      let authFlag = routerAuth?.includes?.(route.code);
      console.log(`判断当前页面权限： ${authFlag ? '有' : '无'}`);
      return authFlag;
    },
  };
}
