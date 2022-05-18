import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, Select } from 'antd';
import { useModel } from 'umi';

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

  const { _wishList, getWishList } = useModel('drawer' as any, (model: any) => ({
    _wishList: model._wishList || [],
    getWishList: model.getWishList, // 业务流程列表
  }));

  useEffect(() => {
    visible && getWishList(modalData?.robotId);
    visible &&
      form.setFieldsValue({
        corpusText: modalData?.corpusText,
        preIntent: modalData?.intentId,
        nextIntent: null,
      });
  }, [visible]);

  const onCancel = () => {
    close();
  };

  const submit = async () => {
    const values = await form.validateFields();
    save(values);
  };

  return (
    <Modal
      visible={visible}
      title={'转移到其他意图'}
      onCancel={onCancel}
      onOk={submit}
      destroyOnClose={true}
    >
      <Form form={form} {...layout}>
        <Row>
          <Col span={24}>
            <Form.Item name={'corpusText'} label={'样本内容'}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name={'preIntent'}
              label={'从'}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Select disabled>
                {_wishList?.map((itex: any, index: number) => {
                  return (
                    <Option key={itex.name} value={itex.name} opt={itex}>
                      {itex.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'nextIntent'}
              label={'转移到'}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
            >
              <Select>
                {_wishList?.map((itex: any, index: number) => {
                  return (
                    <Option key={itex.name} value={itex.name} opt={itex}>
                      {itex.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
