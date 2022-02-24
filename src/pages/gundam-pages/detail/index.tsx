import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Table, Button } from 'antd';
import { Form, Row, Col, Space, Input, Select, Divider, InputNumber, Popconfirm } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { useConfigModel } from './model';

const { Item: FormItem } = Form;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 11 },
};

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const { configMsg, configLoading, getRobotConfig, editRobotConfig } = useConfigModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const getConfig = async () => {
    let data = await getRobotConfig({ robotId: info.id });
    form.setFieldsValue({ ...data });
  };

  const addConfig = () => {
    const tempChildrenList = form.getFieldValue('childrenList') || [];
    tempChildrenList.push({
      configValue: undefined,
      configName: undefined,
      configDesc: undefined,
    });

    form.setFieldsValue({
      childrenList: [...tempChildrenList],
    });
  };

  const submit = async () => {
    console.log(form.getFieldsValue());
    let reqData = form.getFieldsValue();
    await editRobotConfig(reqData).then((res) => {
      if (res.resultCode == 100) {
        getConfig();
      }
    });
  };

  useEffect(() => {
    console.log(info);

    let formData = form.getFieldsValue();
    getConfig();
    if (!formData.childrenList?.length) {
      addConfig();
    }
  }, []);
  return (
    <div className={style['machineDetail-page']}>
      <Form form={form} {...layout}>
        <Row>
          <Col>
            <span style={{ fontSize: '24px' }}>机器人配置</span>
          </Col>
        </Row>
        <Divider type="horizontal" />

        <FormItem name="silencecToDeal" label="静默处理响应话术" {...layout}>
          <Input></Input>
        </FormItem>
        <FormItem name="refuseToDeal" label="拒识处理响应话术" {...layout}>
          <Input></Input>
        </FormItem>
        <Row>
          <Col>
            <span style={{ fontSize: '18px' }}>澄清配置</span>
          </Col>
        </Row>
        <Divider type="horizontal" />
        <Condition r-if={info.robotType == 1}>
          <FormItem name="threshold" label="阈值" {...layout}>
            <InputNumber style={{ width: 200 }} min="0" max="1" step="0.01" />
          </FormItem>
          <FormItem name="thresholdGap" label="得分差值" {...layout}>
            <InputNumber style={{ width: 200 }} min="0" max="1" step="0.01" />
          </FormItem>
          <FormItem name="clearToDeal" label="澄清话术" {...layout}>
            <Input></Input>
          </FormItem>
        </Condition>
        <Condition r-if={info.robotType == 0}>
          <FormItem name="maxThreshold" label="最大阈值" {...layout}>
            <InputNumber style={{ width: 200 }} min="0" max="1" step="0.01" />
          </FormItem>
          <FormItem name="minThreshold" label="最小阈值" {...layout}>
            <InputNumber style={{ width: 200 }} min="0" max="1" step="0.01" />
          </FormItem>
          <FormItem name="clearToDeal" label="澄清话术" {...layout}>
            <Input></Input>
          </FormItem>
        </Condition>
        <Row>
          <Col>
            <span style={{ fontSize: '18px' }}>全局变量配置</span>
          </Col>
        </Row>
        <Divider type="horizontal" />

        <Button
          type={'primary'}
          onClick={() => {
            addConfig();
          }}
          style={{ marginBottom: '16px' }}
        >
          添加变量
        </Button>

        <FormItem label={' '} {...col} colon={false}>
          <Form.List name="childrenList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={index}>
                    <Space align="baseline">
                      <FormItem
                        // {...col}
                        label={'变量值'}
                        name={[field.name, 'configValue']}
                        key={field.fieldKey + 'configValue'}
                        fieldKey={[field.fieldKey, 'configValue']}
                      >
                        <Input />
                      </FormItem>
                      <FormItem
                        // {...col}
                        label={'变量名称'}
                        name={[field.name, 'configName']}
                        key={field.fieldKey + 'configName'}
                        fieldKey={[field.fieldKey, 'configName']}
                      >
                        <Input />
                      </FormItem>
                      <FormItem
                        // {...col}
                        label={'变量描述'}
                        name={[field.name, 'configDesc']}
                        key={field.fieldKey + 'configDesc'}
                        fieldKey={[field.fieldKey, 'configDesc']}
                      >
                        <Input />
                      </FormItem>

                      <Popconfirm
                        title="确定要删除该变量吗?"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                          remove(index);
                        }}
                      >
                        <MinusCircleFilled />
                      </Popconfirm>
                    </Space>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </FormItem>
      </Form>

      <div className={style['footer']}>
        <Button onClick={submit} type={'primary'}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default DetailPages;
