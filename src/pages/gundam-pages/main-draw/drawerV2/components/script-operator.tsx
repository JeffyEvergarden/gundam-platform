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
      if (typeof row === 'string') {
        setTimeout(() => {
          editorRef?.current?.setText(row);
        }, 100);
      } else {
        setTimeout(() => {
          editorRef?.current?.setText('');
        }, 100);
      }
    },
    close: close,
  }));
  const close = () => {
    editorRef?.current?.setText('');
    setVisible(false);
  };

  const onOK = () => {
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
