import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Cascader, Form, Input, Radio, Select, Space } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import LabelSelect from '../../drawer/components/label-select';
import CvsForm from '../components/cvs-form';
import CvsInput from '../components/cvs-input';
import SoundSelectModal from '../components/sound-select-modal';
import SoundVarModal from '../components/sound-var-modal';
import { ACTION_LIST, ACTION_LIST_TEXT } from '../const';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ActionConfig = (props: any) => {
  const {
    name,
    title,
    formName: _formName,
    form,
    maxlength = 1000,
    titleType = 1,
    canEdit,
    deep = true,
  } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { drawType, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    businessFlowId: model.businessFlowId,
    drawType: model.drawType, // 画布类型
  }));

  const [num, setNum] = useState<number>(1);
  const [inputType, setInputType] = useState<any>('10');
  const soundRef = useRef<any>();
  const auditionRef = useRef<any>();
  const sType: any = Form.useWatch(deep ? name : _formName[0], form);

  const update = useCallback(() => {
    setNum(num + 1);
  }, [num]);

  const getFormName = (text: any) => {
    let lastVal = text[text.length - 1];
    text = deep ? text : [lastVal];
    if (name !== undefined) {
      if (name instanceof Array) {
        let slicename = name;
        return [...slicename, ...text];
      } else {
        return [name, ...text];
      }
    } else {
      return text;
    }
  };

  useEffect(() => {
    console.log(sType);
  }, [sType]);

  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList,
  }));

  const { flowList, messageList, wordSlotList } = useModel('drawer' as any, (model: any) => ({
    messageList: model._messageList,
    wordSlotList: model._wordSlotList,
    flowList: model._flowList,
  }));

  const cascaderList: any = useMemo(() => {
    const options: any[] = [
      {
        value: 1,
        label: '变量',
        children: globalVarList.map((item: any) => {
          return {
            value: item.name,
            label: item.label,
          };
        }),
        disabled: !globalVarList.length,
      },
      {
        value: 2,
        label: '词槽',
        children: wordSlotList.map((item: any) => {
          return {
            value: item.name,
            label: item.label,
          };
        }),
        disabled: !wordSlotList.length,
      },
    ];
    return options;
  }, [wordSlotList, globalVarList]);

  const isArray = Array.isArray(_formName); // 数组
  const key = isArray ? _formName[0] : _formName; // 首字段

  const getItem = () => {
    let item: any = form?.getFieldsValue?.() || {};
    if (isArray) {
      _formName.forEach((key: any, index: number) => {
        if (index === 0) {
          item = form.getFieldValue(key);
        } else {
          item = item?.[key] || {};
        }
      });
      // 获取到对象
    } else {
      item = form.getFieldValue(_formName);
    }
    return item;
  };

  const currentItem = getItem();
  const _actionType = deep ? currentItem?.action?.actionType : currentItem?.actionType;
  // console.log('--------', currentItem, _actionType);

  const change = (val: any, opt: any) => {
    const item = getItem();
    if (deep) {
      item.action.toFlowId = undefined;
      item.action.actionText = undefined;
      item.action.textLabels = [];
      if (opt?.opt?.allowInterrupt && config.robotTypeMap[info?.robotType] === '语音') {
        item.action.allowInterrupt = 0;
      }
    } else {
      item.toFlowId = undefined;
      item.actionText = undefined;
      item.textLabels = [];
      if (opt?.opt?.allowInterrupt && config.robotTypeMap[info?.robotType] === '语音') {
        item.allowInterrupt = 0;
      }
    }

    const list = form.getFieldValue(key);
    if (isArray && list instanceof Array) {
      form.setFieldsValue({
        [key]: [...list],
      });
    } else {
      // console.log(form.getFieldValue());
      // console.log('change:', key, item);
      form.setFieldsValue({
        [key]: {
          ...item,
        },
      });
      update();
    }
  };

  const changeItem = (opt: any, index: number) => {
    const item = getItem();
    const currenItem = item?.messageList?.[index];
    let obj = opt?.opt;
    if (!currenItem) {
      return;
    }
    currenItem.placeholder = obj?.placeholder;
    currenItem.content = obj?.content;
    update();
  };

  const _flowdisabled = drawType === 'business';

  const sound = () => {
    return config.robotTypeMap[info?.robotType] === '语音' ? (
      <div style={{ display: 'flex' }}>
        <Form.Item
          name={getFormName(['action', 'soundType'])}
          fieldKey={getFormName(['action', 'soundType'])}
          initialValue={1}
        >
          <Radio.Group
            disabled={canEdit}
            onChange={() => {
              console.log(sType);
              console.log(currentItem);
            }}
          >
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
        <Condition r-if={deep ? currentItem?.action?.soundType == 2 : currentItem?.soundType == 2}>
          <Form.Item
            name={getFormName(['action', 'soundRecordList'])}
            fieldKey={getFormName(['action', 'soundRecordList'])}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Button
              type="link"
              onClick={() => {
                console.log(currentItem);
                // if (sType?.action?.soundType == 2) {
                soundRef?.current?.open(
                  deep
                    ? currentItem?.action?.soundRecordList || []
                    : currentItem?.soundRecordList || [],
                );
                // }
              }}
            >
              选择
            </Button>
          </Form.Item>
        </Condition>
        <Button
          type="link"
          onClick={() => {
            let formData = getItem();
            auditionRef?.current?.open(deep ? formData.action : formData);
          }}
        >
          试听
          <Tip title={'根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'} />
        </Button>
        <SoundVarModal cref={auditionRef}></SoundVarModal>
        <SoundSelectModal
          cref={soundRef}
          setform={(list: any) => {
            if (deep) {
              let formData = getItem();
              console.log(formData);
              formData.action.soundRecordList = list || [];
              formData.action.actionText = list?.map((item: any) => item?.text)?.join(';');
              form.setFieldsValue({ ...formData });
            } else {
              let formData = getItem();
              console.log(formData);
              formData.soundRecordList = list || [];
              formData.actionText = list?.map((item: any) => item?.text)?.join(';');
              form.setFieldsValue({ ...formData });
            }
          }}
        ></SoundSelectModal>
      </div>
    ) : (
      <></>
    );
  };

  useEffect(() => {
    if (canEdit) {
      setInputType('10');
    }
  }, [canEdit]);

  const innerHtml = (
    <div className={styles['action-config']}>
      <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
        {titleType === 1 && (
          <div className={styles['title_sp']}>
            {title || '执行动作'}{' '}
            <Tip
              title={
                '配置话术播放完之后执行的动作，如系统挂机、跳转业务流程、转人工、转IVR、配置短信发送。'
              }
            />
          </div>
        )}
        {titleType === 2 && <div className={styles['title_third']}>{title || '执行动作'}</div>}
      </div>

      <div>
        <Space align="baseline">
          <FormItem name={getFormName(['action', 'actionType'])} label="跳转动作">
            <Select
              placeholder="请选择跳转动作"
              optionFilterProp="children"
              showSearch
              allowClear
              onChange={change}
              style={{ width: '220px' }}
              disabled={canEdit}
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              {config.robotTypeMap[info?.robotType] === '语音'
                ? ACTION_LIST.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })
                : ACTION_LIST_TEXT.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })}
            </Select>
          </FormItem>
          <Condition r-if={_actionType === 2}>
            <FormItem
              name={getFormName(['action', 'toFlowId'])}
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                placeholder="请选择跳转业务流程"
                optionFilterProp="children"
                showSearch
                style={{ width: '220px' }}
                disabled={canEdit}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {flowList.map((item: any, index: number) => {
                  return (
                    <Option
                      key={index}
                      value={item.name}
                      opt={item}
                      disabled={_flowdisabled && item.name === businessFlowId}
                    >
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Condition>
          <Condition r-if={_actionType === 4}>
            <FormItem
              label={'IVR菜单编码'}
              name={getFormName(['action', 'toFlowId'])}
              rules={[{ required: true, message: '请输入' }]}
            >
              <Input placeholder="请输入" style={{ width: '220px' }} disabled={canEdit}></Input>
            </FormItem>
          </Condition>
        </Space>
        <Condition r-if={_actionType}>
          <FormItem name={getFormName(['action', 'actionText'])} label="话术">
            <CvsInput
              placeholder="请输入话术内容"
              type="textarea"
              style={{ width: '100%' }}
              autoComplete="off"
              rows={3}
              maxlength={maxlength}
              canEdit={canEdit}
              sound={sound}
              showBreak={deep ? currentItem?.action?.soundType == 1 : currentItem?.soundType == 1}
            />
          </FormItem>
          <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
            <Space align="baseline">
              <Form.Item
                name={getFormName(['action', 'allowInterrupt'])}
                fieldKey={getFormName(['action', 'allowInterrupt'])}
                initialValue={
                  // deep
                  //   ? [1, 3, 4].includes(sType?.action?.actionType)
                  //     ? 0
                  //     : 1
                  //   : [1, 3, 4].includes(sType?.[_formName[1]]?.actionType)
                  //   ? 0
                  //   : 1
                  [1, 3, 4].includes(_actionType) ? 0 : 1
                }
                label={'允许打断'}
              >
                <Radio.Group
                  disabled={
                    canEdit ||
                    (deep
                      ? [1, 3, 4].includes(sType?.action?.actionType)
                      : [1, 3, 4].includes(sType?.[_formName[1]]?.actionType))
                  }
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Tip
                title={
                  '用于控制语音平台在放音过程中是否允许打断，若是，播音过程检测到客户说话，则停止播报进行收音。'
                }
              />
              {/* <Form.Item
                name={getFormName(['action', 'repeatHearKey'])}
                key={getFormName(['action' + 'repeatHearKey'])}
                initialValue={-1}
                style={{ marginLeft: '16px' }}
                label={'是否重听'}
              >
                <Select size="small" style={{ width: '120px' }} disabled={canEdit}>
                  <Option value={-1} key={-1}>
                    无重听按键
                  </Option>
                  <Option value={1} key={1}>
                    按键1
                  </Option>
                  <Option value={2} key={2}>
                    按键2
                  </Option>
                  <Option value={3} key={3}>
                    按键3
                  </Option>
                  <Option value={4} key={4}>
                    按键4
                  </Option>
                  <Option value={5} key={5}>
                    按键5
                  </Option>
                  <Option value={6} key={6}>
                    按键6
                  </Option>
                  <Option value={7} key={7}>
                    按键7
                  </Option>
                  <Option value={8} key={8}>
                    按键8
                  </Option>
                  <Option value={9} key={9}>
                    按键9
                  </Option>
                  <Option value={0} key={0}>
                    按键0
                  </Option>
                </Select>
              </Form.Item>
              <Tip title={''} /> */}
            </Space>
          </Condition>
          {/* <div className={styles['functionkey']}>
            <Form.Item
              name={getFormName(['action', 'userInputType'])}
              fieldKey={getFormName(['action', 'userInputType'])}
              initialValue={'10'}
              label={'输入方式'}
            >
              <Radio.Group
                onChange={(e) => {
                  let formData: any = getItem();
                  // formData[name].action.userInputType = e.target.value;
                  // if (e.target.value == '10') {
                  //   formData[name].action.functionKeyStart = undefined;
                  //   formData[name].action.functionKeyWell = undefined;
                  //   formData[name].action.buttonInputSize = undefined;
                  // }
                  setInputType(deep ? formData?.action?.userInputType : formData?.userInputType);
                  // form.setFieldsValue({ ...formData });
                }}
                disabled={canEdit}
              >
                <Radio value={'10'}>语音</Radio>
                <Radio value={'01'}>按键</Radio>
              </Radio.Group>
            </Form.Item>

            <Condition r-if={inputType == '01'}>
              <div className={styles['functionkey']}>
                <div className={styles['functionkey']} style={{ marginRight: '16px' }}>
                  <Form.Item
                    name={getFormName(['action', 'functionKeyStart'])}
                    fieldKey={getFormName(['action', 'functionKeyStart'])}
                    initialValue={1}
                    valuePropName="checked"
                  >
                    <Checkbox disabled={canEdit}></Checkbox>
                  </Form.Item>
                  <Form.Item style={{ marginLeft: '8px' }}>#号确认</Form.Item>
                </div>
                <div className={styles['functionkey']} style={{ marginRight: '16px' }}>
                  <Form.Item
                    name={getFormName(['action', 'functionKeyWell'])}
                    fieldKey={getFormName(['action', 'functionKeyWell'])}
                    initialValue={1}
                    valuePropName="checked"
                  >
                    <Checkbox disabled={canEdit}></Checkbox>
                  </Form.Item>
                  <Form.Item style={{ marginLeft: '8px' }}>*号取消</Form.Item>
                </div>

                <div className={styles['functionkey']}>
                  <Form.Item>按键长度：</Form.Item>
                  <Form.Item
                    name={getFormName(['action', 'buttonInputSize'])}
                    fieldKey={getFormName(['action', 'buttonInputSize'])}
                    initialValue={10}
                    rules={[{ required: true, message: '请输入按键长度' }]}
                  >
                    <InputNumber
                      max={40}
                      min={1}
                      step="1"
                      precision={0}
                      style={{ width: '161px' }}
                      placeholder="请输入按键长度"
                      disabled={canEdit}
                    />
                  </Form.Item>
                </div>
              </div>
            </Condition>
            </div> */}
        </Condition>
        <Condition r-if={_actionType}>
          <FormItem name={getFormName(['action', 'textLabels'])} label="选择标签">
            <LabelSelect color="magenta" canEdit={canEdit}></LabelSelect>
          </FormItem>
        </Condition>
        <FormItem>
          <div className={'ant-form-item-label'}>
            <label>短信发送</label>
          </div>
        </FormItem>

        <div className={styles['action-box']}>
          <FormList name={getFormName(['messageList'])}>
            {(outFields, { add: _add, remove: _remove }) => {
              const addOutNew = () => {
                // console.log(fields);
                let length = outFields.length;
                _add(
                  {
                    messageMode: undefined,
                    telPhone: undefined,
                    content: '',
                    placeholder: [],
                  },
                  length,
                );
              };

              return (
                <div className={styles['cvs-box']}>
                  {outFields.map((field: any, index: number) => {
                    const _item = getItem();
                    const currentItem = _item?.messageList?.[index];

                    const content: any =
                      messageList?.find((item: any) => {
                        return item.name === currentItem?.messageMode;
                      })?.content || '';

                    return (
                      <div key={field.key} className={styles['message-box']}>
                        <div style={{ lineHeight: '32px' }}>
                          <span
                            className={styles['del-bt']}
                            onClick={() => {
                              if (!canEdit) _remove(index);
                            }}
                          >
                            <MinusCircleOutlined disabled={canEdit} />
                          </span>
                          <span className={styles['cvs-num']}>{index + 1}.</span>
                        </div>
                        <div style={{ flex: '1 1 auto' }}>
                          <div>
                            <Space align="baseline">
                              {/* 类型 */}
                              <Form.Item
                                label={'短信模版'}
                                name={[field.name, 'messageMode']}
                                fieldKey={[field.fieldKey, 'messageMode']}
                                rules={[{ required: true, message: '请选择短信模版' }]}
                              >
                                <Select
                                  placeholder="请选择短信模版"
                                  optionFilterProp="children"
                                  showSearch
                                  style={{ width: '200px' }}
                                  onChange={(val: any, opt: any) => {
                                    changeItem(opt, index);
                                  }}
                                  disabled={canEdit}
                                  getPopupContainer={(trigger) => trigger.parentElement}
                                >
                                  {messageList.map((item: any, index: number) => {
                                    return (
                                      <Option key={index} value={item.name} opt={item}>
                                        {item.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name={[field.name, 'telPhone']}
                                fieldKey={[field.fieldKey, 'telPhone']}
                                label="接受号码"
                                rules={[{ required: true, message: '请选择接受号码' }]}
                              >
                                <Cascader
                                  options={cascaderList}
                                  expandTrigger="hover"
                                  placeholder={'请选择接受号码'}
                                  displayRender={(label: any[]) => {
                                    return label[label.length - 1];
                                  }}
                                  style={{ width: '200px' }}
                                  disabled={canEdit}
                                  getPopupContainer={(trigger: any) => trigger.parentElement}
                                />
                              </Form.Item>
                            </Space>
                            <Condition r-if={content}>
                              <div className={styles['cvs-row']}>
                                <div className={styles['cvs-label']}>模版内容</div>
                                <div className={styles['cvs-content']}>{content}</div>
                              </div>
                            </Condition>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div>
                    <Button
                      type="link"
                      icon={<AppstoreAddOutlined />}
                      style={{ marginLeft: '10px' }}
                      onClick={addOutNew}
                      disabled={canEdit}
                    >
                      新增短信发送
                    </Button>
                  </div>
                </div>
              );
            }}
          </FormList>
        </div>
      </div>
    </div>
  );

  return innerHtml;
};

export default ActionConfig;
