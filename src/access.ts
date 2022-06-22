/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser?: API.CurrentUser | undefined;
  routerAuth: any;
  userAuth: any;
}) {
  const { currentUser, userAuth = [] } = initialState || {};
  const { routerAuth } = currentUser || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin', // 是否是管理员
    // 控制
    routerAuth: (route: any) => {
      if (!route.code) {
        return true;
      }
      // console.log(route);
      let authFlag = userAuth?.includes?.(route.code);
      console.log(`判断当前页面权限： ${authFlag ? '有' : '无'}`);
      return authFlag;
    },
    accessAuth: (code: string) => {
      let authFlag = userAuth?.includes?.(code);
      return authFlag;
    },
  };
}
