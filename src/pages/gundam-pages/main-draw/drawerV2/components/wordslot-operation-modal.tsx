import Condition from '@/components/Condition';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import styles from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const InnerForm: React.FC<any> = (props: any) => {
  const { name, form, title } = props;

  return (
    <div>
      <FormItem label={title} className={styles['require']}></FormItem>
      <Form.List name={name}>
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            console.log(length);
            add(
              {
                typeOne: '',
                oneValue: '',
                operator: '',
                typeTwo: '',
                twoValue: '',
                acceptType: '',
                acceptValue: '',
              },
              length,
            );
          };
          return (
            <div>
              <div>
                <Row
                  align="middle"
                  style={{ marginBottom: '8px', textAlign: 'center' }}
                  gutter={[8, 4]}
                >
                  <Col span={2}>类型1</Col>
                  <Col span={4}>运算值1</Col>
                  <Col span={4}>运算符</Col>
                  <Col span={2}>类型2</Col>
                  <Col span={4}>运算值2</Col>
                  <Col span={2}>接受类型</Col>
                  <Col span={4}>接受值</Col>
                  <Col span={2}></Col>
                </Row>
              </div>
              {fields.map((field, index) => {
                return (
                  <Row key={index} align="middle" style={{ marginBottom: '8px' }} gutter={[8, 4]}>
                    <Col span={2}>
                      <FormItem name={[field.name, 'typeOne']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem name={[field.name, 'oneValue']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem name={[field.name, 'operator']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <FormItem name={[field.name, 'typeTwo']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem name={[field.name, 'twoValue']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <FormItem name={[field.name, 'acceptType']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem name={[field.name, 'acceptValue']} noStyle>
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      {/* 删除按钮 */}
                      <Condition r-if={fields.length > 1}>
                        <MinusCircleOutlined
                          style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </Condition>
                    </Col>
                  </Row>
                );
              })}
              <div>
                <Button
                  type="link"
                  icon={<AppstoreAddOutlined />}
                  // style={{ marginLeft: '10px' }}
                  onClick={addNew}
                >
                  新增
                </Button>
              </div>
            </div>
          );
        }}
      </Form.List>
    </div>
  );
};

export default InnerForm;
