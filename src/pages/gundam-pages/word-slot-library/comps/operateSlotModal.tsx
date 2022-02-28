import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message } from 'antd';
import { operateSlotFormList, slotSourceFormList } from './config';
import { useKeyWordModel } from '../model';
import { useIntentModel } from '../../wish/model';

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
  const [diffSourceData, setDiffSourceData] = useState<string>(''); // 控制 不同意图来源 显示 不同 的框
  const [fieldSelectData, setFieldSelectData] = useState<any>({
    slotSource: slotSourceFormList,
  });
  const [form] = Form.useForm();
  const { addWordSlot, editWordSlot } = useKeyWordModel();
  const { getIntentInfoList } = useIntentModel();

  const fieldValueChange = (changedValues: any, allValues: any) => {
    if (changedValues?.slotSource) {
      setDiffSourceData(changedValues?.slotSource);
    } else if (changedValues?.allowIntents) {
      let obj = { ...fieldSelectData };
      if (changedValues?.allowIntents.includes('ALL')) {
        form.setFieldsValue({
          allowIntents: ['ALL'],
          nonIntents: [],
        });
        obj.nonIntents = [];
        obj.allowIntents = [{ value: 'ALL', name: '所有', id: 'ALL' }, ...obj.normalIntents];
        setFieldSelectData(obj);
      } else {
        let newArr =
          changedValues?.allowIntents?.length == 0 ? obj?.normalIntents : obj?.nonIntents;
        let arr: any = newArr?.filter((item: any) => {
          return !changedValues?.allowIntents?.includes(item?.value || item?.id);
        });
        obj.nonIntents = [...arr];
        setFieldSelectData(obj);
      }
    } else if (changedValues?.nonIntents) {
      let obj = { ...fieldSelectData };
      let arr: any = obj?.allowIntents?.filter((item: any) => {
        return !changedValues?.nonIntents?.includes(item?.value || item?.id);
      });
      obj.allowIntents = [...arr];
      setFieldSelectData(obj);
    }
  };

  const cancel = () => {
    form.resetFields();
    onCancel();
  };

  const submit = async () => {
    const values = await form.validateFields();
    let res: any;
    let params = form.getFieldsValue();

    let newValue = form.getFieldValue('intentValue');
    let newName = form.getFieldValue('intentName');
    // 拼接 意图 值
    let newObj = {
      [newValue]: newName,
    };
    if (title == 'edit') {
      res = await editWordSlot({
        ...params,
        robotId: modalData.robotId,
        id: modalData.id,
        slotInfos: newObj,
      });
    } else if (title == 'add') {
      res = await addWordSlot({ ...params, robotId: modalData.robotId, slotInfos: newObj });
    }
    message.info(res?.resultDesc || '正在处理');
    if (res?.code == 100) {
      onSubmit();
    }
  };

  const getIntentSelList = async () => {
    const res: any = await getIntentInfoList();
    let data: any =
      res?.datas &&
      res?.datas?.map((item: any) => {
        return {
          value: item.id,
          name: item.intentName,
          id: item.id,
        };
      });
    let arr: any = { ...fieldSelectData };

    arr.allowIntents = [{ value: 'ALL', name: '所有', id: 'ALL' }, ...data];
    arr.nonIntents = data;
    arr.normalIntents = data;
    arr.intentName = data;
    setFieldSelectData(arr);
  };

  useEffect(() => {
    if (visible) {
      getIntentSelList();
      if (title == 'edit') {
        // form.resetFields();
        setDiffSourceData(modalData?.slotSource || '');
        form.setFieldsValue({
          ...modalData,
        });
      }
    }
  }, [visible]);

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
                      {fieldSelectData[item?.name]?.map((itex: any) => {
                        return (
                          <Option key={itex.value || item.id} value={itex?.value}>
                            {itex?.name || itex?.intentName || itex}
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
                          <Input />
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
