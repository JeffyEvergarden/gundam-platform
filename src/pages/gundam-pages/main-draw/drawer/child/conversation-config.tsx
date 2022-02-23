import { useState } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber, Radio } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  CaretUpOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import LabelSelect from '../components/label-select';
import GlobalVarButton from '../components/global-var-button';
import Condition from '@/components/Condition';
import RuleSelect from '../components/rule-var-button';
import styles from '../style.less';
import { ACTION_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const { form, wishList, wordSlotList } = props;

  return (
    <div>
      <FormList name="conversation_list">
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            // console.log(length);
            add(
              {
                reply_type: 'text',
                reply_speak: '',
                reply_label_var: [],
                exit_flag: false,
                action: null,
                msg_flag: false,
                msg: '',
                transition_response_speak: '',
                transition_label_var: [],
              },
              length,
            );
          };

          return (
            <div style={{ paddingLeft: '20px' }}>
              <div className={styles['title']}>
                对话回应
                <Button
                  type="link"
                  icon={<AppstoreAddOutlined />}
                  style={{ marginLeft: '10px' }}
                  onClick={addNew}
                >
                  新增回复
                </Button>
              </div>
              <div>
                {fields.map((field: any, index: number) => (
                  <div key={field.key} className={styles['list-box']}>
                    <div style={{ width: '30px', flexShrink: 0 }}>
                      <Button
                        icon={<MinusCircleOutlined />}
                        type="link"
                        danger
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    </div>
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      {/* 类型 */}
                      <FormItem
                        name={[field.name, 'reply_type']}
                        fieldKey={[field.fieldKey, 'reply_type']}
                        label="答复类型"
                      >
                        <Radio.Group>
                          <Radio value={'text'}>文本</Radio>
                        </Radio.Group>
                      </FormItem>
                      {/* 答复内容 */}
                      <FormItem
                        name={[field.name, 'reply_speak']}
                        fieldKey={[field.fieldKey, 'reply_speak']}
                        label="答复内容"
                      >
                        <GlobalVarButton
                          placeholder="请输入答复内容"
                          style={{ width: '400px' }}
                          autoComplete="off"
                        />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'reply_label_var']}
                        fieldKey={[field.fieldKey, 'reply_label_var']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </FormItem>
                      {/* 结束挂机 */}
                      <Space>
                        <FormItem
                          name={[field.name, 'exit_flag']}
                          label="结束挂机"
                          valuePropName="checked"
                          style={{ width: '220px' }}
                        >
                          <Checkbox>是否结束挂机</Checkbox>
                        </FormItem>

                        <FormItem
                          name={[field.name, 'action']}
                          label="动作"
                          style={{ width: '250px' }}
                        >
                          <Select placeholder="请选择动作" size="small">
                            {ACTION_LIST.map((item: any, index: number) => {
                              return (
                                <Option key={index} value={item.name} opt={item}>
                                  {item.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Space>
                      {/* 是否发送短信*/}
                      <Space>
                        <FormItem
                          name={[field.name, 'msg_flag']}
                          label="是否发送短信"
                          valuePropName="checked"
                          style={{ width: '230px' }}
                        >
                          <Checkbox>是否发送短信</Checkbox>
                        </FormItem>

                        <FormItem
                          name={[field.name, 'msg']}
                          label="短信内容"
                          style={{ width: '300px' }}
                        >
                          <Input
                            placeholder="请输入短信内容"
                            maxLength={150}
                            autoComplete="off"
                            size="small"
                          />
                        </FormItem>
                      </Space>
                      <FormItem name={[field.name, 'transition_response_speak']} label="过渡话术">
                        <GlobalVarButton
                          placeholder="请输入过渡话术"
                          style={{ width: '400px' }}
                          autoComplete="off"
                        />
                      </FormItem>
                      <FormItem name={[field.name, 'transition_label_var']} label="选择标签">
                        <LabelSelect color="orange"></LabelSelect>
                      </FormItem>

                      <FormItem name={[field.name, 'rules_config']} label="规则配置">
                        <RuleSelect wishList={wishList} wordSlotList={wordSlotList}></RuleSelect>
                      </FormItem>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </FormList>
    </div>
  );
};

export default ConversationConfig;
