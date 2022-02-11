import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useTableModel } from './model';
import { Table, Button } from 'antd';

import {} from 'antd';
import ProLayout, { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';

import RightContent from '@/components/RightContent';
import routes from './routes';

// 机器人列表
const MachinePagesHome: React.FC = (props: any) => {
  const [pathname, setPathname] = useState('/gundamPages');

  const { info, setInfo } = useModel('gundam', (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  useEffect(() => {
    console.log('机器人子系统获取：');
    console.log(info);
  }, []);

  return (
    <ProLayout
      title="机器人详情"
      navTheme="light"
      layout="side"
      location={{
        pathname,
      }}
      route={{ routes }}
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
      {props.children}
    </ProLayout>
  );
};

export default MachinePagesHome;
