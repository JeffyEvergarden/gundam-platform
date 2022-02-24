import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, ProBreadcrumb } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import Page403 from '@/pages/403';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { queryAuthInfo } from './services/api';
import type { RequestConfig } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import routers from '../config/routes';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const routersFilter: any[] = [];

const getNoAuthPage = (routers: any[], flag?: boolean) => {
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
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      // 回登陆界面
      history.push(loginPath);
    }
    return undefined;
  };

  // 抓去用户权限
  const fetchAuthInfo = async () => {
    try {
      const result: any = await queryAuthInfo();
      return result?.data || {};
    } catch (error) {
      return {};
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
      userAuth: {}, // 权限信息
      isLogin: false,
      hadDone: false,
      settings: {},
    };
  }
  // 抓取权限信息结果
  // let res2: any = fetchAuthInfo();
  let [currentUser, userAuth] = await Promise.all([res1]);

  // 部门
  const orz = userAuth?.userSummary?.organizations?.[0]?.name || '';
  const isWhite = userAuth?.isWhite;
  return {
    fetchUserInfo,
    fetchAuthInfo, // 抓取用户权限
    routersFilter,
    currentUser: {
      userName: currentUser?.userName,
      department: orz,
      ...currentUser,
    }, // 用户信息  部门信息
    userAuth: { userType: isWhite ? 'leader' : 'user' }, // 权限信息   userType 用户类型
    isLogin: currentUser?.userName ? true : false,
    hadDone: currentUser?.userName ? true : false,
    settings: {},
  };
}

export const request: RequestConfig = {
  timeout: 20000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    title: '机器人平台',
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
