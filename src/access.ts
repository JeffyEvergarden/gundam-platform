/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { valueToCodeMap } from '@/auth/util';
import { Item } from 'gg-editor';

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
    routerAuth: (route: any, ...args: any[]) => {
      // 如果路由没有code
      if (!route.code) {
        return true;
      }
      if (route?.routes?.length > 0) {
        let index = route.routes.findIndex((item: any) => {
          return !item.code || (item.code && userAuth?.includes?.(item.code));
        });
        return index > -1;
      }
      let authValue = route.code;
      let code = valueToCodeMap[authValue] || '';
      let authFlag = userAuth?.includes?.(code);
      // if (!authFlag) {
      //   route.hideInMenu = true;
      // }
      // console.log(authValue, code, authFlag, route);
      // console.log(`判断当前页面权限： ${authFlag ? '有' : '无'}`);
      return authFlag;
    },
    accessAuth: (code: string) => {
      let authValue = code;
      code = valueToCodeMap[authValue] || '';
      let authFlag = userAuth?.includes?.(code);
      return authFlag;
    },
  };
}
