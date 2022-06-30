import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { history } from 'umi';
import KeepAlive, { useActivate, useUnactivate } from 'react-activation';

const Demo = (props: any) => {
  const [num, setNum] = useState<any>(0);

  const update = () => {
    setNum(num + 1);
  };

  useActivate(() => {
    console.log('激活-------------');
  });

  useUnactivate(() => {
    console.log('不激活----------');
  });

  return (
    <div>
      <div>马卡罗夫 {num}</div>

      <div>
        <Button onClick={update} type="primary">
          add
        </Button>
      </div>

      <div>
        <Button
          onClick={() => {
            history.push('/demo/b');
          }}
        >
          goToB
        </Button>
      </div>

      <div>
        <Button
          onClick={() => {
            history.push('/demo/c');
          }}
        >
          goToC
        </Button>
      </div>
    </div>
  );
};

export default Demo;
