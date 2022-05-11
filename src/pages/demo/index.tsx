import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';
import SelectorModal from '../gundam-pages/FAQ/question-board/components/selector-modal';
import { useModel } from 'umi';

const { TextArea } = Input;
const { Option } = Select;

const Demo = (props: any) => {
  const selectModalRef = useRef<any>({});
  const onClick = () => {
    console.log('---');
    (selectModalRef.current as any).open([]);
  };

  const { getFlowList, getTreeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeData,
  }));

  useEffect(() => {
    getFlowList('fake');
    getTreeData('fake');
  }, []);

  return (
    <div className={`${styles['div-content']}`}>
      <Button type="primary" onClick={onClick}>
        手动推荐触发
      </Button>

      <SelectorModal cref={selectModalRef} />
    </div>
  );
};

export default Demo;
