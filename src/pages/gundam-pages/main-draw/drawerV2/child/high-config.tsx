import { useState } from 'react';
import { Form, Select, Button, Checkbox, Space, Radio } from 'antd';
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

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HighConfig = (props: any) => {
  const { form, wishList, bussinessList, type } = props;

  const [flag, setFlag] = useState<boolean>(false);

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
              <Form.Item name="defaultSetting">
                <Radio.Group size="small">
                  <Radio value={1}>默认配置</Radio>
                  <Radio value={2}>自定义配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Condition>
          </Space>
          <FormItem name="allowFlows" label="允许跳转至业务流程" style={{ width: '400px' }}>
            <Select placeholder="请选择允许跳转至业务流程" mode="multiple">
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
