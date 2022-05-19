import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { history } from 'umi';
import Route from './components/Route';
import A from './a';
import B from './b';
import C from './c';

const { TextArea } = Input;
const { Option } = Select;

const Demo = (props: any) => {
  const path = history.location.pathname;

  return (
    <div className={`${styles['div-content']}`}>
      <div>父页面 路径：{path}</div>

      <Route path="/demo/a" component={A}></Route>
      <Route path="/demo/b" component={B}></Route>
      <Route path="/demo/c" component={C}></Route>
    </div>
  );
};

export default Demo;
