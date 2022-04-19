import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber, Radio, message } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  CaretUpOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import Condition from '@/components/Condition';
import LabelSelect from '../../drawer/components/label-select';
import CvsInput from '../components/cvs-input';
import styles from './style.less';
import ActionConfig from './action-config';
import { ACTION_LIST } from '../const';
import { useModel } from 'umi';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HightformTemplate: any = (props: any) => {
  const { form, name, title, showDefault, type } = props;
  const [disabled, setDisabled] = useState<boolean>(false);
  const { nodeConfig, wishList } = useModel('drawer' as any, (model: any) => ({
    nodeConfig: model._globalNodeList,
    wishList: model._wishList,
  }));

  const isDisabled = false;

  const onChange = (val: any) => {
    let res = form.getFieldsValue();
    if (res[name].configType == 1) {
      res[name] = nodeConfig?.highConfig[name];
      setDisabled(true);
      form.setFieldsValue(res);
    } else if (res[name].configType == 2) {
      res[name] = {
        action: {
          actionText: '',
          actionType: null,

          textLabels: [],
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

  return (
    <div className={styles['high-config']}>
      <Space align="baseline">
        <div className={styles['title_sp']} style={{ marginRight: '16px', marginBottom: '20px' }}>
          {title}处理
        </div>
        <Condition r-if={type == 'flow'}>
          <Form.Item name={[name, 'configType']} initialValue={2}>
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
                  {fields.map((field: any, index: number) => (
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
                          />
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
                  ))}

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
      </Condition>

      {/* 未听清意图名称 */}
      <Condition r-if={name == 'unclearAction'}>
        <FormItem
          name={[name, 'unclearName']}
          label={'未听清意图名称'}
          style={{ marginTop: '8px' }}
        >
          <Select disabled={true} style={{ width: '300px' }}>
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

      {/* 超限动作 */}
      <div className={'label_sp'} style={{ marginTop: '8px' }}>
        <ActionConfig
          form={form}
          title={title + '执行动作'}
          formName={[name, 'action']}
          name={[name, 'action']}
          titleType={2}
          canEdit={disabled}
        />
      </div>
    </div>
  );
};

export default HightformTemplate;
