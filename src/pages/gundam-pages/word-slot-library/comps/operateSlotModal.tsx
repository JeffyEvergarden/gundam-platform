import Tip from '@/components/Tip';
import config from '@/config/index';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Form, Input, message, Modal, Select, Space, Spin, Tooltip } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { useIntentModel } from '../../wish/wishList/model';
import { useKeyWordModel } from '../model';
import styles from './../../style.less';
import { slotSourceFormList } from './config';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const slotSourceData = [
  { value: 0, intentName: '枚举实体' },
  { value: 4, intentName: '正则实体' },
  { value: 2, intentName: '用户文本' },
  { value: 7, intentName: '接口' },
  // { value: 9, intentName: '图谱' },
];
const typeData = [
  { value: 0, intentName: '文本' },
  { value: 1, intentName: '数值' },
  { value: 2, intentName: '时间' },
  {
    value: 3,
    intentName: '时间(时分秒)',
  },
  //4布尔（后端用）
  {
    value: 5,
    intentName: '数组',
  },
];

const inVal = [
  { value: 0, intentName: '词槽' },
  { value: 1, intentName: '变量' },
];

export default (props: any) => {
  const { visible, title, modalData, onSubmit, onCancel, name } = props;
  const [diffSourceData, setDiffSourceData] = useState<string>(''); // 控制 不同意图来源 显示 不同 的框
  const [spinning, handleSpinning] = useState<boolean>(false);
  const [fieldSelectData, setFieldSelectData] = useState<any>({
    slotSource: slotSourceFormList,
  });
  const [slotSource, setSource] = useState<number>(-1);
  const [form] = Form.useForm();
  const formListVal: any = Form.useWatch(name, form);
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
  const [enumList, setEnumList] = useState<any>([]);
  const [interfaceListInfo, setInterfaceList] = useState<any>([]);
  const [configListData, setconfigList] = useState<any>([]);
  const [slotList, setSlotList] = useState<any>('');
  const [interfaceDesc, setinterfaceDesc] = useState<string>('');
  const [inParams, setInparams] = useState<any>([]);
  const [outVal, setOutVal] = useState<any>([]);
  const [chosePrams, setChoseParams] = useState<any>([]);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useEffect(() => {
    getRealList();
    getEnumList();
    getInterFaceList();
    getConfigList();
    slotInfoList();
    return () => {
      setRealList([]);
      setEnumList([]);
      setInterfaceList([]);
      setconfigList([]);
      setSlotList([]);
      setinterfaceDesc('');
      setInparams([]);
      setOutVal([]);
      setChoseParams([]);
    };
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
          paramListIn({ interfaceId: modalData?.slotInfo?.id, paramType: 0 }, 'edit');
          paramListOut({ interfaceId: modalData?.slotInfo?.id, paramType: 1 });
        }
        form.setFieldsValue({
          slot: modalData?.slot,
          slotName: modalData?.slotName,
          slotDesc: modalData?.slotDesc,
          slotSource: modalData?.slotSource,
          dataType: modalData?.dataType,
          slotSourceId: modalData?.slotSourceId,
          interfaceChangeId: modalData?.slotInfo?.id,
          ruleClips: modalData?.slotInfo?.inputParamList,
          outputParamId: modalData?.slotInfo?.outputParamId,
        });
      }
    }
    if (title == 'add') {
      setSource(-1);
    }
  }, [visible]);

  const getRealList = async () => {
    const res = await getzzReal({ robotId: info.id, entityType: 1 });
    if (res.resultCode === config.successCode) {
      setRealList(res?.data);
    }
  };

  const getEnumList = async () => {
    const res = await getzzReal({ robotId: info.id, entityType: 0 });
    if (res.resultCode === config.successCode) {
      setEnumList(res?.data);
    }
  };

  const getInterFaceList = async () => {
    const res = await interFaceList();
    if (res.resultCode === config.successCode) {
      setInterfaceList(res?.data);
    }
  };

  const paramListIn = async (datas: any, type: string) => {
    const resIn = await getparamList(datas); //入参枚举
    if (resIn.resultCode === config.successCode) {
      setInparams(resIn?.data);
    }
    if (type == 'edit') {
      form.setFieldsValue({
        ruleClips: modalData?.slotInfo?.inputParamList,
      });
    } else if (type == 'change') {
      form.setFieldsValue({
        ruleClips: resIn?.data,
      });
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
    paramListIn({ interfaceId: val, paramType: 0 }, 'change');
    paramListOut({ interfaceId: val, paramType: 1 });
    // setInval_val('');
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
      setconfigList(invalChild?.data);
    } else {
      message.warning(invalChild.resultDesc);
      setconfigList([]);
    }
  };

  const slotInfoList = async () => {
    const invalChild = await getslotInfo({ robotId: info.id }); //入参值
    if (invalChild.resultCode === config.successCode) {
      setSlotList(invalChild?.data);
    } else {
      message.warning(invalChild.resultDesc);
      setSlotList([]);
    }
  };
  // const inValChange = async (val: number, option: any, index: any, el: any) => {
  //   let temp: any = [...inParams];
  //   let inputParamList_temp = [...inputParamList];
  //   if (option.key == 1) {
  //     // setInval_val('变量');
  //     temp[index].inval_val = '变量';
  //     // getConfigList();
  //   } else if (option.key == 0) {
  //     // setInval_val('词槽');
  //     temp[index].inval_val = '词槽';
  //     // slotInfoList();
  //   }
  //   form.setFieldsValue({
  //     sourceType_val: null,
  //   });
  //   setInparams(temp);
  //   inputParamList_temp[index].sourceType = val;
  //   setInputParamList(inputParamList_temp);
  // };

  // const slotOrConfigChange = (val: any, option: any, index: any, el: any) => {
  //   let inputParamList_temp = [...inputParamList];
  //   inputParamList_temp[index].value = val;
  //   setInputParamList(inputParamList_temp);
  // };

  const cancel = () => {
    onCancel();
    // form.resetFields();
    // setInval_val('');
  };

  const submit = async () => {
    const values = await form.validateFields();
    let inputParamListTemp: any = [];
    values?.ruleClips?.map((item: any) => {
      inputParamListTemp.push({
        id: item?.id,
        sourceType: item?.sourceType,
        value: item?.value,
      });
    });
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
        inputParamList: inputParamListTemp,
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
    } else if (value === 9) {
      form?.setFieldsValue({ dataType: 5 });
    } else {
      form?.setFieldsValue({ dataType: 0 });
    }
    form?.setFieldsValue({ slotSourceId: null });
  };

  const outValChange = (value: any, option: any) => {
    form?.setFieldsValue({ dataType: option?.itemObj?.dataType });
  };

  const changeInparams = (val: any) => {
    let temp = [...chosePrams];
    temp.push(val);
    setChoseParams(temp);
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={title == 'add' ? '新增' : '编辑'}
        onCancel={cancel}
        onOk={submit}
        destroyOnClose={true}
        // bodyStyle={{ maxHeight: '800px', overflowY: 'auto' }}
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
                  pattern: /^[a-zA-Z0-9_]+$/g,
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
            <Form.Item label={'槽值来源'}>
              <Space align="baseline">
                <Form.Item name={'slotSource'} noStyle rules={[{ required: true }]}>
                  <Select
                    style={{ width: '275.33px' }}
                    onChange={slotSourceChange}
                    disabled={title == 'edit'}
                  >
                    {slotSourceData?.map((itex: any) => {
                      return (
                        <Option key={itex?.value} value={itex?.value}>
                          {itex?.intentName}
                        </Option>
                      );
                    })}
                    {title == 'edit' && (
                      <Option key={9} value={9}>
                        {'图谱'}
                      </Option>
                    )}
                  </Select>
                </Form.Item>
                <Tip
                  title={
                    '分别为枚举实体、正则实体、用户文本、接口，决定词槽的填充方式。例如来自“用户文本”，会将客户文本填充至词槽；“接口“则会调用配置的接口，将返回值填充至词槽。'
                  }
                />
              </Space>
            </Form.Item>
            <Form.Item label={'数据类型'}>
              <Space align="baseline">
                <Form.Item
                  name={'dataType'}
                  noStyle
                  initialValue={slotSource == 9 ? 5 : slotSource !== 7 ? 0 : null}
                >
                  <Select
                    style={{ width: '275.33px' }}
                    placeholder={''}
                    disabled={slotSource === 7 || title == 'edit' || slotSource === 9}
                  >
                    {typeData?.map((itex: any) => {
                      return (
                        <Option key={itex?.value} value={itex?.value} disabled={itex?.value == 5}>
                          {itex?.intentName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Tip
                  title={
                    <>
                      用于词槽的类型，在连线或对话回应规则中，词槽类型会影响可用的比较逻辑。
                      <br />
                      例如，创建一个数值类型的“money”词槽，在连线规则中会相应出现“大于、小于、等于”的比较逻辑；创建一个字符类型的“city”词槽，在连线规则中会相应出现“包含、不包含”的比较逻辑；创建一个时间类型的“time”词槽，在连线规则中可以出现时间选择的组件。
                    </>
                  }
                />
              </Space>
            </Form.Item>
            {slotSource === 0 && (
              <Form.Item name={'slotSourceId'} label={'枚举实体'} rules={[{ required: true }]}>
                <Select placeholder={''} disabled={title == 'edit'}>
                  {enumList.map((itex: any) => {
                    return (
                      <Option key={itex?.id} value={itex?.id}>
                        {itex?.entityName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {slotSource === 5 && (
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
                <Form.List name="ruleClips">
                  {(fields, { add, remove }) => (
                    <Fragment>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div key={key}>
                          <Form.Item name={[name, 'id']} label={'入参字段名'}>
                            <Select placeholder={''} disabled onChange={changeInparams}>
                              {inParams?.map((itex: any) => {
                                return (
                                  <Option
                                    key={itex?.id}
                                    value={itex?.id}
                                    disabled={chosePrams.includes(itex.id) ? true : false}
                                  >
                                    {itex?.paramName}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item name={[name, 'sourceType']} label={'入参值'}>
                            <Select placeholder={''} disabled={title == 'edit'}>
                              {inVal?.map((itex: any) => {
                                return (
                                  <Option key={itex?.value} value={itex?.value}>
                                    {itex?.intentName}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          {formListVal?.ruleClips?.[index]?.sourceType == 1 && (
                            <Form.Item name={[name, 'value']} label={'变量'}>
                              <Select placeholder={''} disabled={title == 'edit'}>
                                {configListData?.map((itex: any) => {
                                  return (
                                    <Option key={itex?.id} value={itex?.id}>
                                      {itex?.slotName || itex?.configName}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          )}
                          {formListVal?.ruleClips?.[index]?.sourceType == 0 && (
                            <Form.Item name={[name, 'value']} label={'词槽'}>
                              <Select placeholder={''} disabled={title == 'edit'}>
                                {slotList?.map((itex: any) => {
                                  return (
                                    <Option key={itex?.id} value={itex?.id}>
                                      {itex?.slotName || itex?.configName}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          )}
                        </div>
                      ))}
                    </Fragment>
                  )}
                </Form.List>
                {/* {inParams?.map((el: any, index: any) => {
                  return (
                    <Fragment key={index + el.value}>
                      <Form.Item
                        name={'sourceType' + index}
                        label={el?.paramName}
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select
                          placeholder={''}
                          onChange={(val: number, option: any) =>
                            inValChange(val, option, index, el)
                          }
                          disabled={title == 'edit'}
                        >
                          {inVal?.map((itex: any) => {
                            return (
                              <Option key={itex?.value} value={itex?.value}>
                                {itex?.intentName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      {el?.inval_val == '变量' && (
                        <Form.Item
                          name={'sourceType_val' + index}
                          label={el.inval_val}
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          <Select
                            placeholder={''}
                            disabled={title == 'edit'}
                            onChange={(val: number, option: any) =>
                              slotOrConfigChange(val, option, index, el)
                            }
                          >
                            {configListData?.map((itex: any) => {
                              return (
                                <Option key={itex?.id} value={itex?.id}>
                                  {itex?.slotName || itex?.configName}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                      {el?.inval_val == '词槽' && (
                        <Form.Item
                          name={'sourceType_val' + index}
                          label={el.inval_val}
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          <Select
                            placeholder={''}
                            disabled={title == 'edit'}
                            onChange={(val: number, option: any) =>
                              slotOrConfigChange(val, option, index, el)
                            }
                          >
                            {slotList?.map((itex: any) => {
                              return (
                                <Option key={itex?.id} value={itex?.id}>
                                  {itex?.slotName || itex?.configName}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    </Fragment>
                  );
                })} */}
                {/* 
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
                )} */}

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
          </Form>
        </Spin>
      </Modal>
    </React.Fragment>
  );
};
