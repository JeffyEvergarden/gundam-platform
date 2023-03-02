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
    
# 获取所有变量
variable_str = sys.argv[-1]
    
# 获取所有词槽
slot_str = sys.argv[-2]
    
# 根据变量名称获取变量值
channel_code= json.loads(variable_str)['CHANNEL_CODE']['value']
    
# 使用打印返回结果，一次或多次打印会组装成数组，返回给JAVA端填充词槽。
print(channel_code, end='')`);
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
