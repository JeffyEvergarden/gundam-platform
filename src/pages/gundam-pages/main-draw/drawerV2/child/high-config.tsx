import { useEffect, useState } from 'react';
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
  const { form, wishList, bussinessList, type, config } = props;

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
      res.allowFlows = nodeConfig?.highConfig?.allowFlows;
      setDisabled(true);
      form.setFieldsValue(res);
    } else if (res.configType == 2) {
      res.allowFlows = undefined;
      form.setFieldsValue(res);
      setDisabled(false);
    }
  };

  useEffect(() => {
    console.log(config);
    let res = form.getFieldsValue();

    if (res.configType == 1) {
      res.allowFlows = nodeConfig?.highConfig?.allowFlows;
      setDisabled(true);
      form.setFieldsValue(res);
    }
  }, []);

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
            <div
              className={styles['title_sp']}
              style={{ marginRight: '16px', marginBottom: '20px' }}
            >
              流程跳转
            </div>
            <Condition r-if={type == 'flow'}>
              <Form.Item name="configType" initialValue={1}>
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
      </Condition>
    </>
  );
};

export default HighConfig;
