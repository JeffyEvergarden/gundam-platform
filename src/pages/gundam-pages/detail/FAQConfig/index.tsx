import clearNum from '@/asset/image/clearnumup.png';
import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Radio, Space, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import Selector from '../../FAQ/question-board/components/selector';
import SelectorModal from '../../FAQ/question-board/components/selector-modal';
import SoundSelectModal from '../../main-draw/drawerV2/components/sound-select-modal';
import SoundVarModal from '../../main-draw/drawerV2/components/sound-var-modal';
import { useFAQModel } from '../model';
import style from './style.less';

const FAQConfig: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const { Item: FormItem, List: FormList } = Form;

  const soundRef = useRef<any>({});
  const auditionRef = useRef<any>({});
  const sType: any = Form.useWatch(['systemConfigList', 'FAQ_INVALID_ANSWER', 'soundType'], form);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const { getTableList, editFAQ, configLoading, getRejectTableList, editRejectTableList } =
    useFAQModel();

  const { info, businessFlowId, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
    getGlobalValConfig: model.getGlobalValConfig,
  }));
  const { getFlowList, _getTreeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    _getTreeData: model.getTreeData,
  }));

  const robotTypeMap = config.robotTypeMap;
  const robotType: any = robotTypeMap[info.robotType] || '语音';

  const [Nconfig, setNConfig] = useState<any>();
  const [switchType, setSwitchType] = useState<boolean>(false);
  const selectModalRef = useRef<any>();
  const opRecordRef = useRef<any>({});

  const getList = async () => {
    await getTableList({ robotId: info.id, configType: 2 }).then((res: any) => {
      // console.log(res);
      setNConfig(res?.data);
      let obj: any = {};
      res?.data?.forEach((item: any) => {
        if (item.dataType == 4) {
          obj[item.configKey] = item.configValue == '1' ? true : false;
        } else {
          obj[item.configKey] = item.configValue;
          if (robotType === '语音') {
            if (item.configKey == 'FAQ_INVALID_ANSWER') {
              obj[item.configKey] = {
                answer: item?.configValue || '',
                soundType: item?.soundType ?? 1,
                allowInterrupt: item?.allowInterrupt ?? 1,
                soundRecordList: item?.soundRecordList || [],
              };
            }
          }
        }
      });

      form.setFieldsValue({ systemConfigList: { ...obj } });
    });
  };

  const getRejectList = async () => {
    await getRejectTableList({ robotId: info.id }).then((res: any) => {
      if (res?.length) {
        form.setFieldsValue({ recommendList: res });
      }
    });
  };

  const submit = async () => {
    console.log(form.getFieldsValue());

    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写项目');
    });
    console.log(res);
    if (!res) {
      return;
    }

    let flag;

    let _res = Nconfig.map((item: any) => {
      Object.keys(res.systemConfigList).forEach((v) => {
        if (item?.configKey == v) {
          if (item.dataType == 4) {
            flag = res.systemConfigList[v];
            item.configValue = res.systemConfigList[v] ? '1' : '0';
          } else {
            item.configValue = res.systemConfigList[v];
            if (robotType === '语音') {
              if (item.configKey == 'FAQ_INVALID_ANSWER') {
                item.configValue = res?.systemConfigList?.[v]?.answer || '';
                item.soundType = res?.systemConfigList?.[v]?.soundType ?? 1;
                item.allowInterrupt = res?.systemConfigList?.[v]?.allowInterrupt ?? 1;
                item.soundRecordList = res?.systemConfigList?.[v]?.soundRecordList || [];
              }
            }
          }
        }
      });
      return item;
    });

    let result1: any = await editFAQ(_res);
    let result2: any;
    if (flag) {
      result2 = await editRejectTableList({
        robotId: info.id,
        faqRejectRecommends: flag ? form.getFieldValue('recommendList') : undefined,
      });
    }

    if (
      (result1?.resultCode === config.successCode && result2?.resultCode === config.successCode) ||
      (result1?.resultCode === config.successCode && !result2)
    ) {
      message.success('成功');
      getList();
      getRejectList();
    } else {
      let str = '';
      if (result1?.resultCode != config.successCode) {
        str += result1?.resultDesc || '';
      }
      if (result2?.resultCode != config.successCode) {
        if (str && result2?.resultDesc) {
          str += ',';
        }
        str += result2?.resultDesc || '';
      }
      message.error(str);
      return;
    }

    // await .then(async (res) => {
    //   if (res) {
    //     getList();
    //   }
    // });
    // await .then((item) => {
    //   if (item) {
    //     getRejectList();
    //   }
    // });
  };

  useEffect(async () => {
    getFlowList(info.id);
    _getTreeData(info.id);
    const _item = form.getFieldsValue();
    if (!_item?.['recommendList']?.length) {
      _item.recommendList = [
        {
          recommendBizType: null,
          recommendId: null,
          recommend: null,
          recommendType: 0,
        },
      ];
      form.setFieldsValue(_item);
    }
    await getList();
    await getRejectList();
  }, []);

  const getRecommendItem = () => {
    const _item = form.getFieldsValue();
    console.log(_item);

    return _item?.['recommendList'] || [];
  };

  // 打开弹窗
  const openModal = (index: number) => {
    const _list = getRecommendItem();
    // 找出被选过的问题  （不能再选，设置为禁用项）
    const disabledQuestionKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType == 1 && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    // 找出被选过的流程  （不能再选，设置为禁用项）
    const disabledFlowKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType == 2 && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);

    // console.log(disabledQuestionKeys, disabledFlowKeys);
    // 编辑模式、要排除自己也不能被选
    // if (questionId) {
    //   disabledQuestionKeys.push(questionId);
    // }
    let openInfo: any = {
      showFlow: true,
      info: _list[index],
      disabledQuestionKeys,
      disabledFlowKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
    };
    // 找到已选的
    if (_list[index]?.questionType == 2) {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (_list[index]?.questionType == 1) {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    }
    (selectModalRef.current as any).open(openInfo);
    // 回调函数，不能重复添加、以及更改后刷新
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      const repeatFlag = _list.findIndex((item: any, i: number) => {
        return (
          i !== index &&
          item.recommendId == obj.recommendId &&
          item.recommendBizType == obj.recommendBizType
        );
      });
      if (repeatFlag > -1) {
        message.warning('已添加过重复');
        return;
      }
      _list[index] = { ...obj };
      form.setFieldsValue({
        recommendList: [..._list],
      });
    };
  };

  const confirm = (obj: any) => {
    console.log(obj);
    opRecordRef.current?.callback?.(obj);
  };

  const intelRecommend = (flag: any, index: number) => {
    console.log(flag);

    let formData: any = form.getFieldsValue();
    formData.recommendList[index].recommendBizType = undefined;
    formData.recommendList[index].recommendId = undefined;
    formData.recommendList[index].recommend = undefined;
    formData.recommendList[index].recommendType = flag ? 1 : 0;

    form.setFieldsValue({ ...formData });
  };

  const tipContent = (title: any) => {
    if (title == '澄清数量上限') {
      return (
        <div style={{ width: '500px' }}>
          当意图识别触发澄清时，此配置控制澄清的数量，当配置3，效果如下图
          <br />
          <img src={clearNum} />
        </div>
      );
    }
  };

  return (
    <div className={style['machine-page']}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form form={form} {...layout}>
          <div className={style['antd-form']}>
            <Space align="baseline">
              <div
                className={style['title_sp']}
                style={{ marginRight: '16px', marginBottom: '20px' }}
              >
                FAQ配置
              </div>
            </Space>

            {Nconfig?.map((item: any) => {
              if (item?.dataType == 1) {
                return (
                  <FormItem label={item.configName}>
                    <Space align="baseline">
                      <FormItem
                        // {...col}
                        noStyle
                        name={['systemConfigList', item.configKey]}
                        key={'systemConfigList' + item.configKey}
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          style={{ width: 200 }}
                          min={item?.validateRule?.min ?? 0}
                          max={item?.validateRule?.max ?? undefined}
                          step="1"
                          precision={0}
                          stringMode
                          disabled={item?.validateRule?.disabled ? true : false}
                        />
                      </FormItem>
                      <Tip title={tipContent(item.configName)} />
                    </Space>
                  </FormItem>
                );
              } else if (item?.dataType == 0) {
                if (
                  item.configKey == 'FAQ_INVALID_ANSWER' &&
                  config.robotTypeMap[info?.robotType] === '语音'
                ) {
                  return (
                    <FormItem
                      label={item.configName}
                      key={item.configName}
                      rules={[{ required: true }]}
                    >
                      <div className={style['diy-box']}>
                        <div className={style['diy-row']}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={style['zy-row']} style={{ paddingBottom: '6px' }}></div>

                            <div id={style['soundType']}>
                              <Form.Item
                                name={['systemConfigList', item.configKey, 'soundType']}
                                key={item.configKey + 'soundType'}
                                initialValue={1}
                              >
                                <Radio.Group>
                                  <Radio value={1}>
                                    全合成
                                    <Tip
                                      title={
                                        '使用“全局配置-TTS配置”对澄清话术进行录音合成，合成后可以在“录音管理”中查看，或者点击“试听”'
                                      }
                                    />
                                  </Radio>
                                  <Radio value={2}>
                                    录音半合成
                                    <Tip
                                      title={
                                        '选择录音进行播报。根据分号拆分文本后，不含变量、词槽的文本段数量要与选择的录音数量一致。例如：“你好；今天是${system_date}”，需要上传一段与“你好”适配的录音，后面一段自动使用TTS合成。'
                                      }
                                    />
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                              <Condition r-if={sType == 2}>
                                <Form.Item
                                  name={['systemConfigList', item.configKey, 'soundRecordList']}
                                  key={item.configKey + 'soundRecordList'}
                                  rules={[{ required: true, message: '请选择' }]}
                                >
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      console.log(form.getFieldsValue());
                                      console.log(sType);

                                      if (sType == 2) {
                                        soundRef?.current?.open(
                                          form.getFieldsValue()['systemConfigList'][item.configKey]
                                            ?.soundRecordList || [],
                                        );
                                      }
                                    }}
                                  >
                                    选择
                                  </Button>
                                </Form.Item>
                              </Condition>
                              <Button
                                type="link"
                                onClick={() => {
                                  console.log(form.getFieldsValue());
                                  auditionRef?.current?.open(
                                    form.getFieldsValue()['systemConfigList'][item.configKey],
                                  );
                                }}
                              >
                                试听
                                <Tip
                                  title={
                                    '根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'
                                  }
                                />
                              </Button>
                              <SoundVarModal cref={auditionRef}></SoundVarModal>
                              <SoundSelectModal
                                cref={soundRef}
                                setform={(list: any, index: any) => {
                                  let formData = form.getFieldsValue();
                                  formData['systemConfigList'][item.configKey].soundRecordList =
                                    list;
                                  formData['systemConfigList'][item.configKey].answer =
                                    list?.[0]?.text;
                                  form.setFieldsValue(formData);
                                  console.log(formData);
                                }}
                                type={'radio'}
                              ></SoundSelectModal>
                            </div>
                          </div>

                          <Form.Item
                            name={['systemConfigList', item.configKey, 'answer']}
                            key={item.configKey + 'answer'}
                            rules={[
                              {
                                message: '请输入',
                                required: true,
                                validateTrigger: 'onBlur',
                              },
                            ]}
                          >
                            <Input.TextArea
                              maxLength={item?.validateRule?.max ?? 200}
                              rows={5}
                              placeholder={'请输入'}
                              showCount
                            />
                          </Form.Item>
                          <Space align="baseline">
                            <Form.Item
                              name={['systemConfigList', item.configKey, 'allowInterrupt']}
                              key={item.configKey + 'allowInterrupt'}
                              initialValue={1}
                              label={'允许打断'}
                            >
                              <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                              </Radio.Group>
                            </Form.Item>
                            <Tip
                              title={
                                '用于控制语音平台在放音过程中是否允许打断，若是，播音过程检测到客户说话，则停止播报进行收音。'
                              }
                            />
                          </Space>
                        </div>
                      </div>
                    </FormItem>
                  );
                }
                if (item.configKey == 'FAQ_REJECT_RECOMMEND_TEXT' && switchType) {
                  return (
                    <FormItem
                      // {...col}
                      label={item.configName}
                      name={['systemConfigList', item.configKey]}
                      key={'systemConfigList' + item.configKey}
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        style={{ width: 300 }}
                        maxLength={item?.validateRule?.max ?? 200}
                      />
                    </FormItem>
                  );
                } else if (item.configKey != 'FAQ_REJECT_RECOMMEND_TEXT') {
                  return (
                    <FormItem
                      // {...col}
                      label={item.configName}
                      name={['systemConfigList', item.configKey]}
                      key={'systemConfigList' + item.configKey}
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        style={{ width: 300 }}
                        maxLength={item?.validateRule?.max ?? 200}
                      />
                    </FormItem>
                  );
                }
              } else if (item?.dataType == 4) {
                return (
                  <FormItem
                    // {...col}
                    label={item.configName}
                    name={['systemConfigList', item.configKey]}
                    key={'systemConfigList' + item.configKey}
                    valuePropName="checked"
                    initialValue={false}
                    shouldUpdate={(prevValues, curValues) => {
                      setSwitchType(curValues?.systemConfigList?.[item.configKey]);
                      return true;
                    }}
                  >
                    <Switch
                      checkedChildren="开启"
                      unCheckedChildren="关闭"
                      onChange={setSwitchType}
                    />
                  </FormItem>
                );
              }
            })}
            <Condition r-show={switchType}>
              <FormList name="recommendList">
                {(fields, { add, remove }) => {
                  const addNew = () => {
                    let length = fields.length;
                    console.log(length);
                    // if (length >= maxRecommendLength) {
                    //   message.warning('推荐设置不能超过faq全局配置限制数量');
                    //   return;
                    // }
                    add(
                      {
                        recommendBizType: null,
                        recommendId: null,
                        recommend: null,
                        recommendType: 0,
                      },
                      length,
                    );
                  };

                  return (
                    <div>
                      {fields.map((field: any, index: number) => {
                        const formData: any = form.getFieldsValue();
                        const intelFlag = formData?.recommendList?.[index]?.recommendType
                          ? true
                          : false;

                        return (
                          <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={
                              index === 0 ? (
                                <span>
                                  <span style={{ color: 'red' }}>*</span> 猜你想问配置
                                </span>
                              ) : (
                                ''
                              )
                            }
                            className={style['faq_zy-row_sp']}
                            // rules={[{ required: true, message: '请选择' }]}
                            key={field.key}
                          >
                            <Space align="baseline">
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className={style['del-bt']}
                                  onClick={() => {
                                    remove(index);
                                  }}
                                />
                              ) : null}
                              <Form.Item
                                name={[field.name, 'recommend']}
                                fieldKey={[field.fieldKey, 'recommend']}
                                key={field.fieldKey + 'recommend'}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: switchType
                                      ? info.robotTypeLabel === 'text'
                                        ? !intelFlag
                                        : true
                                      : false,
                                    message: '请选择',
                                  },
                                ]}
                                // {...field}
                                noStyle
                              >
                                <Selector
                                  disabled={info.robotTypeLabel === 'text' ? intelFlag : false}
                                  openModal={() => {
                                    openModal(index);
                                  }}
                                />
                              </Form.Item>
                              <Condition r-if={info.robotTypeLabel === 'text'}>
                                <span style={{ marginLeft: '16px' }}>智能推荐</span>{' '}
                              </Condition>
                              <Condition r-if={info.robotTypeLabel === 'text'}>
                                <Form.Item
                                  name={[field.name, 'recommendType']}
                                  fieldKey={[field.fieldKey, 'recommendType']}
                                  key={field.fieldKey + 'recommendType'}
                                  valuePropName="checked"
                                  style={{ marginBottom: 0 }}
                                >
                                  <Switch
                                    checkedChildren="开启"
                                    unCheckedChildren="关闭"
                                    onChange={(checked: any) => {
                                      intelRecommend(checked, index);
                                    }}
                                  ></Switch>
                                </Form.Item>
                              </Condition>
                            </Space>
                          </Form.Item>
                        );
                      })}

                      <div className={style['recommend-box']}>
                        <Button
                          type="link"
                          icon={<PlusCircleOutlined />}
                          onClick={addNew}
                          style={{ paddingLeft: 0 }}
                        >
                          新增标准问
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </FormList>
            </Condition>
          </div>
        </Form>
        <Button
          type="primary"
          onClick={submit}
          style={{ alignSelf: 'flex-end' }}
          loading={configLoading}
        >
          保存
        </Button>
        <SelectorModal cref={selectModalRef} confirm={confirm} />
      </div>
    </div>
  );
};
export default FAQConfig;
