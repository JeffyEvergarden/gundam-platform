import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

// 机器人列表
const BaseLayout: React.FC = (props: any) => {
  return <PageContainer>{props.children}</PageContainer>;
};

export default BaseLayout;
