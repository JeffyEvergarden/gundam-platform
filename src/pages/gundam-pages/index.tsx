import React, { useState, useEffect, useRef } from 'react';
import { useModel, history, useLocation } from 'umi';
import { message, Button, Space, Modal, Badge, Tooltip } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import hoverRobot from '@/asset/image/hoverRobot.png';
import RobotChatBox from './ai-simulation';

import ProLayout, {
  PageContainer,
  RouteContext,
  RouteContextType,
  ProBreadcrumb,
} from '@ant-design/pro-layout';

import RightContent from '@/components/RightContent';
import routes from './routes';
import style from './style.less';
import { useOpModel, usePublishModel } from '../gundam/management/model';
import Condition from '@/components/Condition';

// 机器人列表
const MachinePagesHome: React.FC = (props: any) => {
  const location: any = useLocation();
  const [chatVisible, handleChatVisible] = useState<boolean>(false);

  const [pathname, setPathname] = useState(location.pathname);

  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  const { info, setInfo, globalVarList, setGlobalVarList } = useModel(
    'gundam' as any,
    (model: any) => ({
      info: model.info,
      setInfo: model.setInfo,
      globalVarList: model.globalVarList,
      setGlobalVarList: model.setGlobalVarList,
    }),
  );

  const { getInfo, getGlobalValConfig } = useOpModel();

  const _getInfo = async (params: any) => {
    // 获取机器人信息getInfo
    let _info = await getInfo(params);
    // let globalValConfig = await getGlobalValConfig(params);
    // console.log(_info);
    // console.log(globalValConfig);

    // if (globalValConfig?.list?.length) {
    //   setGlobalVarList(globalValConfig?.list);
    // }
    if (_info) {
      setInfo(_info || {});
      // let list: any[] =
      //   _info.globalVarList?.map((item: any) => {
      //     return {
      //       name: item.configKey,
      //       label: item.configName,
      //       desc: item.configDesc,
      //     };
      //   }) || [];
      // setGlobalVarList(globalValConfig?.list);
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
      route={{ routes }}
      menuHeaderRender={() => <MenuHeader />}
      rightContentRender={() => <RightContent />}
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
                  onCancel={() => handleChatVisible(false)}
                >
                  <RobotChatBox robotInfo={globalVarList} chatVisible={chatVisible} />
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
