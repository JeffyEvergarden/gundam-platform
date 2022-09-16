import { Button, Form, InputNumber, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from '../FAQConfig/style.less';
import { useFAQModel } from '../model';

const TTSConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const { Item: FormItem, List: FormList } = Form;
  const { Option } = Select;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const timbreList = {
    yizhi: [
      'ZHIYI',
      'ZHISHUO',
      'ZHIDA',
      'ZHIYA',
      'ZHIGUO',
      'ZHIFEI',
      'ZHIXIE',
      'ZHIXUN',
      'ZHILU',
      'ZHIJIN',
      'ZHIJIAO',
      'ZHIYANG',
      'ZHIJIE',
      'ZHIYUN',
      'ZHIHUAN',
      'ZHILONG',
      'ZHIBO',
    ],
    ali: ['xiaoyun', 'aishuo', 'aiya', 'aixia', 'aijing', 'xiaomei', 'xiaogang', 'aimei'],
  };

  const { getTableList, editFAQ, configLoading, getRejectTableList, editRejectTableList } =
    useFAQModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [Nconfig, setNConfig] = useState<any>();

  const getList = async () => {
    await getTableList({ robotId: info.id, configType: 2 }).then((res: any) => {
      // console.log(res);
      // setNConfig(res?.data);
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
    console.log(res);
  };

  useEffect(() => {
    // getList();
  }, []);

  return (
    <div className={style['machine-page']}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form form={form} {...layout}>
          <FormItem
            label={'TTS厂商'}
            name={'manufacturer'}
            key={'manufacturer'}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select style={{ width: 200 }}>
              <Option key={'ali'} value={'ali'}>
                阿里
              </Option>
              <Option key={'yizhi'} value={'yizhi'}>
                一知
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label={'音色'}
            name={'timbre'}
            key={'timbre'}
            rules={[{ required: true, message: '请选择' }]}
            shouldUpdate={(a, b) => {
              return true;
            }}
          >
            <Select style={{ width: 200 }}>
              {timbreList?.[form.getFieldValue('manufacturer')]?.map((item: any) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            // {...col}
            label={'音速'}
            name={'speed'}
            key={'speed'}
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber style={{ width: 200 }} step="1" precision={1} />
          </FormItem>
          <FormItem
            // {...col}
            label={'音调'}
            name={'tone'}
            key={'tone'}
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber style={{ width: 200 }} step="1" precision={1} />
          </FormItem>
        </Form>
        <Button
          type="primary"
          onClick={submit}
          style={{ alignSelf: 'flex-end' }}
          loading={configLoading}
        >
          保存
        </Button>
      </div>
    </div>
  );
};
export default TTSConfig;
