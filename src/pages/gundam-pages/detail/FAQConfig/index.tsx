import Condition from '@/components/Condition';
import { Button, Form, Input, InputNumber, message, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { useFAQModel } from '../model';
import style from './style.less';

const FAQConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const { Item: FormItem, List: FormList } = Form;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const { getTableList, editFAQ } = useFAQModel();

  const { info, businessFlowId, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
    getGlobalValConfig: model.getGlobalValConfig,
  }));

  const [Nconfig, setNConfig] = useState<any>();
  const [switchType, setSwitchType] = useState<boolean>(false);

  const getList = async () => {
    await getTableList({ robotId: info.id, configType: 2 }).then((res: any) => {
      console.log(res);
      setNConfig(res?.data);
      let obj: any = {};
      res?.data?.forEach((item: any) => {
        if (item.dataType == 4) {
          obj[item.configKey] = item.configValue == '1' ? true : false;
        } else {
          obj[item.configKey] = item.configValue;
        }
      });

      form.setFieldsValue({ systemConfigList: { ...obj } });
    });
  };

  const submit = async () => {
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写项目');
    });
    if (!res) {
      return;
    }
    let _res = Nconfig.map((item: any) => {
      Object.keys(res.systemConfigList).forEach((v) => {
        console.log(item.configKey, v);
        if (item?.configKey == v) {
          if (item.dataType == 4) {
            item.configValue = res.systemConfigList[v] ? '1' : '0';
          } else {
            item.configValue = res.systemConfigList[v];
          }
        }
      });
      return item;
    });

    await editFAQ(_res).then((res) => {
      getList();
    });
    console.log(_res);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={style['machine-page']}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form form={form} {...layout}>
          <div className={style['antd-form']}>
            <Space align="baseline">
              <div
                className={style['title_sp']}
                style={{ marginRight: '16px', marginBottom: '20px' }}
              >
                FAQ配置
              </div>
            </Space>

            {Nconfig?.map((item: any) => {
              if (item?.dataType == 1) {
                return (
                  <FormItem
                    // {...col}
                    label={item.configName}
                    name={['systemConfigList', item.configKey]}
                    key={'systemConfigList' + item.configKey}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: 200 }}
                      min={item?.validateRule?.min ?? 0}
                      max={item?.validateRule?.max ?? undefined}
                      step="1"
                      precision={0}
                      stringMode
                    />
                  </FormItem>
                );
              } else if (item?.dataType == 0) {
                return (
                  <>
                    <Condition r-if={item.configKey == 'FAQ_REJECT_RECOMMEND_TEXT' && switchType}>
                      <FormItem
                        // {...col}
                        label={item.configName}
                        name={['systemConfigList', item.configKey]}
                        key={'systemConfigList' + item.configKey}
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea
                          style={{ width: 300 }}
                          maxLength={item?.validateRule?.max ?? 200}
                        />
                      </FormItem>
                    </Condition>
                    <Condition r-if={item.configKey != 'FAQ_REJECT_RECOMMEND_TEXT'}>
                      <FormItem
                        // {...col}
                        label={item.configName}
                        name={['systemConfigList', item.configKey]}
                        key={'systemConfigList' + item.configKey}
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea
                          style={{ width: 300 }}
                          maxLength={item?.validateRule?.max ?? 200}
                        />
                      </FormItem>
                    </Condition>
                  </>
                );
              } else if (item?.dataType == 4) {
                return (
                  <FormItem
                    // {...col}
                    label={item.configName}
                    name={['systemConfigList', item.configKey]}
                    key={'systemConfigList' + item.configKey}
                    valuePropName="checked"
                    initialValue={false}
                    shouldUpdate={(prevValues, curValues) => {
                      setSwitchType(curValues[item.configKey]);
                      console.log(curValues);

                      return true;
                    }}
                  >
                    <Switch
                      checkedChildren="开启"
                      unCheckedChildren="关闭"
                      onChange={setSwitchType}
                    />
                  </FormItem>
                );
              }
            })}
          </div>
        </Form>
        <Button type="primary" onClick={submit} style={{ alignSelf: 'flex-end' }}>
          保存
        </Button>
      </div>
    </div>
  );
};
export default FAQConfig;
