import React, { useState } from 'react';
import { Input } from 'antd';

interface selectorProps {
  value: {
    questionType: string; // 流程
    value: any; // id
  };
}

const Selector = (props: any) => {
  const { value, onChange, openModal } = props;

  const callback = (val: any) => {
    onChange(val);
  };

  const onClick = (e: any) => {
    e.stopPropagation();
    openModal?.(callback);
  };

  return (
    <div onClick={onClick}>
      <Input
        value={value}
        placeholder={'请选择问题/业务流程'}
        size="small"
        style={{ width: '248px', pointerEvents: 'none' }}
      />
    </div>
  );
};

export default Selector;
