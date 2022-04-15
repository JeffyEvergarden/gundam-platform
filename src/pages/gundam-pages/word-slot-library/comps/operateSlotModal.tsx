import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Form, Input, Select, Space, Button, message, Spin, Tooltip } from 'antd';
import { operateSlotFormList, slotSourceFormList } from './config';
import { QuestionCircleFilled } from '@ant-design/icons';
import { useKeyWordModel } from '../model';
import { useIntentModel } from '../../wish/model';
import styles from './../../style.less';

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

const slotSourceData = [
  // { value: 1, intentName: '枚举实体' },
  { value: 4, intentName: '正则实体' },
  { value: 2, intentName: '用户文本' },
  { value: 7, intentName: '接口' },
];
const typeData = [
  { value: 0, intentName: '文本' },
  { value: 1, intentName: '数值' },
  { value: 2, intentName: '时间' },
];

const slotPro = [
  { value: 1, intentName: '贷款产品' },
  { value: 2, intentName: '词库管理的所有枚举实体' },
];

const inVal = [
  { value: 0, intentName: '词槽' },
  { value: 1, intentName: '变量' },
];

export default (props: any) => {
  const { visible, title, modalData, onSubmit, onCancel } = props;
  const [diffSourceData, setDiffSourceData] = useState<string>(''); // 控制 不同意图来源 显示 不同 的框
  const [spinning, handleSpinning] = useState<boolean>(false);
  const [fieldSelectData, setFieldSelectData] = useState<any>({
    slotSource: slotSourceFormList,
  });
  const [slotSource, setSource] = useState<number>(0);
  const [form] = Form.useForm();
  const {
    addWordSlot,
    editWordSlot,
    getWordSlotDetail,
    getzzReal,
    interFaceList,
    getparamList,
    getslotInfo,
  } = useKeyWordModel();
  const { getIntentInfoList, getIntentTableList } = useIntentModel();
  const [realList, setRealList] = useState<any>([]);
  const [interfaceList, setInterfaceList] = useState<any>([]);
  const [inValList, setinValList] = useState<any>([]);
  const [inval_val, setInval_val] = useState<string>('');
  const [interfaceDesc, setinterfaceDesc] = useState<string>('');
  const [inParams, setInparams] = useState<any>([]);
  const [outVal, setOutVal] = useState<any>([]);

  useEffect(() => {
    getRealList();
    getInterFaceList();
  }, [visible]);

  const getRealList = async () => {
    const res = await getzzReal();
    if (res.resultCode === '0000') {
      setRealList(res?.data);
    }
  };

  const getInterFaceList = async () => {
    const res = await interFaceList();
    if (res.resultCode === '0000') {
      setInterfaceList(res?.data);
    }
  };

  const interfaceChange = async (val: any, option: any) => {
    interfaceList.map((item: any) => {
      if (option.key == item.id) {
        setinterfaceDesc(item.interfaceDesc);
      }
    });

    const resIn = await getparamList({ interfaceId: val, paramType: 0 }); //入参枚举
    if (resIn.resultCode === '0000') {
      setInparams(resIn?.data);
    }

    const resOut = await getparamList({ interfaceId: val, paramType: 1 }); //出参枚举
    if (resOut.resultCode === '0000') {
      setOutVal(resOut?.data);
    }
  };

  const inValChange = async (val: number) => {
    if (val == 1) {
      setInval_val('变量');
    } else setInval_val('词槽');

    const invalChild = await getslotInfo({ interfaceId: val, paramType: 1 }); //入参值
    if (invalChild.resultCode === '0000') {
      setinValList(invalChild?.data);
    }
  };

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
      // headIntent: 0,
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
    setSource(0);
  }, [visible]);

  const slotSourceChange = (value: any, option: any) => {
    setSource(value);
  };

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
            <Form.Item
              name={'slotId'}
              label={'词槽ID'}
              rules={[
                { required: true, message: '请输入名称' },
                { max: 50, min: 1 },
                {
                  pattern: /^[A-zA-Z0-9_\-]+$/g,
                  message: '仅支持英文大小写、数字与下划线"_"',
                },
              ]}
            >
              <Input
                placeholder={'仅支持英文大小写、数字与下划线"_"'}
                maxLength={50}
                readOnly={title == 'edit'}
              />
            </Form.Item>
            <Form.Item
              name={'slotName'}
              label={'词槽名称'}
              rules={[
                { required: true, message: '请输入名称' },
                { max: 50, min: 1 },
              ]}
            >
              <Input placeholder={'尽量使用中文'} maxLength={50} readOnly={title == 'edit'} />
            </Form.Item>
            <Form.Item name={'slotSource'} label={'槽值来源'} rules={[{ required: true }]}>
              <Select onChange={slotSourceChange}>
                {slotSourceData.map((itex: any) => {
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
            <Form.Item name={'type'} label={'数据类型'} rules={[{ required: true }]}>
              <Select placeholder={''}>
                {typeData.map((itex: any) => {
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
            {slotSource === 1 && (
              <Form.Item name={'slotPro'} label={'枚举实体'} rules={[{ required: true }]}>
                <Select placeholder={''}>
                  {slotPro.map((itex: any) => {
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
            {slotSource === 4 && (
              <Form.Item name={'zzReal'} label={'正则实体'} rules={[{ required: true }]}>
                <Select placeholder={''}>
                  {realList.map((itex: any) => {
                    return (
                      <Option key={itex?.id} value={itex?.entityName}>
                        {itex?.entityName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {slotSource === 7 && (
              <Fragment>
                <Form.Item name={'changeData'} label={'变量接口'} rules={[{ required: true }]}>
                  <Select placeholder={'请选择'} onChange={interfaceChange}>
                    {interfaceList.map((itex: any) => {
                      return (
                        <Option key={itex.id} value={itex?.interFaceName}>
                          {itex?.interFaceName}
                        </Option>
                      );
                    })}
                  </Select>
                  <Tooltip title={interfaceDesc}>
                    <span className={styles.information}>
                      <QuestionCircleFilled />
                      接口说明
                    </span>
                  </Tooltip>
                </Form.Item>
                <Form.Item name={'inParams'} label={'入参字段名'} rules={[{ required: true }]}>
                  <Select placeholder={''}>
                    {inParams.map((itex: any) => {
                      return (
                        <Option key={itex?.paramValue} value={itex?.paramName}>
                          {itex?.paramName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name={'inVal'} label={'入参值'} rules={[{ required: true }]}>
                  <Select placeholder={''} onChange={inValChange}>
                    {inVal.map((itex: any) => {
                      return (
                        <Option key={itex?.id} value={itex?.intentName}>
                          {itex?.intentName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                {inval_val && (
                  <Form.Item name={'inValList'} label={inval_val} rules={[{ required: true }]}>
                    <Select placeholder={''}>
                      {inValList.map((itex: any) => {
                        return (
                          <Option key={itex?.paramValue} value={itex?.paramName}>
                            {itex?.paramName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item name={'outVal'} label={'出参字段名'} rules={[{ required: true }]}>
                  <Select placeholder={''}>
                    {outVal.map((itex: any) => {
                      return (
                        <Option key={itex?.paramValue} value={itex?.paramName}>
                          {itex?.paramName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Fragment>
            )}
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
