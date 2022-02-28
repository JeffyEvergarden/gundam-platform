import { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './style.less';
import RuleModal from './rule-modal';

const { Option } = Select;

const RuleSelect: React.FC<any> = (props: any) => {
  const { value, onChange, wishList, wordSlotList } = props;

  const modelRef = useRef<any>(null);

  const onConfirm = (val: any) => {
    onChange(val);
  };

  const openModal = () => {
    let vals: any = value || [];
    (modelRef.current as any).open({
      list: vals.map((item: any) => ({
        ruleList: item,
      })),
    });
  };

  return (
    <div className={styles['zy-row']}>
      <div className={styles['left']}>
        {(!value || value?.length === 0) && '--'}
        {value?.length > 0 && '已配置'}
        <Button type="link" icon={<PlusOutlined />} onClick={openModal}></Button>
      </div>
      <RuleModal
        cref={modelRef}
        confirm={onConfirm}
        wishList={wishList}
        wordSlotList={wordSlotList}
      />
    </div>
  );
};

export default RuleSelect;
