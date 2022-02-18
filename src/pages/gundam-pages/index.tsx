import React, { useState, useEffect, useRef } from 'react';
import { useModel, history, useLocation } from 'umi';
import { useTableModel } from './model';
import { Table, Button, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import ProLayout, { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';

import RightContent from '@/components/RightContent';
import routes from './routes';
import style from './style.less';
import { useOpModel } from '../gundam/management/model';
import logo from '@/asset/image/logo.png';
import session from 'config/route/session';

// 机器人列表
const MachinePagesHome: React.FC = (props: any) => {
  const [pathname, setPathname] = useState('/gundamPages');

  const location: any = useLocation();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { getInfo } = useOpModel();

  const _getInfo = async (params: any) => {
    // 获取用户信息
    let _info = await getInfo(params);
    console.log(_info);
    if (_info && _info.id) {
      setInfo(_info);
    } else {
      message.warning('获取不到机器人信息');
      history.replace('/robot/home');
    }
  };

  useEffect(() => {
    console.log('机器人子系统获取：');
    console.log(info);
    let robotId = info.id || location?.query?.id || localStorage.getItem('robot_id') || '';
    console.log(robotId);
    // 如果没有获取到机器人信息
    if (!info.robotName && !info.id) {
      _getInfo({ id: robotId });
    }
  }, []);

  const goBack = () => {
    history.push('/robot/home');
  };

  const MenuHeader = (props: any) => (
    <div
      className={style['menu-header']}
      onClick={() => {
        goBack();
      }}
    >
      {/* <img className={style['menu-logo']} src={logo} alt="logo"></img> */}
      <LoginOutlined style={{ marginRight: '16px' }} />
      <div className={style['menu-title']}> 返回</div>
    </div>
  );

  return (
    <ProLayout
      title="机器人详情"
      navTheme="light"
      layout="side"
      location={{
        pathname,
      }}
      route={{ routes }}
      menuHeaderRender={() => <MenuHeader />}
      rightContentRender={() => <RightContent />}
      menuItemRender={(item: any, dom: any) => (
        <a
          onClick={() => {
            history.push(item.path);
            setPathname(item.path || '/gundamPages/home');
          }}
        >
          {dom}
        </a>
      )}
      disableContentMargin={false}
    >
      {info.id && props.children}
    </ProLayout>
  );
};

export default MachinePagesHome;
