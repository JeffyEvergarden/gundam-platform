import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './style.less';

const Demo = (props: any) => {
  return (
    <div>
      <div>罗塞罗德 </div>
      <Button
        onClick={() => {
          history.push('/demo/a');
        }}
      >
        goToA
      </Button>
    </div>
  );
};

export default Demo;
