import Condition from '@/components/Condition';
import { Button, Checkbox, Form, InputNumber, message, Space, Switch } from 'antd';
import styles from './style.less';

const ShuntConfig = (props: any) => {
  const { form, lineShuntNum } = props;
  const { Item: FormItem, List: FormList } = Form;
  const shunt: any = Form.useWatch('lineShuntInfoList', form);
  const shuntSwitch: any = Form.useWatch('shuntSwitch', form);

  const switchChange = (val: any) => {
    let formData = form.getFieldsValue();
    if (lineShuntNum <= 1) {
      message.warning('当前父节点下只有一条线无法进行分流配置，请保存重试');
      formData.ruleSwitch = 1;
      formData.shuntSwitch = 0;
      form.setFieldsValue({ ...formData });
      return;
    }
    if (val) {
      formData.ruleSwitch = 0;
      formData.shuntSwitch = 1;
    } else {
      formData.ruleSwitch = 1;
      formData.shuntSwitch = 0;
    }
    console.log(formData);
    form.setFieldsValue({ ...formData });
  };

  const checkboxChange = (e: any, index: any) => {
    let formData = form.getFieldsValue();
    let shuntData = formData?.['lineShuntInfoList'];
    console.log(formData);
    if (e.target.checked) {
      shuntData?.map((item: any, idx: any) => {
        if (index == idx) {
          item.pocketBottom = 1;
          item.shuntProportion = undefined;
          item.shuntThreshold = undefined;
        } else {
          item.pocketBottom = 0;
        }
      });
    } else {
      shuntData[index].pocketBottom = 0;
    }
    form.setFieldsValue({ ...formData });
  };

  return (
    <div>
      <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
        <div className={styles['title_sp']}>分流配置</div>
        <FormItem name={'shuntSwitch'} noStyle initialValue={0}>
          <Switch
            style={{ marginLeft: '8px' }}
            onChange={switchChange}
            checked={shuntSwitch}
          ></Switch>
        </FormItem>
      </div>
      <Condition r-if={shuntSwitch}>
        <FormList name={'lineShuntInfoList'}>
          {(outFields, { add: _add, remove: _remove }) => {
            return (
              <div>
                {outFields.map((field: any, index: number) => {
                  return (
                    <Space align="baseline" key={index}>
                      <div>连线名称：{shunt?.[index]?.lineName || '-'}</div>
                      <FormItem label="分流配比" style={{ marginLeft: '24px' }}>
                        <FormItem
                          noStyle
                          name={[field.name, 'shuntProportion']}
                          rules={[
                            {
                              required: !shunt?.[index]?.['pocketBottom'],
                              message: '分流配比必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            max={100}
                            precision={0}
                            disabled={shunt?.[index]?.['pocketBottom']}
                          />
                        </FormItem>
                        <span>&nbsp;%</span>
                      </FormItem>
                      <FormItem label="阈值" style={{ marginLeft: '24px' }}>
                        <FormItem
                          // label="阈值"
                          noStyle
                          name={[field.name, 'shuntThreshold']}
                          // style={{ marginLeft: '24px' }}
                          rules={[
                            {
                              required: !shunt?.[index]?.['pocketBottom'],
                              message: '阈值必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            precision={0}
                            disabled={shunt?.[index]?.['pocketBottom']}
                          />
                        </FormItem>
                      </FormItem>

                      <FormItem name={[field.name, 'pocketBottom']}>
                        <Checkbox
                          onChange={(e: any) => {
                            checkboxChange(e, index);
                          }}
                          checked={shunt?.[index]?.['pocketBottom'] || false}
                        />
                      </FormItem>
                    </Space>
                  );
                })}
              </div>
            );
          }}
        </FormList>
      </Condition>
    </div>
  );
};
export default ShuntConfig;
