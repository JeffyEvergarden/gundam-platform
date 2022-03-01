import React, { useState, useEffect, useRef } from 'react';
import { useModel, history, useLocation } from 'umi';
import { message, Button, Space, Modal } from 'antd';
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
import { useOpModel } from '../gundam/management/model';

// 机器人列表
const MachinePagesHome: React.FC = (props: any) => {
  const location: any = useLocation();
  const [chatVisible, handleChatVisible] = useState<boolean>(false);

  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  const { info, setInfo, setGlobalVarList } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
    setGlobalVarList: model.setGlobalVarList,
  }));

  const { getInfo } = useOpModel();

  const _getInfo = async (params: any) => {
    // 获取用户信息
    let _info = await getInfo(params);
    console.log(_info);
    if (_info) {
      setInfo(_info.robotInfo || {});
      let list: any[] =
        _info.globalVarList?.map((item: any) => {
          return {
            name: item.configKey,
            label: item.configName,
            desc: item.configDesc,
          };
        }) || [];
      setGlobalVarList(list);
    } else {
      message.warning('获取不到机器人信息');
      history.replace('/robot/home');
    }
  };

  useEffect(() => {
    // console.log('机器人子系统获取：');
    // console.log(info);
    let robotId = info.id || location?.query?.id || localStorage.getItem('robot_id') || '';
    console.log(robotId);
    _getInfo({ id: robotId });
  }, []);

  const goBack = () => {
    history.push('/robot/home');
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
      <div>
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
            right: '60px',
            bottom: '60px',
            height: '60px',
            width: '60px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '4px 4px 12px rgba(24, 144, 255, 0.2)',
          }}
          onClick={robotChatComp}
        >
          <img alt="robot" src={hoverRobot} style={{ width: 40, height: 40 }} />
        </div>
      </div>
      <Modal
        visible={chatVisible}
        title={info.robotName}
        footer={null}
        width={1000}
        // maskClosable
        onCancel={() => handleChatVisible(false)}
      >
        <RobotChatBox robotInfo={info} chatVisible={chatVisible} />
      </Modal>
      <RouteContext.Consumer>
        {(route: RouteContextType) => {
          // console.log('router:', route);
          // const title: any = route?.pageTitleInfo?.title || route?.title;
          return (
            info?.id && (
              <PageContainer
                header={{
                  title: <ProBreadcrumb />,
                  ghost: true,
                  extra: (
                    <Space>
                      <Button type="primary">发布生产</Button>

                      <Button type="default">发布测试</Button>
                    </Space>
                  ),
                }}
              >
                {props.children}
              </PageContainer>
            )
          );
        }}
      </RouteContext.Consumer>
    </ProLayout>
  );
};

export default MachinePagesHome;
