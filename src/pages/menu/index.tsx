import React, { useState, useEffect, useRef } from 'react';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { ProBreadcrumb } from '@ant-design/pro-layout';
// 统一门户-菜单管理

const MenuHome: React.FC<any> = (props: any) => {
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <div>
        <div className={'header-title_box'}>
          <ProBreadcrumb />
        </div>
        {children}
      </div>
    </ConfigProvider>
  );
};

export default MenuHome;
