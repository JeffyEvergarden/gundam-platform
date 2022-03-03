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

  const { getInfo } = useOpModel();

  const _getInfo = async (params: any) => {
    // 获取用户信息getInfo
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
      setFinish(true);
    } else {
      message.warning('获取不到机器人信息');
      history.replace('/robot/home');
    }
  };

  useEffect(() => {
    // console.log('机器人子系统获取：');
    // console.log(info);
    let robotId = location?.query?.id || localStorage.getItem('robot_id') || info.id || '';
    console.log(robotId);
    _getInfo({ id: robotId });
  }, []);

  const goBack = () => {
    history.push('/gundam/home');
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

  const timeFun = useRef<any>({});

  const {
    loading,
    testLoading,
    publishProduction,
    publishTest,
    productionTime,
    testTime,
    getTime,
    status,
    testStatus,
    result,
    testResult,
  } = usePublishModel();

  useEffect(() => {
    // 开启定时刷新生产时间
    getTime();
    const fn: any = setInterval(() => {
      getTime();
    }, 30 * 1000);
    return () => {
      clearInterval(fn);
    };
  }, []);

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
                      <div className={style['time-box']}>
                        <Condition r-if={productionTime}>
                          <span className={style['time-module']} style={{ marginRight: '24px' }}>
                            <span className={style['label']}>生产发布时间:</span>
                            {status && (
                              <span>
                                <Badge status="success" size="default" />
                                <span>{productionTime}</span>
                              </span>
                            )}

                            {!status && (
                              <Tooltip placement="bottomLeft" title={result || '未知系统异常'}>
                                <span>
                                  <Badge status="error" />
                                  <span>{productionTime}</span>
                                </span>
                              </Tooltip>
                            )}
                          </span>
                        </Condition>
                        <Condition r-if={testTime}>
                          <span className={style['time-module']}>
                            <span className={style['label']}>测试发布时间:</span>
                            {testStatus && (
                              <span>
                                <Badge status="success" />
                                <span>{testTime}</span>
                              </span>
                            )}

                            {!testStatus && (
                              <Tooltip placement="bottomLeft" title={testResult || '未知系统异常'}>
                                <span>
                                  <Badge status="error" />
                                  <span>{productionTime}</span>
                                </span>
                              </Tooltip>
                            )}
                          </span>
                        </Condition>
                      </div>
                      <Button
                        type="primary"
                        loading={loading}
                        onClick={() => {
                          publishProduction();
                        }}
                      >
                        发布生产
                      </Button>

                      <Button
                        type="default"
                        loading={testLoading}
                        onClick={() => {
                          publishTest();
                        }}
                      >
                        发布测试
                      </Button>
                    </Space>
                  ),
                }}
              >
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
              </PageContainer>
            )
          );
        }}
      </RouteContext.Consumer>
    </ProLayout>
  );
};

export default MachinePagesHome;
