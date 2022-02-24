import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message } from 'antd';
import { operateSlotFormList, slotSourceFormList } from './config';
import { useTableModel } from '../model';

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { visible, title, modalData, onSubmit, onCancel } = props;
  const [diffSourceData, setDiffSourceData] = useState<string>('');
  const [fieldSelectData, setFieldSelectData] = useState<any>({
    slotSource: slotSourceFormList,
  });
  const [form] = Form.useForm();
  const { addWordSlot, editWordSlot } = useTableModel();
  useEffect(() => {
    if (visible) {
      if (title == 'edit') {
        // form.resetFields();
        setDiffSourceData(modalData?.slotSource || '');
        form.setFieldsValue({
          ...modalData,
        });
      }
    }
  }, [visible]);

  const fieldValueChange = (changedValues: any, allValues: any) => {
    console.log('fieldValueChange', changedValues, allValues);
    if (changedValues?.slotSource) {
      setDiffSourceData(changedValues?.slotSource);
    }
  };

  const cancel = () => {
    form.resetFields();
    onCancel();
  };

  const submit = async () => {
    const values = form.validateFields();
    let res: any;
    let params = form.getFieldsValue();
    if (title == 'edit') {
      res = await editWordSlot({ ...params, robotId: modalData.robotId, id: modalData.id });
    } else if (title == 'add') {
      res = await addWordSlot({ ...params, robotId: modalData.robotId });
    }
    message.info(res?.resultDesc);
    onSubmit();
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={title == 'add' ? '新增' : '编辑'}
        onCancel={cancel}
        footer={null}
      >
        <Form form={form} {...layout} onValuesChange={fieldValueChange}>
          {operateSlotFormList?.map((item: any) => {
            return (
              <React.Fragment key={item.name}>
                {item.type == 'input' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Input placeholder={item.placeholder} />
                  </Form.Item>
                )}
                {item.type == 'select' && item.name !== 'slotSource' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Select placeholder={item.placeholder}>
                      {fieldSelectData[item.name]?.map((itex: any) => {
                        return (
                          <Option key={itex.value} value={itex.value}>
                            {itex.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                {item.type == 'multiSelect' && (
                  <Form.Item name={item.name} label={item.label} rules={item.rules}>
                    <Select placeholder={item.placeholder} mode={'multiple'}>
                      {fieldSelectData[item.name]?.map((itex: any) => {
                        return (
                          <Option key={itex.value} value={itex.value}>
                            {itex.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                {item.name == 'slotSource' && (
                  <React.Fragment>
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Select placeholder={item.placeholder}>
                        {fieldSelectData[item.name]?.map((itex: any) => {
                          return (
                            <Option key={itex.value} value={itex.value}>
                              {itex.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    {diffSourceData == '0' && (
                      <Form.Item name={'entity'} label={'引用词库实体'}>
                        <Select placeholder={item.placeholder} mode={'multiple'}>
                          {fieldSelectData['entity']?.map((itex: any) => {
                            return (
                              <Option key={itex.value} value={itex.value}>
                                {itex.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    {diffSourceData == '1' && (
                      <React.Fragment>
                        <Form.Item name={'intentName'} label={'意图名称'}>
                          <Select placeholder={item.placeholder} mode={'multiple'}>
                            {fieldSelectData['intentName']?.map((itex: any) => {
                              return (
                                <Option key={itex.value} value={itex.value}>
                                  {itex.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item name={'intentValue'} label={'值'}>
                          <Select placeholder={item.placeholder}>
                            {fieldSelectData['intentName']?.map((itex: any) => {
                              return (
                                <Option key={itex.value} value={itex.value}>
                                  {itex.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </React.Fragment>
                    )}
                    {diffSourceData == '2' && (
                      <Form.Item name={'interface'} label={'接口地址'}>
                        <Select placeholder={item.placeholder}>
                          {fieldSelectData['interface']?.map((itex: any) => {
                            return (
                              <Option key={itex.value} value={itex.value}>
                                {itex.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
          <Form.Item {...tailLayout}>
            <Space>
              <Button onClick={cancel}>取消</Button>
              <Button type="primary" onClick={submit}>
                确认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
