import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';

// 机器人列表
const BaseLayout: React.FC = (props: any) => {
  return (
    <React.Fragment>
      <PageContainer>{props.children}</PageContainer>
    </React.Fragment>
  );
};

export default BaseLayout;
