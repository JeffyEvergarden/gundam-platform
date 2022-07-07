import hoverRobot from '@/asset/image/hoverRobot.png';
import { LoginOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { history, useLocation, useModel } from 'umi';
import RobotChatBox from './ai-simulation';

import ProLayout, { RouteContext, RouteContextType } from '@ant-design/pro-layout';

import RightContent from '@/components/RightContent';
import { useOpModel } from '../gundam/management/model';
import { deepClone } from './FAQ/question-board/model/utils';
import routes from './routes';
import style from './style.less';

// 菜单过滤
const processRoute = (info: any = {}, userAuth: any[]) => {
  let _route = deepClone(routes);
  deepProcess(_route, info, userAuth);
  return _route;
};

const deepProcess = (arr: any[], info: any = {}, userAuth: any[]) => {
  arr.forEach((item: any) => {
    if (Array.isArray(item.routes)) {
      deepProcess(item.routes, info, userAuth);
    }
    const hideFn = item.hideFn;
    // console.log(typeof hideFn);
    // hideFn && console.log(hideFn);
    if (item.code) {
      item.hideInMenu = !access(userAuth, item.code);
      if (item.hideInMenu) {
        return;
      }
    }

    if (hideFn && typeof hideFn === 'function') {
      item.hideInMenu = hideFn(info);
    }
  });
};

const access = (userAuth: any[], code: any) => {
  return userAuth?.includes?.(code);
};

// 机器人列表
const MachinePagesHome: React.FC = (props: any) => {
  const location: any = useLocation();
  const [chatVisible, handleChatVisible] = useState<boolean>(false);

  const [pathname, setPathname] = useState(location.pathname);

  const RobotChatBoxRef = useRef<any>();

  const [finish, setFinish] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { userAuth = [] } = initialState || {};
  const { info, setInfo, globalVarList, setGlobalVarList } = useModel(
    'gundam' as any,
    (model: any) => ({
      info: model.info,
      setInfo: model.setInfo,
      globalVarList: model.globalVarList,
      setGlobalVarList: model.setGlobalVarList,
    }),
  );
  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  const _routes = useMemo(() => {
    return processRoute(info, userAuth || []);
  }, [info]);
  // console.log('_routes');
  // console.log(_routes);

  const { getInfo } = useOpModel();

  const _getInfo = async (params: any) => {
    // 获取机器人信息getInfo
    let _info = await getInfo(params);
    if (_info) {
      setInfo(_info || {});
      setFinish(true);
    } else {
      message.warning('获取不到机器人信息');
      history.replace('/gundam/home/list');
    }
  };

  // 获取最新的信息
  const getLastInfo = () => {
    // console.log('机器人子系统获取：');
    // console.log(info);
    let robotId =
      location?.query?.id ||
      sessionStorage.getItem('robot_id') ||
      localStorage.getItem('robot_id') ||
      info.id ||
      '';
    console.log(robotId);
    _getInfo({ id: robotId });
  };

  const setChatVis = (flag: any) => {
    console.log(flag);

    RobotChatBoxRef?.current?.setChatVisible(flag);
  };

  useEffect(() => {
    getLastInfo();
  }, []);

  const goBack = () => {
    history.push('/gundam/home/list');
  };

  const MenuHeader = (props: any) => (
    <div style={{ width: '100%' }}>
      <div
        className={style['menu-header']}
        onClick={() => {
          goBack();
        }}
      >
        <LoginOutlined style={{ marginRight: '12px' }} />
        <div className={style['menu-title']}> 返回</div>
      </div>

      <div className={style['menu-desc']}>{info.robotName}</div>
    </div>
  );

  // 机器人聊天
  const robotChatComp = () => {
    getLastInfo();
    handleChatVisible(true);
    setChatVis(true);
  };

  return (
    <ProLayout
      title="机器人详情"
      navTheme="light"
      layout="side"
      location={{
        pathname,
      }}
      fixedHeader={true}
      fixSiderbar={true}
      className={style['sp-layout']}
      route={{ routes: _routes }}
      menuHeaderRender={() => <MenuHeader />}
      rightContentRender={() => <RightContent />}
      onPageChange={() => {
        handleChatVisible(false);
        setChatVis(false);
      }}
      menuItemRender={(item: any, dom: any) => (
        <a
          onClick={() => {
            history.push(item.path);
            setPathname(item.path || '/gundamPages/mainDraw');
          }}
        >
          {dom}
        </a>
      )}
      disableContentMargin={false}
    >
      <RouteContext.Consumer>
        {(route: RouteContextType) => {
          // console.log('router:', route);
          // const title: any = route?.pageTitleInfo?.title || route?.title;
          return (
            info?.id && (
              <>
                {finish && props.children}
                <div className={style['hover-style']} onClick={robotChatComp}>
                  <img alt="robot" src={hoverRobot} style={{ width: 44, height: 44 }} />
                </div>
                <Modal
                  visible={chatVisible}
                  title={info.robotName}
                  footer={null}
                  width={1000}
                  onCancel={() => {
                    handleChatVisible(false);
                    setChatVis(false);
                  }}
                >
                  <RobotChatBox
                    cref={RobotChatBoxRef}
                    robotInfo={globalVarList}
                    chatVisible={chatVisible}
                  />
                </Modal>
              </>
            )
          );
        }}
      </RouteContext.Consumer>
    </ProLayout>
  );
};

export default MachinePagesHome;
