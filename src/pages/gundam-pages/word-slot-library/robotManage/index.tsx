import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Input, Radio, Select, Space, Button } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { robotChatFormList } from './config';
import RobotChatText from './chatText';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default (props: any) => {
  const [form] = Form.useForm();
  const [formSelectArr, setFormSelectArr] = useState<any>({
    fakeArray: [
      {
        value: 'fake',
        name: 'fake',
      },
    ],
  });
  const [robotChatData, setRobotChatData] = useState<any>({});
  const [robotShowFlag, setRobotShowFlag] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue({
      customerName: '孙悟空',
      sex: '0',
      telephone: '0',
      callLine: '南天门',
      voice: '凄惨',
      judicialState: '通缉',
      judicialChannel: '天庭',
      overdueDays: '500',
      overdueNumber: '999',
      genderName: '秃驴',
      customerType: '佛门',
      settledAmount: '0',
      overdueMoney: '999',
    });
  }, []);

  const showChatText = async () => {
    const values = await form.validateFields();
    const data = form.getFieldsValue();
    let newData = { ...data };
    setRobotChatData(newData);
    setRobotShowFlag(true);
  };

  return (
    <React.Fragment>
      <Row gutter={24}>
        <Col span={12}>
          <Card>
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
              <Form.Item {...tailLayout}>
                <Button icon={<CommentOutlined />} onClick={showChatText}>
                  文本
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <RobotChatText visible={robotShowFlag} modalData={robotChatData} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
