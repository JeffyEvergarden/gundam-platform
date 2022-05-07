import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, DatePicker, Switch } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';

const Board: React.FC<any> = (props: any) => {
  const { title = ' 添加问题' } = props;

  const [form] = Form.useForm();

  const onFinish = () => {};

  const [showTime, setShowTime] = useState<boolean>(false);

  const changeSwitch = (val: any) => {
    console.log(val);
    setShowTime(val);
  };

  return (
    <div className={style['board-page']}>
      <div className={style['board-title']}>{title}</div>

      <div className={style['board-form']}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="questionName"
            label="问题名称"
            rules={[{ required: true }]}
            style={{ width: '600px' }}
          >
            <Input placeholder={'请输入问题名称'} />
          </Form.Item>

          <Form.Item
            name="channal"
            label="生效渠道"
            rules={[{ required: true }]}
            style={{ width: '600px' }}
          >
            <Input placeholder={'请选择生效渠道'} />
          </Form.Item>

          <Form.Item
            name="time"
            label="生效时间"
            valuePropName="checked"
            style={{ width: '600px' }}
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={changeSwitch} />
          </Form.Item>

          <Condition r-if={showTime}>
            <Form.Item
              name="time"
              rules={[{ required: true }]}
              style={{ width: '600px', marginLeft: '108px' }}
            >
              <DatePicker.RangePicker showTime placeholder={['请选择开始时间', '请选择结束时间']} />
            </Form.Item>
          </Condition>
          <Form.Item
            name="channal"
            label="推荐设置"
            rules={[{ required: true }]}
            style={{ width: '600px' }}
          >
            <Input placeholder={'请输入推荐设置'} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Board;
