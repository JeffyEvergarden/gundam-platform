import Condition from '@/components/Condition';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, message, Radio, Select, Space, Switch } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import LabelSelect from '../../drawer/components/label-select';
import CvsInput from '../components/cvs-input';
import SoundRadio from '../components/sound-radio';
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
      res[name] = {
        action: {
          actionText: '',
          actionType: null,
          textLabels: [],
          userInputType: '10',
          allowInterrupt: 1,
        },
        messageList: [],
        configType: 2,
        responseList: [],
        times: null,
      };
      form.setFieldsValue(res);
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

  return (
    <div className={styles['high-config']}>
      <Space align="baseline">
        <div className={styles['title_sp']} style={{ marginRight: '16px', marginBottom: '20px' }}>
          {title}处理
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
      <Condition r-if={name != 'unclearAction'}>
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
                  <div className={styles['title_third']}>响应话术</div>
                </div>

                <div className={styles['cvs-box']}>
                  {fields.map((field: any, index: number) => {
                    //试听
                    const sound = () => {
                      return (
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
                              <Radio value={1}>全合成</Radio>
                              <Radio value={2}>录音半合成</Radio>
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
                          </Button>
                          <SoundVarModal cref={auditionRef}></SoundVarModal>
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

                          <SoundRadio
                            name={name}
                            form={form}
                            index={index}
                            disabled={disabled}
                            field={field}
                            formName={[name, 'responseList', index]}
                          />

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
      </Condition>

      {/* 未听清意图名称 */}
      <Condition r-if={name == 'unclearAction'}>
        <FormItem name={[name, 'wishId']} label={'未听清意图名称'} style={{ marginTop: '8px' }}>
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
      </Condition>

      {/*文本不需要这个  0文本 1语音 */}
      <Condition r-if={!(info?.robotType == 0)}>
        {/* 次数 */}
        <FormItem name={[name, 'times']} label={title + '次数'} style={{ marginTop: '8px' }}>
          <InputNumber
            max={100000}
            min={1}
            step="1"
            precision={0}
            style={{ width: '200px' }}
            placeholder={'请输入' + title + '次数'}
            disabled={disabled}
          />
        </FormItem>
        {/* 静默超时时间 */}
        <Condition r-if={title == '静默'}>
          <FormItem
            name={[name, 'timeout']}
            label={title + '超时时间'}
            style={{ marginTop: '8px' }}
            rules={[{ required: true, message: '请输入静默超时时间' }]}
            initialValue={5}
          >
            <InputNumber
              max={10}
              min={1}
              step="1"
              precision={0}
              style={{ width: '161px' }}
              placeholder={'请输入' + title + '次数'}
              disabled={disabled}
            />
          </FormItem>
        </Condition>

        {/* 超限动作 */}
        <div className={'label_sp'} style={{ marginTop: '8px' }}>
          <ActionConfig
            form={form}
            title={title + '执行动作'}
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
