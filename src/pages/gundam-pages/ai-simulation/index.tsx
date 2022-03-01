import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Input, Radio, Select, Button, message } from 'antd';
import { robotChatFormList } from './config';
import RobotChatText from './chatText';
import { useChatModel } from './model';
import { useModel } from 'umi';
import styles from './style.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

export default (props: any) => {
  const { chatVisible = false, robotInfo } = props;
  const [form] = Form.useForm();
  const [formSelectArr, setFormSelectArr] = useState<any>({
    fakeArray: [
      {
        value: 'fake',
        name: 'fake',
      },
    ],
  });
  const [robotChatData, setRobotChatData] = useState<any>({}); // 保存机器人聊天数据
  const { getRobotChatData } = useChatModel();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const showChatText = async () => {
    console.log('info', info);
    const values = await form.validateFields();
    const data = form.getFieldsValue();
    let newData = { ...data };
    let params = {
      requestId: '',
      occurTime: '',
      systemCode: '',
      data: { ...newData },
      customerId: '',
      validity: '',
      robotId: info.id,
      businessCode: info.businessCode,
    };
    const res: any = await getRobotChatData(params);
    message.info(res?.resultDesc || '正在处理');
    if (res?.resultCode == 100) {
      setRobotChatData(res);
    }
  };

  useEffect(() => {
    setRobotChatData({});
    let arr = ['createTime', 'onlineTime', 'id', 'robotType', 'status'];
    let newObj = Object.keys(robotInfo)?.filter((item: any) => {
      return !arr.includes(item);
    });
    let newData = newObj?.map((item: any) => {
      return {
        name: item,
        label: item,
      };
    });
    console.log('robotInfo', robotInfo, newObj);
    setRobotChatData(newData);
  }, [chatVisible]);

  return (
    <React.Fragment>
      <Row gutter={24}>
        <Col span={10}>
          <div className={styles['box-title']}>变量配置</div>
          <div className={styles['variable-box']}>
            <Form form={form} {...layout}>
              {robotChatFormList?.map((item: any) => {
                return (
                  <React.Fragment key={item.name}>
                    {item.type == 'input' && (
                      <Form.Item name={item.name} label={item.label} rules={item.rules}>
                        <Input placeholder={item.placeholder} />
                      </Form.Item>
                    )}
                    {item.type == 'radio' && (
                      <Form.Item name={item.name} label={item.label} rules={item.rules}>
                        <Radio.Group>
                          <Radio value="1">男</Radio>
                          <Radio value="0">女</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    {item.type == 'select' && (
                      <Form.Item name={item.name} label={item.label} rules={item.rules}>
                        <Select>
                          {formSelectArr['fakeArray']?.map((item: any) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.value}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  </React.Fragment>
                );
              })}
            </Form>
          </div>
        </Col>
        <Col span={14}>
          <RobotChatText modalData={robotChatData} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
