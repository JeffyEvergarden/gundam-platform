import Condition from '@/components/Condition';
import { Checkbox, Form, Input, Modal, Radio, Select } from 'antd';
import { useImperativeHandle, useState } from 'react';
import ActionConfig from '../child/action-config';
import ConversationConfig from '../child/conversation-config';
import styles from '../style.less';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const WordSlotModal: React.FC<any> = (props: any) => {
  const { cref, confirm, list } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [show, setShow] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (!obj.slotId) {
        form.resetFields();
        form.setFieldsValue({
          required: true,
        });
        // form.setFieldsValue({
        // required: false,
        // });
        setShow(true);
      } else {
        obj = obj || {};
        form.resetFields();
        form.setFieldsValue({
          ...obj,
          config: {
            action: obj?.action || {},
            messageList: obj?.messageList || [],
          },
          required: obj.required === 1,
        });
        setShow(obj.required === 1);
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = async () => {
    try {
      const formValue: any = await form.validateFields();
      console.log(formValue);
      const slotId = formValue['slotId'];
      const curItem = list.find((item: any) => {
        return item.id === slotId;
      });

      console.log(formValue);
      // 表单配置
      const newForm: any = {
        ...formValue,
        ...formValue.config,
        required: formValue.required ? 1 : 0,
      };
      delete newForm.config;

      const newFormValue: any = {
        ...newForm,
        slot: curItem?.slot,
        slotName: curItem?.slotName,
        slotDesc: curItem?.slotDesc,
        slotSource: curItem?.slotSource,
      };

      confirm?.(newFormValue);
      setVisible(false);
    } catch (e) {}
  };

  const onChange = (val: any) => {
    setShow(val.target.checked);
  };

  return (
    <Modal
      width={700}
      title={'选择词槽'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={styles['antd-form']}>
        <Form form={form}>
          <FormItem
            rules={[{ required: true, message: '请选择词槽' }]}
            name="slotId"
            label="词槽名称"
            style={{ width: '400px' }}
          >
            <Select placeholder="请选择词槽名称">
              {list.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.id} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            name="required"
            label="词槽是否必填"
            valuePropName="checked"
            style={{ width: '400px' }}
            rules={[{ required: true, message: '请选择词槽' }]}
            initialValue={true}
          >
            <Checkbox onChange={onChange}>必填</Checkbox>
          </FormItem>

          <FormItem
            name="lifeCycle"
            label="生命周期"
            style={{ width: '400px' }}
            rules={[{ required: true, message: '请选择' }]}
            initialValue={'dialogue'}
          >
            <Radio.Group>
              <Radio value={'dialogue'}>整轮对话有效</Radio>
              <Radio value={'node'}>节点跳转后清空</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            name="preFill"
            label="词槽是否预填充"
            style={{ width: '400px' }}
            rules={[{ required: true, message: '请选择' }]}
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </FormItem>

          <Condition r-if={show}>
            <div style={{ paddingTop: '8px' }}>
              <ConversationConfig
                name={'clearList'}
                title="澄清话术"
                placeholder="话术"
                required={true}
              />
            </div>

            <div style={{ paddingTop: '8px' }}>
              <ActionConfig
                form={form}
                title={'执行动作'}
                formName={'config'}
                name={'config'}
                titleType={2}
              />
            </div>
          </Condition>
        </Form>
      </div>
    </Modal>
  );
};

export default WordSlotModal;
