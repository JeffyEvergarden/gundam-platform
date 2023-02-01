import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Radio, Select, Space } from 'antd';
import { useRef } from 'react';
import { useModel } from 'umi';
import LabelSelect from '../../drawer/components/label-select';
import CvsForm from '../components/cvs-form';
import CvsInput from '../components/cvs-input';
import SoundRadio from '../components/sound-radio';
import SoundSelectModal from '../components/sound-select-modal';
import SoundVarModal from '../components/sound-var-modal';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const {
    form,
    name,
    title = '答复配置',
    placeholder = '答复内容',
    required,
    formName,
    deep = false,
    showLabel = true,
  } = props;
  const soundRef = useRef<any>();
  const auditionRef = useRef<any>();
  const sType: any = Form.useWatch(formName, form);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const tipContent = (title: any) => {
    if (title == '澄清话术') {
      return '用于询问客户词槽信息，用于引导客户回复词槽内容。如配置“产品”词槽，可配置“请问您想咨询的是那款产品？”，澄清话术的数量决定词槽澄清的次数。';
    }
    if (title == '答复配置') {
      return '可配置多个答复内容，当流程在当前节点循环时（例如，客户表示未听清），可以顺序播放不同的答复内容。';
    }
    if (title == '按钮选项') {
      return '当需要让用户选择内容时，可以添加多个按钮内容，内容会以按钮的样式展示。用户点击按钮会将内容填充至当前词槽，继续后续的流程。支持插入变量、词槽，使用特定语法获取内嵌属性。';
    }
  };

  return (
    <div className={styles['conversation-list']}>
      <FormList name={name}>
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
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
            <div>
              <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
                <div className={styles['title_sp']}>
                  {title}
                  <Tip title={tipContent(title)} />
                </div>
              </div>

              <div className={styles['cvs-box']}>
                {fields.map((field: any, index: number) => {
                  const sound = () => {
                    return config.robotTypeMap[info?.robotType] === '语音' ? (
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          name={[field.name, 'soundType']}
                          fieldKey={[field.fieldKey, 'soundType']}
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
                        <Condition
                          r-if={
                            deep
                              ? sType?.[0]?.['conversationList']?.[index]?.soundType == 2
                              : sType?.[index]?.soundType == 2
                          }
                        >
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
                                console.log(form.getFieldsValue(formName));
                                soundRef?.current?.open(
                                  deep
                                    ? form.getFieldsValue()?.[formName]?.[0]?.[
                                        'conversationList'
                                      ]?.[index]?.soundRecordList
                                    : form.getFieldsValue()?.[formName]?.[index]?.soundRecordList,
                                  index,
                                );
                              }}
                            >
                              选择
                            </Button>
                          </Form.Item>
                        </Condition>
                        <Button
                          type="link"
                          onClick={() => {
                            auditionRef?.current?.open(
                              deep
                                ? form.getFieldsValue()?.[formName]?.[0]?.['conversationList']?.[
                                    index
                                  ]
                                : form.getFieldsValue()?.[formName]?.[index],
                            );
                          }}
                        >
                          试听
                          <Tip
                            title={'根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'}
                          />
                        </Button>
                        <SoundVarModal cref={auditionRef}></SoundVarModal>
                        <SoundSelectModal
                          cref={soundRef}
                          setform={(list: any, index: any) => {
                            let formData = form.getFieldsValue();
                            if (deep) {
                              formData[formName][0]['conversationList'][index].soundRecordList =
                                list;
                              formData[formName][0]['conversationList'][index].actionText = list
                                ?.map((item: any) => item?.text)
                                ?.join(';');
                            } else {
                              formData[formName][index].soundRecordList = list;
                              formData[formName][index].actionText = list
                                ?.map((item: any) => item?.text)
                                ?.join(';');
                            }

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
                            remove(index);
                          }}
                        >
                          <MinusCircleOutlined />
                        </span>
                        <span className={styles['cvs-num']}>{index + 1}.</span>
                      </div>
                      <div style={{ flex: '1 1 auto' }}>
                        {/* 类型 */}
                        <Form.Item
                          name={[field.name, 'actionText']}
                          fieldKey={[field.fieldKey, 'actionText']}
                          rules={[{ required: true, message: `请输入${placeholder}` }]}
                        >
                          <CvsInput
                            placeholder={`请输入${placeholder}`}
                            title={`${placeholder}：`}
                            type="textarea"
                            style={{ width: '100%' }}
                            autoComplete="off"
                            required
                            sound={sound}
                          />
                        </Form.Item>
                        <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                          <Condition r-if={formName == 'clearList'}>
                            <SoundRadio
                              name={name}
                              form={form}
                              index={index}
                              field={field}
                              formName={[formName, index]}
                            />
                          </Condition>
                          {/* <Space align="baseline">
                            <Form.Item
                              name={[field.name, 'allowInterrupt']}
                              fieldKey={[field.fieldKey, 'allowInterrupt']}
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
                            <Form.Item
                              name={[field.name, 'repeatHearKey']}
                              key={field.name + 'repeatHearKey'}
                              initialValue={1}
                              style={{ marginLeft: '16px' }}
                              label={'是否重听'}
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

                          <CvsForm name={[field.name]} key={field.name}></CvsForm>
                        </Condition>

                        <Condition r-if={showLabel}>
                          <Form.Item
                            name={[field.name, 'textLabels']}
                            fieldKey={[field.fieldKey, 'textLabels']}
                            label="选择标签"
                          >
                            <LabelSelect color="magenta"></LabelSelect>
                          </Form.Item>
                        </Condition>
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
                  >
                    新增{placeholder}
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </FormList>
    </div>
  );
};

export default ConversationConfig;
