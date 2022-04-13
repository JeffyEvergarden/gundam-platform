import { useState } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber } from 'antd';
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
  const { form, wishList, bussinessList } = props;

  const [flag, setFlag] = useState<boolean>(false);

  return (
    <>
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

      <Condition r-show={flag}>
        <div className={styles['antd-form']}>
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

        <HightformTemplate form={form} name="silenceAction" title={'静默'} />

        <HightformTemplate form={form} name="rejectAction" title={'拒识'} />

        <HightformTemplate form={form} name="clearAction" title={'澄清'} />

        <HightformTemplate form={form} name="unclearAction" title={'客户未听清'} />
      </Condition>
    </>
  );
};

export default HighConfig;
