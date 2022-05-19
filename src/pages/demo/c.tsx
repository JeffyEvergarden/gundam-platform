import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { history } from 'umi';

const Demo = (props: any) => {
  return (
    <div>
      <div>萨菲罗斯</div>
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
