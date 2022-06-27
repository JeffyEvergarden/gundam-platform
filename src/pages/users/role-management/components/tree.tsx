import React from 'react';
import { Card, Form } from 'antd';
import style from './style.less';
import { Item } from 'gg-editor';

const Tree: React.FC<any> = (props: any) => {
  const { node } = props;

  const [form] = Form.useForm();

  return (
    <Card className={style['auth-card']} title={node.label}>
      <Form form={form}></Form>
    </Card>
  );
};

export default Tree;
