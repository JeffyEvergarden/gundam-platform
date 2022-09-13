import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';

import styles from './style.less';
import { history, useLocation } from 'umi';
import AudioPlay from '@/components/AudioPlay';
const { TextArea } = Input;
const { Option } = Select;

const Demo = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const path = history.location.pathname;

  return (
    <div className={`${styles['div-content']}`}>
      <div className={styles['box']}>
        <AudioPlay musicSrc={'/aichat/mp3/bluebird.mp3'} />
      </div>
    </div>
  );
};

export default Demo;
