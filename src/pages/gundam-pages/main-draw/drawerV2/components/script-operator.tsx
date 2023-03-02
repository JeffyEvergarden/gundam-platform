import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Modal, Form, Button, InputNumber, Radio, Select, Input, Upload, message } from 'antd';

import MonacoEditor from '@/components/MonacoEditor';

const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

// 创建链接
const ScriptOperator: React.FC<any> = (props: any) => {
  const { cref, setScript } = props;
  const editorRef = useRef<any>(null);

  const [visible, setVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (row: any, index: any) => {
      console.log(row);
      setIndex(index);
      setVisible(true);
      if (row && typeof row === 'string') {
        console.log(1);

        setTimeout(() => {
          editorRef?.current?.setText(row);
        }, 100);
      } else {
        setTimeout(() => {
          // editorRef?.current?.setText('');
          init();
        }, 100);
      }
    },
    close: close,
  }));
  const close = () => {
    editorRef?.current?.setText('');
    setVisible(false);
  };

  const init = () => {
    editorRef?.current?.setText(`# coding=utf-8

import sys
import json
    
# 获取所有变量和词槽
var_slot_str = sys.argv[-1]
var_slot_json = json.loads(var_slot_str)
    
# 根据词槽名称获取槽值
age = variable_slot_json['#age']
age +=5
    
# 使用打印返回结果，多次打印会拼接成一个字符串返回给JAVA。
print(age, end='')`);
  };

  const onOK = () => {
    if (!editorRef?.current?.text?.trim()) {
      message.warning('脚本不允许为空');
      return;
    }
    setScript(editorRef?.current?.text, index);
    close();
  };

  return (
    <Modal width={900} visible={visible} onOk={onOK} onCancel={() => setVisible(false)}>
      <MonacoEditor cref={editorRef} />
    </Modal>
  );
};

export default ScriptOperator;
