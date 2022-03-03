import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message, Spin } from 'antd';
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
  const [spinning, handleSpinning] = useState<boolean>(false);
  const [fieldSelectData, setFieldSelectData] = useState<any>({
    slotSource: slotSourceFormList,
  });
  const [form] = Form.useForm();
  const { addWordSlot, editWordSlot, getWordSlotDetail } = useKeyWordModel();
  const { getIntentInfoList, getIntentTableList } = useIntentModel();

  const fieldValueChange = (changedValues: any, allValues: any) => {
    if (changedValues?.slotSource) {
      setDiffSourceData(changedValues?.slotSource);
    } else if (changedValues?.allowIntents) {
      let obj = { ...fieldSelectData };
      if (changedValues?.allowIntents.includes('ALL')) {
        form.setFieldsValue({
          allowIntents: ['ALL'],
          nonIntents: ['NULL'],
        });
        // obj.nonIntents = [];
        obj.nonIntents = [
          { value: 'NULL', name: '空', id: 'NULL', intentName: '空' },
          ...obj.normalIntents,
        ];
        obj.allowIntents = [
          { value: 'ALL', name: '所有', id: 'ALL', intentName: '所有' },
          ...obj.normalIntents,
        ];
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
      let obk: any = { ...fieldSelectData };
      if (changedValues?.nonIntents.includes('NULL') || changedValues?.nonIntents?.length == 0) {
        form.setFieldsValue({
          allowIntents: ['ALL'],
          nonIntents: changedValues?.nonIntents?.length == 0 ? [] : ['NULL'],
        });
        obk.nonIntents = [
          { value: 'NULL', name: '空', id: 'NULL', intentName: '空' },
          ...obk.normalIntents,
        ];
        obk.allowIntents = [
          { value: 'ALL', name: '所有', id: 'ALL', intentName: '所有' },
          ...obk.normalIntents,
        ];
        setFieldSelectData(obk);
      } else {
        let obj = { ...fieldSelectData };
        let arr: any = obj?.allowIntents?.filter((item: any) => {
          return !changedValues?.nonIntents?.includes(item?.value || item?.id);
        });
        obj.allowIntents = [...arr];
        setFieldSelectData(obj);
      }
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
    console.log('params', params);
    let newValue = form.getFieldValue('intentValue');
    let newName = form.getFieldValue('intentName');
    let newAllIntentValue = form.getFieldValue('allowIntents');
    let newNonIntentValue = form.getFieldValue('nonIntents');
    // 拼接 意图 值
    let newObj = {
      [newValue]: newName,
    };
    console.log('111', newAllIntentValue, newNonIntentValue);
    handleSpinning(true);
    if (title == 'edit') {
      res = await editWordSlot({
        ...params,
        robotId: modalData.robotId,
        id: modalData.id,
        slotInfos: newObj,
        allowIntents: newAllIntentValue?.length > 0 ? newAllIntentValue : ['ALL'],
        nonIntents: newNonIntentValue?.length > 0 ? newNonIntentValue : ['NULL'],
      });
    } else if (title == 'add') {
      res = await addWordSlot({
        ...params,
        robotId: modalData.robotId,
        slotInfos: newObj,
        allowIntents: newAllIntentValue?.length > 0 ? newAllIntentValue : ['ALL'],
        nonIntents: newNonIntentValue?.length > 0 ? newNonIntentValue : ['NULL'],
      });
    }
    console.log('res', res);
    if (res?.resultCode == '100') {
      message.success(res?.resultDesc);
      onSubmit();
    } else {
      message.error(res?.resultDesc || '失败');
    }
    handleSpinning(false);
  };

  const getIntentSelList = async () => {
    const res: any = await getIntentInfoList({
      robotId: modalData?.robotId,
      headIntent: 0,
    });
    console.log(res?.datas);
    // const res: any = await getIntentTableList();
    let arr: any = { ...fieldSelectData };
    if (res?.datas) {
      let data: any =
        res?.datas &&
        res?.datas?.map((item: any) => {
          return {
            ...item,
          };
        });
      arr.allowIntents = [{ value: 'ALL', name: '所有', id: 'ALL', intentName: '所有' }, ...data];
      arr.nonIntents = [{ value: 'NULL', name: '空', id: 'NULL', intentName: '空' }, ...data];
      arr.normalIntents = [...data];
      arr.intentName = [...data];
      setFieldSelectData(arr);
    } else {
      arr.allowIntents = [];
      arr.nonIntents = [];
      arr.normalIntents = [];
      arr.intentName = [];
      setFieldSelectData(arr);
    }
  };

  const getEditSlotData = async (id: any) => {
    handleSpinning(true);
    const res = await getWordSlotDetail({ id: id });
    if (res?.resultCode == '100') {
      let data = res?.datas?.[0];
      let newIntentName = Object.keys(data?.slotInfos)?.[0] || '';
      let newIntentValue: any = Object.values(data?.slotInfos)?.[0] || [];
      console.log(
        '意图值',
        newIntentName,
        typeof newIntentName,
        '意图名称',
        newIntentValue,
        typeof newIntentValue,
      );
      form.setFieldsValue({
        ...data,
        intentName: [...newIntentValue], // 意图名称
        intentValue: newIntentName, // 值
      });
    }
    handleSpinning(false);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      getIntentSelList();
      if (title == 'edit') {
        setDiffSourceData(modalData?.slotSource || '');
        getEditSlotData(modalData?.id);
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
        <Spin spinning={spinning}>
          <Form form={form} {...layout} onValuesChange={fieldValueChange}>
            {operateSlotFormList?.map((item: any) => {
              return (
                <React.Fragment key={item.name}>
                  {item.type == 'input' && (
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Input placeholder={item.placeholder} maxLength={200} />
                    </Form.Item>
                  )}
                  {item.type == 'select' && item.name !== 'slotSource' && (
                    <Form.Item name={item.name} label={item.label} rules={item.rules}>
                      <Select placeholder={item.placeholder}>
                        {fieldSelectData[item.name]?.map((itex: any) => {
                          return (
                            <Option
                              key={itex?.value || itex?.intentName}
                              value={itex?.value || itex?.intentName}
                            >
                              {itex?.name || itex?.intentName}
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
                            <Option key={itex?.id} value={itex?.id}>
                              {itex?.intentName}
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
                          <Form.Item
                            name={'intentName'}
                            label={'意图名称'}
                            rules={[{ required: true, message: '请选择意图' }]}
                          >
                            <Select placeholder={item.placeholder} mode={'multiple'}>
                              {fieldSelectData['intentName']?.map((itex: any) => {
                                return (
                                  <Option
                                    key={itex?.value || itex?.intentName}
                                    value={itex?.value || itex?.intentName}
                                  >
                                    {itex?.name || itex?.intentName}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={'intentValue'}
                            label={'值'}
                            rules={[{ required: true, message: '请输入意图' }]}
                          >
                            <Input placeholder={'请输入值'} maxLength={200} />
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
        </Spin>
      </Modal>
    </React.Fragment>
  );
};
