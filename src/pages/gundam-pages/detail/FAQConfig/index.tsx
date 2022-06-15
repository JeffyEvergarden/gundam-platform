import { Button, Form, Input, InputNumber, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { useFAQModel } from '../model';
import style from './style.less';

const FAQConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const { Item: FormItem, List: FormList } = Form;

  const { getTableList, editFAQ } = useFAQModel();

  const { info, businessFlowId, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
    getGlobalValConfig: model.getGlobalValConfig,
  }));

  const [Nconfig, setNConfig] = useState<any>();

  const getList = async () => {
    await getTableList({ robotId: info.id, configType: 2 }).then((res: any) => {
      console.log(res);
      setNConfig(res?.data);
      let obj: any = {};
      res?.data?.forEach((item: any) => {
        obj[item.configKey] = item.configValue;
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
          item.configValue = res.systemConfigList[v];
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
        <Form form={form}>
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
                    <InputNumber style={{ width: 200 }} min={0} step="1" precision={0} stringMode />
                  </FormItem>
                );
              } else if (item?.dataType == 0) {
                return (
                  <FormItem
                    // {...col}
                    label={item.configName}
                    name={['systemConfigList', item.configKey]}
                    key={'systemConfigList' + item.configKey}
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea style={{ width: 300 }} maxLength={200} />
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
