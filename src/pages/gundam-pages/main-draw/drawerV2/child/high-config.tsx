import { useState } from 'react';
import { Form, Select, Button, Checkbox, Space, Radio, InputNumber } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import HightformTemplate from './high-inner-config';
import Condition from '@/components/Condition';
import styles from './style.less';
import { ACTION_LIST } from '../const';

import { useModel } from 'umi';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HighConfig = (props: any) => {
  const { form, wishList, bussinessList, type } = props;

  const { nodeConfig } = useModel('drawer' as any, (model: any) => ({
    nodeConfig: model._globalNodeList,
  }));
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [flag, setFlag] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);

  const onChange = (val: any) => {
    console.log(nodeConfig);
    let res = form.getFieldsValue();
    if (res.configType == 1) {
      res.allowFlows = nodeConfig.allowFlows;
      setDisabled(true);
      form.setFieldsValue(res);
    } else if (res.configType == 2) {
      res.allowFlows = undefined;
      form.setFieldsValue(res);
      setDisabled(false);
    }
  };

  return (
    <>
      <Condition r-if={type == 'flow'}>
        <div>
          <div
            className={styles['title']}
            onClick={() => {
              setFlag(!flag);
            }}
          >
            高级配置
            <span style={{ color: '#1890ff', marginLeft: '24px', fontSize: '16px' }}>
              {!flag && <SettingOutlined />}
              {flag && <CaretUpOutlined />}
            </span>
          </div>
        </div>
      </Condition>

      <Condition r-show={flag || type == 'config'}>
        <div className={styles['antd-form']}>
          <Space align="baseline">
            <div className={styles['title_sp']} style={{ marginRight: '16px' }}>
              流程跳转
            </div>
            <Condition r-if={type == 'flow'}>
              <Form.Item name="configType" initialValue={2}>
                <Radio.Group size="small" onChange={onChange}>
                  <Radio value={1}>默认配置</Radio>
                  <Radio value={2}>自定义配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Condition>
          </Space>
          <FormItem name="allowFlows" label="允许跳转至业务流程" style={{ width: '400px' }}>
            <Select placeholder="请选择允许跳转至业务流程" mode="multiple" disabled={disabled}>
              {bussinessList.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </div>

        <HightformTemplate form={form} name="silenceAction" title={'静默'} type={type} />

        <HightformTemplate form={form} name="rejectAction" title={'拒识'} type={type} />

        <HightformTemplate form={form} name="clearAction" title={'澄清'} type={type} />

        <HightformTemplate form={form} name="unclearAction" title={'客户未听清'} type={type} />

        <Condition r-if={type == 'config'}>
          <div className={styles['antd-form']}>
            <Space align="baseline">
              <div className={styles['title_sp']} style={{ marginRight: '16px' }}>
                意图澄清配置
              </div>
            </Space>

            <Condition r-if={info.robotType == 1}>
              <FormItem name={'threshold'} label="阈值" rules={[{ required: true }]}>
                <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
              </FormItem>
              <FormItem name={'thresholdGap'} label="得分差值" rules={[{ required: true }]}>
                <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
              </FormItem>
            </Condition>
            <Condition r-if={info.robotType == 0}>
              <FormItem name={'maxThreshold'} label="最大阈值" rules={[{ required: true }]}>
                <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
              </FormItem>
              <FormItem name={'minThreshold'} label="最小阈值" rules={[{ required: true }]}>
                <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
              </FormItem>
            </Condition>
          </div>
        </Condition>
      </Condition>
    </>
  );
};

export default HighConfig;
