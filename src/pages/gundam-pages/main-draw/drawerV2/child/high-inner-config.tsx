import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, message, Radio, Select, Space, Switch } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import LabelSelect from '../../drawer/components/label-select';
import CvsForm from '../components/cvs-form';
import CvsInput from '../components/cvs-input';
import SoundSelectModal from '../components/sound-select-modal';
import SoundVarModal from '../components/sound-var-modal';
import ActionConfig from './action-config';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HightformTemplate: any = (props: any) => {
  const { form, name, title, showDefault, type } = props;

  const soundRef = useRef<any>({});
  const auditionRef = useRef<any>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [switchType, setSwitchType] = useState<boolean>(false);
  const sType: any = Form.useWatch(name, form);

  const { nodeConfig, wishList } = useModel('drawer' as any, (model: any) => ({
    nodeConfig: model._globalNodeList,
    wishList: model._wishList,
  }));
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const isDisabled = false;

  const onChange = (val: any) => {
    let res = form.getFieldsValue();
    if (res[name].configType == 1) {
      res[name] = {
        action: {
          actionText: '',
          actionType: null,
          textLabels: [],
          userInputType: '10',
          allowInterrupt: 1,
          soundType: 1,
        },
        messageList: [],
        configType: 1,
        responseList: [],
        times: null,
      };
      form.setFieldsValue(res); //由于有些字段后端没存 所以先清空

      res[name] = nodeConfig?.highConfig[name];
      setDisabled(true);
      form.setFieldsValue(res);
    } else if (res[name].configType == 2) {
      // res[name] = {
      //   action: {
      //     actionText: '',
      //     actionType: null,
      //     textLabels: [],
      //     userInputType: '10',
      //     allowInterrupt: 1,
      //     soundType: 1,
      //   },
      //   messageList: [],
      //   configType: 2,
      //   responseList: [],
      //   times: null,
      // };
      // form.setFieldsValue(res);
      setDisabled(false);
    }
    console.log(res);
  };

  useEffect(() => {
    let res = form.getFieldsValue();
    console.log(Form);

    if (res[name].configType == 1) {
      res[name] = nodeConfig?.highConfig[name];
      setDisabled(true);
      form.setFieldsValue(res);
    }
  }, []);

  const tipContent = (title: any) => {
    if (title == '静默') {
      return '当客户不说话，触发静默处理，反问客户是否在线。';
    }
    if (title == '拒识') {
      return '当意图识别返回的结果得分低于“全局配置-节点配置-意图澄清配置-阈值”时，触发拒识，即机器人无法理解客户的意思。';
    }
    if (title == '澄清') {
      return (
        <>
          当意图识别返回的结果得分大于“全局配置-节点配置-意图澄清配置-阈值”，且大于阈值的候选项有多个，且候选项之间的差值小于“全局配置-节点配置-意图澄清配置-差值”，则触发澄清，即机器人无法确定客户具体的意图，需要确认。
          {config.robotTypeMap[info?.robotType] === '语音'
            ? '此时将意图或FAQ替换澄清文本中的{}进行返回。'
            : '此时将需要澄清的意图或FAQ批量返回，供客户选择。'}
        </>
      );
    }
    if (title == '客户未听清') {
      return '配置当客户明确表示没听清，信号不好时响应的动作，默认重复播报上一句有意义的话术（排除静默话术）';
    }
  };

  const tipTimes = (title: any) => {
    if (title == '静默') {
      return '客户静默时，机器人连续反问的最大次数。顺序、循环使用响应话术进行播报。';
    }
    if (title == '拒识') {
      return '机器人连续拒识的次数上限。';
    }
    if (title == '澄清') {
      return '机器人连续澄清的次数上限。';
    }
    if (title == '客户未听清') {
      return '客户连续表述“未听清”意图的次数上限。';
    }
  };

  const tipAction = (title: any) => {
    if (title == '静默') {
      return '客户静默时，机器人连续反问的最大次数。顺序、循环使用响应话术进行播报。';
    }
    if (title == '拒识') {
      return '机器人连续拒识的次数上限。';
    }
    if (title == '澄清') {
      return '机器人连续澄清的次数上限。';
    }
    if (title == '客户未听清') {
      return '客户连续表述“未听清”意图的次数上限。';
    }
  };

  return (
    <div className={styles['high-config']}>
      <Space align="baseline">
        <div className={styles['title_sp']} style={{ marginRight: '16px', marginBottom: '20px' }}>
          {title}处理
          <Tip title={tipContent(title)} />
        </div>
        <Condition r-if={type == 'flow'}>
          <Form.Item name={[name, 'configType']} initialValue={1}>
            <Radio.Group onChange={onChange} size="small">
              <Radio value={1}>默认配置</Radio>
              <Radio value={2}>自定义配置</Radio>
            </Radio.Group>
          </Form.Item>
        </Condition>
      </Space>

      {/* 响应话术 */}
      {/* <Condition r-if={name != 'unclearAction'}> */}
      <FormList name={[name, 'responseList']}>
        {(fields, { add, remove }) => {
          let length = fields.length;
          const addNew = () => {
            // console.log(length);
            add(
              {
                actionText: '',
                textLabels: [],
              },
              length,
            );
          };

          return (
            <div className={styles['conversation-list']}>
              <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
                <div className={styles['title_third']}>
                  响应话术
                  <Tip
                    title={
                      title == '澄清'
                        ? config.robotTypeMap[info?.robotType] === '语音'
                          ? '默认值“请问你是项咨询{}还是{}？”，澄清意图或faq会替换{}'
                          : '默认值“你是否想要咨询以下问题”，引导客户从澄清列表中选择内容'
                        : '返回给客户的话术。'
                    }
                  />{' '}
                </div>
              </div>

              <div className={styles['cvs-box']}>
                {fields.map((field: any, index: number) => {
                  //试听
                  const sound = () => {
                    return config.robotTypeMap[info?.robotType] === '语音' ? (
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          name={[field.name, 'soundType']}
                          fieldKey={[field.fieldKey, 'soundType']}
                          initialValue={1}
                        >
                          <Radio.Group
                            disabled={disabled}
                            onChange={() => {
                              console.log(sType);
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
                        <Condition r-if={sType?.responseList?.[index]?.soundType == 2}>
                          <Form.Item
                            name={[field.name, 'soundRecordList']}
                            fieldKey={[field.fieldKey, 'soundRecordList']}
                            rules={[
                              {
                                required: true,
                                message: '请选择',
                              },
                            ]}
                          >
                            <Button
                              type="link"
                              onClick={() => {
                                console.log(form.getFieldsValue()?.[name]?.responseList[index]);
                                console.log(sType);
                                // if (sType?.responseList?.[index]?.soundType == 2) {
                                soundRef?.current?.open(
                                  form.getFieldsValue()?.[name]?.responseList[index]
                                    ?.soundRecordList || [],
                                  index,
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
                            console.log(form.getFieldsValue()?.[name]?.responseList[index]);
                            auditionRef?.current?.open(
                              form.getFieldsValue()?.[name]?.responseList[index],
                            );
                          }}
                        >
                          试听
                          <Tip
                            title={'根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'}
                          />
                        </Button>
                        <SoundVarModal cref={auditionRef} isClear={title == '澄清'}></SoundVarModal>
                        <SoundSelectModal
                          cref={soundRef}
                          setform={(list: any, index: any) => {
                            let formData = form.getFieldsValue();
                            formData[name].responseList[index].soundRecordList = list;
                            formData[name].responseList[index].actionText = list
                              ?.map((item: any) => item?.text)
                              ?.join(';');
                            form.setFieldsValue(formData);
                          }}
                        ></SoundSelectModal>
                      </div>
                    ) : (
                      <></>
                    );
                  };

                  return (
                    <div key={field.key} className={styles['list-box']}>
                      <div style={{ lineHeight: '32px' }}>
                        <span
                          className={styles['del-bt']}
                          onClick={() => {
                            if (!disabled) {
                              if (
                                length == 1 &&
                                (name == 'silenceAction' || name == 'rejectAction')
                              ) {
                                message.warning('至少保留一条话术');
                                return;
                              }
                              remove(index);
                            }
                          }}
                        >
                          <MinusCircleOutlined disabled={disabled} />
                        </span>
                        <span className={styles['cvs-num']}>{index + 1}.</span>
                      </div>
                      <div style={{ flex: '1 1 auto' }}>
                        {/* 类型 */}
                        <Form.Item
                          name={[field.name, 'actionText']}
                          fieldKey={[field.fieldKey, 'actionText']}
                          rules={[{ required: true, message: '请输入响应话术' }]}
                        >
                          <CvsInput
                            placeholder="请输入响应话术"
                            title={'响应话术：'}
                            type="textarea"
                            style={{ width: '100%' }}
                            autoComplete="off"
                            canEdit={disabled}
                            required={true}
                            sound={sound}
                          />
                        </Form.Item>

                        <Condition
                          r-if={
                            config.robotTypeMap[info?.robotType] === '语音' &&
                            name != 'unclearAction'
                          }
                        >
                          {/* <SoundRadio
                              name={name}
                              form={form}
                              index={index}
                              disabled={disabled}
                              field={field}
                              formName={[name, 'responseList', index]}
                            /> */}
                          {/* <Space align="baseline">
                            <Form.Item
                              name={[field.name, 'allowInterrupt']}
                              fieldKey={[field.fieldKey, 'allowInterrupt']}
                              initialValue={1}
                              label={'允许打断'}
                            >
                              <Radio.Group disabled={disabled}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                              </Radio.Group>
                            </Form.Item>
                            <Tip
                              title={
                                '用于控制语音平台在放音过程中是否允许打断，若是，播音过程检测到客户说话，则停止播报进行收音。'
                              }
                            />
                            <Form.Item
                              name={[field.name, 'repeatHearKey']}
                              key={field.name + 'repeatHearKey'}
                              initialValue={1}
                              label={'是否重听'}
                              style={{ marginLeft: '16px' }}
                            >
                              <Select>
                                <Option value={-1}>无重听按键</Option>
                                <Option value={1}>按键1</Option>
                                <Option value={2}>按键2</Option>
                                <Option value={3}>按键3</Option>
                                <Option value={4}>按键4</Option>
                                <Option value={5}>按键5</Option>
                                <Option value={6}>按键6</Option>
                                <Option value={7}>按键7</Option>
                                <Option value={8}>按键8</Option>
                                <Option value={9}>按键9</Option>
                                <Option value={0}>按键0</Option>
                              </Select>
                            </Form.Item>
                            <Tip title={''} />
                          </Space> */}
                          <CvsForm
                            name={[field.name]}
                            key={field.name}
                            canEdit={disabled}
                          ></CvsForm>
                        </Condition>

                        <Form.Item
                          name={[field.name, 'textLabels']}
                          fieldKey={[field.fieldKey, 'textLabels']}
                          label="选择标签"
                        >
                          <LabelSelect color="magenta" canEdit={disabled}></LabelSelect>
                        </Form.Item>
                      </div>
                    </div>
                  );
                })}

                <div>
                  <Button
                    type="link"
                    icon={<AppstoreAddOutlined />}
                    style={{ marginLeft: '10px' }}
                    onClick={addNew}
                    disabled={disabled}
                  >
                    新增响应话术
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </FormList>
      <Condition r-if={name == 'rejectAction' && info?.robotType == 0 && type == 'config'}>
        <div style={{ marginTop: '12px' }}>
          <FormItem
            // {...col}
            label={'是否开启转人工'}
            name={[name, 'rejectTransfer']}
            key={name + 'rejectTransfer'}
            valuePropName="checked"
            initialValue={false}
            shouldUpdate={(prevValues, curValues) => {
              setSwitchType(curValues[name]?.rejectTransfer);
              return true;
              // return prevValues.additional !== curValues.additional;
            }}
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={setSwitchType} />
          </FormItem>
          <Condition r-if={switchType}>
            <FormItem
              // {...col}
              label={'拒识次数'}
              name={[name, 'times']}
              key={name + 'times'}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: 200 }} min={0} step="1" />
            </FormItem>
          </Condition>
        </div>
      </Condition>
      {/* </Condition> */}

      {/* 未听清意图名称 */}
      <Condition r-if={name == 'unclearAction'}>
        <FormItem label={'未听清意图名称'} style={{ marginTop: '8px' }}>
          <Space align="baseline">
            <FormItem name={[name, 'wishId']} noStyle>
              <Select
                disabled={true}
                style={{ width: '300px' }}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {wishList?.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.name} opt={item}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            <Tip
              title={
                '默认关联“意图管理”的用户未听清意图，需要在该意图下配置语料以提高该意图的识别准确率。'
              }
            />
          </Space>
        </FormItem>
      </Condition>

      {/*文本不需要这个  0文本 1语音 */}
      <Condition r-if={!(info?.robotType == 0)}>
        {/* 次数 */}
        <FormItem label={title + '次数'} style={{ marginTop: '8px' }}>
          <Space align="baseline">
            <FormItem noStyle name={[name, 'times']}>
              <InputNumber
                max={100000}
                min={title == '澄清' ? 1 : 0}
                step="1"
                precision={0}
                style={{ width: '200px' }}
                placeholder={'请输入' + title + '次数'}
                disabled={disabled}
              />
            </FormItem>
            <Tip title={tipTimes(title)} />
          </Space>
        </FormItem>

        {/* 静默超时时间 */}
        <Condition r-if={title == '静默'}>
          <FormItem label={title + '超时时间'} style={{ marginTop: '8px' }}>
            <Space align="baseline">
              <FormItem
                name={[name, 'timeout']}
                noStyle
                rules={[{ required: true, message: '请输入静默超时时间' }]}
                initialValue={5}
              >
                <InputNumber
                  min={1}
                  step="1"
                  precision={0}
                  style={{ width: '161px' }}
                  placeholder={'请输入' + title + '超时时间'}
                  disabled={disabled}
                />
              </FormItem>
              <Tip title={'单位秒，客户多少秒没说话则定义为静默。'} />
            </Space>
          </FormItem>
        </Condition>

        {/* 超限动作 */}
        <div className={'label_sp'} style={{ marginTop: '8px' }}>
          <ActionConfig
            form={form}
            title={
              <>
                {title + '执行动作'}
                <Tip title={tipAction(title)} />
              </>
            }
            formName={[name]}
            name={[name]}
            titleType={2}
            canEdit={disabled}
          />
        </div>
      </Condition>
    </div>
  );
};

export default HightformTemplate;
