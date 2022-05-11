import React from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, Select } from 'antd';

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { visible, modalData, close, save } = props;
  const [form] = Form.useForm();

  const cancel = () => {
    cancel();
  };

  return (
    <Modal
      visible={visible}
      title={'转移到其他意图'}
      footer={null}
      onCancel={cancel}
      destroyOnClose={true}
    >
      <Form form={form} {...layout}>
        <Row>
          <Col span={24}>
            <Form.Item name={'entityName'} label={'样本内容'}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name={'from'} label={'从'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Select disabled>
                <Option key="查询额度" value="查询额度">
                  查询额度
                </Option>
                <Option key="从账户绑定到手动捐款" value="从账户绑定到手动捐款">
                  从账户绑定到手动捐款
                </Option>
                <Option key="临时冻结额度" value="临时冻结额度">
                  临时冻结额度
                </Option>
                <Option key="停催" value="停催">
                  停催
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'to'}
              label={'转移到'}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
            >
              <Select>
                <Option key="查询额度" value="查询额度">
                  查询额度
                </Option>
                <Option key="从账户绑定到手动捐款" value="从账户绑定到手动捐款">
                  从账户绑定到手动捐款
                </Option>
                <Option key="临时冻结额度" value="临时冻结额度">
                  临时冻结额度
                </Option>
                <Option key="停催" value="停催">
                  停催
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
