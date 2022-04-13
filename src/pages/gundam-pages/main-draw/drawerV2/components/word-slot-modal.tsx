import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Form, Input, Select, Checkbox, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styles from '../style.less';
import { useModel } from 'umi';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const WordSlotModal: React.FC<any> = (props: any) => {
  const { cref, confirm, list } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (!obj.slotId) {
        form.resetFields();
        form.setFieldsValue({
          clear_list: [{}],
        });
      } else {
        // console.log(obj);
        form.resetFields();
        form.setFieldsValue({
          ...obj,
        });
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
      const slotId = formValue['slotId'];
      const curItem = list.find((item: any) => {
        return item.id === slotId;
      });
      const newFormValue: any = {
        ...formValue,
        slotName: curItem?.slotName,
        slotDesc: curItem?.slotDesc,
      };
      console.log(newFormValue);

      confirm?.(newFormValue);
      setVisible(false);
    } catch (e) {}
  };

  const onChange = (val: any, opt: any) => {
    // console.log(opt?.opt);
    // form.setFieldsValue({
    //   slotName: opt?.opt?.slotName,
    //   slotDesc: opt?.opt.slotDesc,
    // });
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
            <Select placeholder="请选择词槽名称" onChange={onChange}>
              {list.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
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
            <Checkbox>必填</Checkbox>
          </FormItem>

          <FormList name="clearText">
            {(fields, { add, remove }) => {
              const addNew = () => {
                let length = fields.length;
                add({ speak: '', label_var: [] }, length);
              };

              return (
                <div style={{ marginBottom: '20px' }}>
                  <div className={styles['zy-row']}>
                    <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                      澄清话术:
                    </div>
                    <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
                  </div>

                  {fields.map((field: any, index: number) => (
                    <div
                      key={field.key}
                      className={styles['slot-box']}
                      style={{ marginLeft: '10px' }}
                    >
                      <div className={styles['btn']}>
                        <Button
                          icon={<MinusCircleOutlined />}
                          type="link"
                          danger
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </div>
                      <div className={styles['num']}>{index + 1}.</div>
                      <div></div>
                    </div>
                  ))}
                </div>
              );
            }}
          </FormList>
        </Form>
      </div>
    </Modal>
  );
};

export default WordSlotModal;
