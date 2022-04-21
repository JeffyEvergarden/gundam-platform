import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Form, Input, Select, Checkbox, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ConversationConfig from '../child/conversation-config';
import ActionConfig from '../child/action-config';
import styles from '../style.less';
import { useModel } from 'umi';
import Condition from '@/components/Condition';

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
          required: 1,
        });
        setShow(true);
      } else {
        obj = obj || {};
        form.resetFields();
        form.setFieldsValue({
          ...obj,
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

      // 表单配置
      const newForm: any = {
        ...formValue,
        required: formValue.required ? 1 : 0,
        action: formValue.action?.actionType ? formValue.action : undefined,
      };

      const newFormValue: any = {
        ...newForm,
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
          >
            <Checkbox onChange={onChange}>必填</Checkbox>
          </FormItem>

          <Condition r-if={show}>
            <div style={{ paddingTop: '8px' }}>
              <ConversationConfig name={'clearList'} title="澄清话术" placeholder="话术" />
            </div>

            <div style={{ paddingTop: '8px' }}>
              <ActionConfig
                form={form}
                title={'执行动作'}
                formName={'action'}
                name={'action'}
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
