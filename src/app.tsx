import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
// import Footer from '@/components/Footer';
import Page403 from '@/pages/403';
import type { RequestConfig } from 'umi';
import routers from '../config/routes';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { queryAuthInfo } from './services/api';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/aichat/login';

const routersFilter: any[] = [];

const getNoAuthPage = (routers: any[], flag?: boolean) => {
  // 递归找到 noAuth 为 true 的页面
  routers.forEach((route: any, index: number) => {
    if (route.noAuth || flag) {
      routersFilter.push(route.path);
    }
    if (route.routes) {
      getNoAuthPage(route.routes, route.noAuth || flag);
    }
  });
};
// 加入无需权限页面列表
getNoAuthPage(routers);

console.log(routersFilter);

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  routersFilter?: any[];
  isLogin?: boolean;
  hadDone?: boolean; // 表示是否初始化信息接口
  userAuth?: any;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchAuthInfo: () => Promise<any | undefined>;
}> {
  // 抓去用户信息
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({ skipErrorHandler: true });
      return msg || {};
    } catch (error) {
      // 回登陆界面
      if (process.env.UMI_ENV == 'dev') {
        history.push(`/login`);
      } else {
        window.location.href = loginPath;
      }
    }
    return undefined;
  };

  // 抓去用户权限
  const fetchAuthInfo = async () => {
    try {
      const result: any = await queryAuthInfo({ skipErrorHandler: true });
      let data: any = result.data || [];
      data = Array.isArray(data)
        ? data.map((item: any) => {
            return item.operationCode;
          })
        : [];
      // TODO 这里应该按照具体执行做点数据加工
      return data;
    } catch (error) {
      return [];
    }
  };

  console.log(`history.location.pathname: ${history.location.pathname}`);

  // 用户信息结果
  let res1: any = fetchUserInfo();
  // 判断该页面是否需要进行抓取用户信息
  if (routersFilter.indexOf(history.location.pathname) > -1) {
    console.log('初始页面为不需权限页面, 不尝试抓去用户信息');
    // 提前返回
    return {
      fetchUserInfo,
      fetchAuthInfo, // 抓取用户权限
      routersFilter,
      currentUser: {}, // 用户信息
      userAuth: [], // 权限信息
      isLogin: false,
      hadDone: false,
      settings: {},
    };
  }
  // 抓取权限信息结果
  let res2: any = fetchAuthInfo();
  // let res2: any = [];
  // let [currentUser, userAuth] = await Promise.all([res1]);
  // 需要抓取用户信息
  let [userMsg, userAuth]: any[] = await Promise.all([res1, res2]).then((_arr: any[]) => {
    return _arr;
  });
  // console.log('userAuth');
  // console.log(userAuth);

  // 部门
  // const orz = userAuth?.userSummary?.organizations?.[0]?.name || '';
  const orz = userMsg?.principal?.organizations?.[0]?.name || '';
  // const isWhite = userMsg?.isWhite || true;
  return {
    fetchUserInfo,
    fetchAuthInfo, // 抓取用户权限
    routersFilter,
    currentUser: {
      userName: userMsg?.principal?.userName,
      department: orz,
      ...userMsg?.principal,
    }, // 用户信息  部门信息
    userAuth: userAuth, // 权限信息   userType 用户类型
    isLogin: userMsg?.principal?.userName ? true : false,
    hadDone: userMsg?.principal?.userName ? true : false,
    settings: {},
  };
}

export const request: RequestConfig = {
  timeout: 20000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [
    (res: any) => {
      // console.log('responseInterceptors', res);
      return res;
    },
  ],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    title: '呼入机器人平台',
    //
    rightContentRender: () => <RightContent />,
    // headerContentRender: () => <ProBreadcrumb />,
    disableContentMargin: false,
    // 加水印
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => '', // <Footer />
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   console.log('layout-onPageChange------');
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
          // <Link to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <Page403 />,
    ...initialState?.settings,
  };
};
