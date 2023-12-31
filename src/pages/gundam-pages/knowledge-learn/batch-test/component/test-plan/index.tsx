import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { Checkbox, DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import moment from 'moment';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useTestModel } from '../../../model';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;
const extra = {
  autoComplete: 'off',
};

const TestPlanModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;

  const { saveTest, saveTemporary, getTestTaskInfo } = useTestModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const testRef = useRef();

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [pageType, setPageType] = useState<string>('');
  const [check, setCheck] = useState<boolean>(false);

  const date = [
    // {
    //   key: '天',
    //   value: 'day',
    // },
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
      autoClear: values?.autoClear == true ? 1 : values?.autoClear == false ? 0 : undefined,
      robotId: info.id,
      firstTestingTime: values?.firstTestingTime?.format('YYYY-MM-DD HH:mm:ss'),
    };
    // if (values?.unThreshold >= values?.threshold) {
    //   message.warning('【不相似阈值】必须小于【相似阈值】');
    //   return;
    // }
    let res: any;
    if (pageType == 'plan') {
      res = await saveTest(reqData);
    } else {
      res = await saveTemporary(reqData);
    }
    if (res) {
      refresh();
      setVisible(false);
    }
  };

  useImperativeHandle(cref, () => ({
    open: (type: any) => {
      setPageType(type);
      // if (type == 'plan') {
      getTestTaskInfo({ robotId: info.id, temporaryTest: type == 'plan' ? 0 : 1 }).then(
        (res: any) => {
          let formData = res;
          if (type == 'plan') {
            formData.autoClear =
              formData?.autoClear == 1 ? true : formData?.autoClear == 0 ? false : undefined;
            formData.firstTestingTime = formData?.firstTestingTime
              ? moment(formData?.firstTestingTime)
              : undefined;
            setCheck(formData.autoClear);
          }
          form.setFieldsValue(formData);
        },
      );
      // }
      setVisible(true);
    },
    close: () => {
      form.resetFields();
      setVisible(false);
    },
    submit,
  }));

  // const _temporaryTest = async () => {
  //   const values = await form.validateFields();

  //   let reqData = {
  //     threshold: values.threshold,
  //     robotId: info.id,
  //   };
  //   let res = await temporaryTest(reqData);
  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const disabledDate: any = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  return (
    <Modal
      width={650}
      title={'检测计划管理'}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      okText={'提交'}
      onOk={submit}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '400px' }}>
          <Condition r-if={pageType == 'plan'}>
            <div className={style['icon-box']}>
              <FormItem style={{ marginRight: '6px' }}>检测周期：每</FormItem>
              <FormItem name="testingCycle" style={{ width: '100px', marginRight: '6px' }}>
                <InputNumber min={1} max={99} step="1" precision={0} />
              </FormItem>
              <FormItem name="testingRule" style={{ marginRight: '6px' }} initialValue={'week'}>
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
          </Condition>

          <Condition r-if={pageType == 'plan'}>
            <div className={style['icon-box']}>
              <FormItem style={{ marginRight: '6px' }}>首次检测日期：</FormItem>
              <FormItem name="firstTestingTime" style={{ width: '100px', marginRight: '6px' }}>
                <DatePicker style={{ width: '200px' }} disabledDate={disabledDate} />
              </FormItem>
            </div>
          </Condition>

          <div className={style['icon-box']}>
            <FormItem style={{ marginRight: '6px' }}>相似阈值：</FormItem>
            <FormItem
              rules={[{ required: true, message: '请输入' }]}
              name="threshold"
              style={{ width: '100px' }}
              initialValue={0.9}
            >
              <InputNumber min="0" max="1" step="0.01" precision={2} />
            </FormItem>
            <Tip title="大于“相似阈值”且不归属于同一意图或FAQ的样本对，认定为异常样本对。" />
          </div>
          <div className={style['icon-box']}>
            <FormItem style={{ marginRight: '6px' }}>不相似阈值：</FormItem>
            <FormItem
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请输入' },
                () => ({
                  async validator(_, value) {
                    if (value === undefined) {
                      return;
                    }
                    if (value >= form.getFieldValue('threshold')) {
                      return Promise.reject(new Error('【不相似阈值】必须小于【相似阈值】'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              name="unThreshold"
              style={{ width: '100px' }}
              initialValue={0.5}
            >
              <InputNumber min="0" max="1" step="0.01" precision={2} />
            </FormItem>
            <Tip title="小于“不相似阈值”且归属于同一意图或FAQ的样本对，认定为异常样本对。" />
          </div>
          <Condition r-if={pageType == 'temporary'}>
            <div className={style['icon-box']}>
              <FormItem style={{ color: '#666' }}>
                执行检测时会消耗比较大的服务器资源，检测将会在明天凌晨2点执行，您确定提交吗？
              </FormItem>
            </div>
          </Condition>

          <Condition r-if={pageType == 'plan'}>
            <div className={style['icon-box']}>
              <FormItem
                name="autoClear"
                valuePropName="checked"
                // style={{ width: '100px' }}
                initialValue={false}
              >
                <Checkbox
                  onChange={(e) => {
                    console.log(e);
                    setCheck(e.target.checked);
                    form.validateFields(['clearNumber']);
                  }}
                >
                  自动清除
                </Checkbox>
              </FormItem>
              <FormItem
                name="clearNumber"
                style={{ marginRight: '6px' }}
                rules={[{ required: check, message: '请输入' }]}
              >
                <InputNumber min={1} max={12} />
              </FormItem>
              <FormItem>个月之前的检测结果明细数据</FormItem>
            </div>
          </Condition>
        </Form>
      </div>
      {/* <TemporaryTestModal cref={testRef} confirm={_temporaryTest}></TemporaryTestModal> */}
    </Modal>
  );
};

export default TestPlanModal;
