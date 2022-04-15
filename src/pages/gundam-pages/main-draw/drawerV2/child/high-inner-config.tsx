import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber, Radio } from 'antd';
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
  const { info, flowList, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    flowList: model.flowList, // 业务流程列表
    businessFlowId: model.businessFlowId,
  }));

  const isDisabled = false;

  const onChange = (val: any) => {};

  return (
    <div className={styles['high-config']}>
      <Space align="baseline">
        <div className={styles['title_sp']} style={{ marginRight: '16px' }}>
          {title}处理
        </div>
        <Condition r-if={type == 'flow'}>
          <Form.Item name={[name, 'configType']}>
            <Radio.Group onChange={onChange} size="small">
              <Radio value={1}>默认配置</Radio>
              <Radio value={2}>自定义配置</Radio>
            </Radio.Group>
          </Form.Item>
        </Condition>
      </Space>

      {/* 澄清 阈值等 */}
      <Condition r-if={name == 'clearAction' && type == 'config'}>
        <Condition r-if={info.robotType == 1}>
          <FormItem
            name={[name, 'threshold']}
            label="阈值"
            rules={[{ required: true }]}
            initialValue={0.9}
          >
            <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
          </FormItem>
          <FormItem
            name={[name, 'thresholdGap']}
            label="得分差值"
            rules={[{ required: true }]}
            initialValue={0.02}
          >
            <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
          </FormItem>
        </Condition>
        <Condition r-if={info.robotType == 0}>
          <FormItem
            name={[name, 'maxThreshold']}
            label="最大阈值"
            rules={[{ required: true }]}
            initialValue={0.9}
          >
            <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
          </FormItem>
          <FormItem
            name={[name, 'minThreshold']}
            label="最小阈值"
            rules={[{ required: true }]}
            initialValue={0.6}
          >
            <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
          </FormItem>
        </Condition>
      </Condition>

      {/* 响应话术 */}
      <Condition r-if={name != 'unclearAction'}>
        <FormList name={[name, 'responseList']}>
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
                          rules={[{ required: true, message: '请输入响应话术' }]}
                        >
                          <CvsInput
                            placeholder="请输入响应话术"
                            title={'响应话术：'}
                            type="textarea"
                            style={{ width: '100%' }}
                            autoComplete="off"
                          />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, 'textLabels']}
                          fieldKey={[field.fieldKey, 'textLabels']}
                          label="选择标签"
                        >
                          <LabelSelect color="magenta"></LabelSelect>
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
          initialValue={'客户未听清意图'}
        >
          <Select disabled={true} style={{ width: '300px' }}>
            <Option key={'1'} value={'客户未听清意图'}>
              客户未听清意图
            </Option>
          </Select>
        </FormItem>
      </Condition>

      {/* 次数 */}
      <FormItem
        name={[name, 'times']}
        label={title + '次数'}
        style={{ marginTop: '8px' }}
        initialValue={3}
      >
        <InputNumber
          max={100000}
          min={1}
          step="1"
          precision={0}
          style={{ width: '200px' }}
          placeholder={'请输入' + title + '次数'}
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
        />
      </div>
    </div>
  );
};

export default HightformTemplate;
