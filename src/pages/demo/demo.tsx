import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;

const TestPage = (props: any) => {
  return (
    <div className={styles['demo-box']}>
      <Button>点击按钮</Button>
    </div>
  );
};

export default TestPage;
