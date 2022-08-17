import Condition from '@/components/Condition';
import config from '@/config';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Space, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import Selector from '../../FAQ/question-board/components/selector';
import SelectorModal from '../../FAQ/question-board/components/selector-modal';
import { useFAQModel } from '../model';
import style from './style.less';

const FAQConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const { Item: FormItem, List: FormList } = Form;

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
  const { _getTreeData } = useModel('drawer' as any, (model: any) => ({
    _getTreeData: model.getTreeData,
  }));

  const [Nconfig, setNConfig] = useState<any>();
  const [switchType, setSwitchType] = useState<boolean>(false);
  const selectModalRef = useRef<any>();
  const opRecordRef = useRef<any>({});

  const getList = async () => {
    await getTableList({ robotId: info.id, configType: 2 }).then((res: any) => {
      console.log(res);
      setNConfig(res?.data);
      let obj: any = {};
      res?.data?.forEach((item: any) => {
        if (item.dataType == 4) {
          obj[item.configKey] = item.configValue == '1' ? true : false;
        } else {
          obj[item.configKey] = item.configValue;
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
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写项目');
    });
    if (!res) {
      return;
    }
    let _res = Nconfig.map((item: any) => {
      Object.keys(res.systemConfigList).forEach((v) => {
        console.log(item.configKey, v);
        if (item?.configKey == v) {
          if (item.dataType == 4) {
            item.configValue = res.systemConfigList[v] ? '1' : '0';
          } else {
            item.configValue = res.systemConfigList[v];
          }
        }
      });
      return item;
    });

    let [result1, result2]: any = await Promise.all([
      editFAQ(_res),
      editRejectTableList({
        robotId: info.id,
        faqRejectRecommends: form.getFieldValue('recommendList'),
      }),
    ]);

    if (result1?.resultCode === config.successCode && result2?.resultCode === config.successCode) {
      message.success('成功');
      getList();
      getRejectList();
    } else {
      let str = '';
      if (result1?.resultCode != config.successCode) {
        str += result1?.resultDesc;
      }
      if (result2?.resultCode != config.successCode) {
        if (str) {
          str += ',';
        }
        str += result2?.resultDesc;
      }
      message.error(str);
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

  useEffect(() => {
    _getTreeData(info.id);
    const _item = form.getFieldsValue();
    if (!_item?.['recommendList']?.length) {
      _item.recommendList = [
        {
          recommendBizType: null,
          recommendId: null,
          recommend: null,
          recommendType: 1,
        },
      ];
      form.setFieldsValue(_item);
    }
    getList();
    getRejectList();
  }, []);

  const getRecommendItem = () => {
    const _item = form.getFieldsValue();
    return _item?.['recommendList'] || [];
  };

  // 打开弹窗
  const openModal = (index: number) => {
    const _list = getRecommendItem();
    // 找出被选过的问题  （不能再选，设置为禁用项）
    const disabledQuestionKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '1' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    // 找出被选过的流程  （不能再选，设置为禁用项）
    const disabledFlowKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '2' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);

    // console.log(disabledQuestionKeys, disabledFlowKeys);
    // 编辑模式、要排除自己也不能被选
    // if (questionId) {
    //   disabledQuestionKeys.push(questionId);
    // }
    let openInfo: any = {
      showFlow: false,
      info: _list[index],
      disabledQuestionKeys,
      disabledFlowKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
    };
    // 找到已选的
    if (_list[index]?.questionType === '2') {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (_list[index]?.questionType === '1') {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    }
    (selectModalRef.current as any).open(openInfo);
    // 回调函数，不能重复添加、以及更改后刷新
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      const repeatFlag = _list.findIndex((item: any, i: number) => {
        return (
          i !== index &&
          item.recommendId === obj.recommendId &&
          item.recommendBizType === obj.recommendBizType
        );
      });
      // console.log(repeatFlag, index, obj, _list[repeatFlag]);
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
                  <FormItem
                    // {...col}
                    label={item.configName}
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
                    />
                  </FormItem>
                );
              } else if (item?.dataType == 0) {
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
            <Condition r-if={switchType}>
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
                        recommendType: 1,
                      },
                      length,
                    );
                  };

                  return (
                    <div>
                      {fields.map((field: any, index: number) => {
                        // const currentItem = getItem();
                        // const _showTime = currentItem?.[index]?.timeFlag;
                        return (
                          <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={index === 0 ? <span>猜你想问配置</span> : ''}
                            className={style['faq_zy-row_sp']}
                            // rules={[{ required: true, message: '请选择' }]}
                            key={field.key}
                          >
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
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[{ required: true, message: '请选择' }]}
                              // {...field}
                              noStyle
                            >
                              <Selector
                                openModal={() => {
                                  openModal(index);
                                }}
                              />
                            </Form.Item>
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
