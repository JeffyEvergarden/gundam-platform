import { Button, Checkbox, DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useTestModel } from '../../../model';
import TemporaryTestModal from '../temporaryTestModal';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;
const extra = {
  autoComplete: 'off',
};

const InfoModal: React.FC<any> = (props: any) => {
  const { cref } = props;

  const { saveTest, temporaryTest } = useTestModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const testRef = useRef();

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const date = [
    {
      key: '天',
      value: 'day',
    },
    {
      key: '周',
      value: 'week',
    },
    {
      key: '月',
      value: 'month',
    },
  ];

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      ...values,
      autoClear: values?.autoClear ? 1 : 0,
    };
    let res = await saveTest(reqData);
    if (res) {
      setVisible(false);
    }
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  const _temporaryTest = async () => {
    const values = await form.validateFields();

    let reqData = {
      threshold: values.threshold,
      robotId: info.id,
    };
    let res = await temporaryTest(reqData);
    if (res) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      width={650}
      title={'检测计划管理'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'保存'}
      onOk={submit}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          <div className={style['icon-box']}>
            <FormItem style={{ marginRight: '6px' }}>检测周期：每</FormItem>
            <FormItem name="testingCycle" style={{ width: '100px', marginRight: '6px' }}>
              <InputNumber min={1} max={99} step="1" precision={0} />
            </FormItem>
            <FormItem name="testingRule" style={{ marginRight: '6px' }} initialValue={'day'}>
              <Select>
                {date.map((item) => (
                  <Option key={item.key} value={item.value}>
                    {item.key}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem style={{ marginRight: '6px' }}>检测1次</FormItem>
          </div>

          <div className={style['icon-box']}>
            <FormItem style={{ marginRight: '6px' }}>首次检测日期：</FormItem>
            <FormItem name="firstTestingTime" style={{ width: '100px', marginRight: '6px' }}>
              <DatePicker style={{ width: '200px' }} />
            </FormItem>
          </div>

          <div className={style['icon-box']}>
            <FormItem style={{ marginRight: '6px' }}>相似度阈值：</FormItem>
            <FormItem
              rules={[{ required: true, message: '请输入' }]}
              name="threshold"
              style={{ width: '100px' }}
              initialValue={0.9}
            >
              <InputNumber min="0" max="1" step="0.01" precision={2} />
            </FormItem>
          </div>

          <FormItem>
            <Button
              type={'primary'}
              onClick={() => {
                (testRef?.current as any)?.open?.();
              }}
            >
              临时检测
            </Button>
          </FormItem>

          <div className={style['icon-box']}>
            <FormItem
              name="autoClear"
              valuePropName="checked"
              // style={{ width: '100px' }}
              initialValue={false}
            >
              <Checkbox>自动清除</Checkbox>
            </FormItem>
            <FormItem name="clearNumber" style={{ marginRight: '6px' }} initialValue={1}>
              <InputNumber min={1} max={12}></InputNumber>
            </FormItem>
            <FormItem>月之前的检测结果明细数据</FormItem>
          </div>
        </Form>
      </div>
      <TemporaryTestModal cref={testRef} confirm={_temporaryTest}></TemporaryTestModal>
    </Modal>
  );
};

export default InfoModal;
