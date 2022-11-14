import Condition from '@/components/Condition';
import config from '@/config';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Radio, Select } from 'antd';
import { useRef } from 'react';
import { useModel } from 'umi';
import LabelSelect from '../../drawer/components/label-select';
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
                <div className={styles['title_sp']}>{title}</div>
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
                            <Radio value={1}>全合成</Radio>
                            <Radio value={2}>录音半合成</Radio>
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
