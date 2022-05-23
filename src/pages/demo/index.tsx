import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { history, useLocation } from 'umi';
import KeepAlive, {
  AliveScope,
  useActivate,
  useUnactivate,
  withActivation,
} from 'react-activation';
import Route from './components/Route';
import A from './a';
import B from './b';
import C from './c';

const { TextArea } = Input;
const { Option } = Select;

const Demo = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const path = history.location.pathname;

  return (
    <AliveScope>
      <div className={`${styles['div-content']}`}>
        <div>父页面 路径：{path}</div>
        {currentPath === '/demo/a' && (
          <KeepAlive>
            <A></A>
          </KeepAlive>
        )}

        <Route path="/demo/b" component={<B></B>}></Route>
        <Route path="/demo/c" component={<C></C>}></Route>
      </div>
    </AliveScope>
  );
};

export default Demo;
