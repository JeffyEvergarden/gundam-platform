import React, { useState, useEffect, Fragment } from 'react';
import { useModel } from 'umi';
import { Modal, Form, Input, Select, Space, Button, message, Spin, Tooltip } from 'antd';
import { operateSlotFormList, slotSourceFormList } from './config';
import { QuestionCircleFilled } from '@ant-design/icons';
import { useKeyWordModel } from '../model';
import { useIntentModel } from '../../wish/model';
import styles from './../../style.less';
import config from '@/config/index';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

const slotSourceData = [
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
    configList,
    interFaceList,
    getparamList,
    getslotInfo,
  } = useKeyWordModel();
  const { getIntentInfoList, getIntentTableList } = useIntentModel();
  const [realList, setRealList] = useState<any>([]);
  const [interfaceListInfo, setInterfaceList] = useState<any>([]);
  const [inValList, setinValList] = useState<any>([]);
  const [inval_val, setInval_val] = useState<string>('');
  const [interfaceDesc, setinterfaceDesc] = useState<string>('');
  const [inParams, setInparams] = useState<any>([]);
  const [outVal, setOutVal] = useState<any>([]);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useEffect(() => {
    getRealList();
    getInterFaceList();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (title == 'edit') {
        setDiffSourceData(modalData?.slotSource || '');
        setSource(modalData?.slotSource);
        interfaceListInfo?.map((item: any) => {
          if (item.id === modalData?.slotInfo?.id) {
            setinterfaceDesc(item.interfaceDesc);
          }
        });
        if (modalData?.slotInfo?.id) {
          paramListIn({ interfaceId: modalData?.slotInfo?.id, paramType: 0 });
          paramListOut({ interfaceId: modalData?.slotInfo?.id, paramType: 1 });
        }
        if (modalData?.slotInfo?.inputParamList[0]?.sourceType == 1) {
          setInval_val('变量');
          getConfigList();
        } else if (modalData?.slotInfo?.inputParamList[0]?.sourceType == 0) {
          setInval_val('词槽');
          slotInfoList();
        }
        form.setFieldsValue({
          slot: modalData?.slot,
          slotName: modalData?.slotName,
          slotDesc: modalData?.slotDesc,
          slotSource: modalData?.slotSource,
          dataType: modalData?.dataType,
          slotSourceId: modalData?.slotSourceId,
          interfaceChangeId: modalData?.slotInfo?.id,
          inParams:
            modalData?.slotInfo?.inputParamList?.length > 0
              ? modalData?.slotInfo?.inputParamList[0]?.id
              : null,
          sourceType:
            modalData?.slotInfo?.inputParamList?.length > 0
              ? modalData?.slotInfo?.inputParamList[0]?.sourceType
              : null,
          sourceType_val:
            modalData?.slotInfo?.inputParamList?.length > 0
              ? modalData?.slotInfo?.inputParamList[0]?.value
              : null,
          outputParamId: modalData?.slotInfo?.outputParamId,
        });
      }
    }
    if (title == 'add') {
      setSource(0);
    }
  }, [visible]);

  const getRealList = async () => {
    const res = await getzzReal({ robotId: info.id, entityType: 1 });
    if (res.resultCode === config.successCode) {
      setRealList(res?.data);
    }
  };

  const getInterFaceList = async () => {
    const res = await interFaceList();
    if (res.resultCode === config.successCode) {
      setInterfaceList(res?.data);
    }
  };

  const paramListIn = async (datas: any) => {
    const resIn = await getparamList(datas); //入参枚举
    if (resIn.resultCode === config.successCode) {
      setInparams(resIn?.data);
    }
  };
  const paramListOut = async (datas: any) => {
    const resOut = await getparamList(datas); //出参枚举
    if (resOut.resultCode === config.successCode) {
      setOutVal(resOut?.data);
    }
  };

  const interfaceChange = async (val: any, option: any) => {
    setinterfaceDesc(option?.itemobj?.interfaceDesc);
    paramListIn({ interfaceId: val, paramType: 0 });
    paramListOut({ interfaceId: val, paramType: 1 });
    setInval_val('');
    form.setFieldsValue({
      inParams: null,
      sourceType: null,
      sourceType_val: null,
      outputParamId: null,
      dataType: null,
    });
  };

  const getConfigList = async () => {
    const invalChild = await configList({ robotId: info.id, configType: 1 }); //入参值
    if (invalChild.resultCode === config.successCode) {
      setinValList(invalChild?.data);
    } else {
      message.warning(invalChild.resultDesc);
      setinValList([]);
    }
  };

  const slotInfoList = async () => {
    const invalChild = await getslotInfo({ robotId: info.id }); //入参值
    if (invalChild.resultCode === config.successCode) {
      setinValList(invalChild?.data);
    } else {
      message.warning(invalChild.resultDesc);
      setinValList([]);
    }
  };
  const inValChange = async (val: number, option: any) => {
    if (option.key == 1) {
      setInval_val('变量');
      getConfigList();
    } else if (option.key == 0) {
      setInval_val('词槽');
      slotInfoList();
    }
    form.setFieldsValue({
      sourceType_val: null,
    });
  };

  const cancel = () => {
    onCancel();
    // form.resetFields();
    setInval_val('');
  };

  const submit = async () => {
    const values = await form.validateFields();
    let res: any;
    let params: any = {
      robotId: modalData?.robotId,
      slot: values?.slot,
      slotName: values?.slotName,
      slotDesc: values?.slotDesc,
      slotSource: values?.slotSource,
      dataType: values?.dataType,
      slotSourceId: values?.slotSourceId,
      slotInfo: {
        id: values?.interfaceChangeId,
        inputParamList: [
          { id: values?.inParams, sourceType: values?.sourceType, value: values?.sourceType_val },
        ],
        outputParamId: values?.outputParamId,
      },
    };
    handleSpinning(true);
    if (title == 'edit') {
      params.id = modalData.id;
      res = await editWordSlot(params);
    } else if (title == 'add') {
      res = await addWordSlot(params);
    }
    console.log('res', res);
    if (res?.resultCode == config.successCode) {
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
    });
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

  const slotSourceChange = (value: any, option: any) => {
    setSource(value);
    if (value === 7) {
      form?.setFieldsValue({ dataType: null });
    } else {
      form?.setFieldsValue({ dataType: 0 });
    }
  };

  const outValChange = (value: any, option: any) => {
    form?.setFieldsValue({ dataType: option?.itemObj?.dataType });
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
          <Form form={form} {...layout}>
            <Form.Item
              name={'slot'}
              label={'词槽ID'}
              rules={[
                { required: true, message: '请输入名称' },
                { max: 50, min: 1 },
                {
                  pattern: /^[A-zA-Z0-9_]+$/g,
                  message: '仅支持英文大小写、数字与下划线"_"',
                },
              ]}
            >
              <Input
                placeholder={'仅支持英文大小写、数字与下划线"_"'}
                maxLength={50}
                disabled={title == 'edit'}
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
              <Input placeholder={'尽量使用中文'} maxLength={50} />
            </Form.Item>
            <Form.Item name={'slotDesc'} label={'描述'}>
              <TextArea placeholder={'请输入描述'} maxLength={200} rows={4} />
            </Form.Item>
            <Form.Item name={'slotSource'} label={'槽值来源'} rules={[{ required: true }]}>
              <Select onChange={slotSourceChange} disabled={title == 'edit'}>
                {slotSourceData?.map((itex: any) => {
                  return (
                    <Option key={itex?.value} value={itex?.value}>
                      {itex?.intentName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={'dataType'}
              label={'数据类型'}
              initialValue={slotSource !== 7 ? 0 : null}
            >
              <Select placeholder={''} disabled={slotSource === 7 || title == 'edit'}>
                {typeData?.map((itex: any) => {
                  return (
                    <Option key={itex?.value} value={itex?.value}>
                      {itex?.intentName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {/* {slotSource === 1 && (
              <Form.Item name={'slotSourceId'} label={'枚举实体'} rules={[{ required: true }]}>
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
            )} */}
            {slotSource === 4 && (
              <Form.Item name={'slotSourceId'} label={'正则实体'} rules={[{ required: true }]}>
                <Select placeholder={'请选择正则实体'} disabled={title == 'edit'}>
                  {realList?.map((itex: any) => {
                    return (
                      <Option key={itex?.id} value={itex?.id}>
                        {itex?.entityName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {slotSource === 7 && (
              <Fragment>
                <div className={styles.interfaceChangeId_box}>
                  <Form.Item
                    name={'interfaceChangeId'}
                    label={'变量接口'}
                    // rules={[{ required: true }]}
                  >
                    <Select
                      placeholder={'请选择'}
                      onChange={interfaceChange}
                      disabled={title == 'edit'}
                    >
                      {interfaceListInfo?.map((itex: any) => {
                        return (
                          <Option key={itex?.id} value={itex?.id} itemobj={itex}>
                            {itex?.interfaceName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Tooltip title={interfaceDesc}>
                    <span className={styles.information}>
                      <QuestionCircleFilled />
                      接口说明
                    </span>
                  </Tooltip>
                </div>
                <Form.Item name={'inParams'} label={'入参字段名'}>
                  <Select placeholder={''} disabled={title == 'edit'}>
                    {inParams?.map((itex: any) => {
                      return (
                        <Option key={itex?.id} value={itex?.id}>
                          {itex?.paramName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name={'sourceType'} label={'入参值'}>
                  <Select placeholder={''} onChange={inValChange} disabled={title == 'edit'}>
                    {inVal?.map((itex: any) => {
                      return (
                        <Option key={itex?.value} value={itex?.value}>
                          {itex?.intentName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                {inval_val && (
                  <Form.Item name={'sourceType_val'} label={inval_val}>
                    <Select placeholder={''} disabled={title == 'edit'}>
                      {inValList?.map((itex: any) => {
                        return (
                          <Option key={itex?.id} value={itex?.id}>
                            {itex?.slotName || itex?.configName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item name={'outputParamId'} label={'出参字段名'}>
                  <Select placeholder={''} onChange={outValChange} disabled={title == 'edit'}>
                    {outVal?.map((itex: any) => {
                      return (
                        <Option key={itex?.id} value={itex?.id} itemObj={itex}>
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
