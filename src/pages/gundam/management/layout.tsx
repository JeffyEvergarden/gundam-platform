import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import MachineManagement from './index';
import { message } from 'antd';

// 机器人列表
const BaseLayout: React.FC = (props: any) => {
  return (
    <React.Fragment>
      <PageContainer>
        <MachineManagement />
      </PageContainer>
    </React.Fragment>
  );
};

export default BaseLayout;
