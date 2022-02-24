import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Form, Input, Select, Checkbox, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import LabelSelect from './label-select';
import GlobalVarButton from './global-var-button';
import styles from '../style.less';
import { useModel } from 'umi';
import { useForm } from 'antd/lib/form/Form';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const WordSlotModal: React.FC<any> = (props: any) => {
  const { cref, confirm, list } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (!obj) {
        form.resetFields();
        form.setFieldsValue({
          clear_list: [{}],
        });
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    confirm?.();
    setVisible(false);
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
            name="name"
            label="词槽名称"
            style={{ width: '400px' }}
          >
            <Select placeholder="请选择词槽名称">
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
            rules={[{ required: true, message: '请选择词槽是否必填' }]}
            name="flag"
            label="词槽是否必填"
            valuePropName="checked"
            style={{ width: '400px' }}
          >
            <Checkbox>必填</Checkbox>
          </FormItem>

          <FormList name="clear_list">
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
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </div>
                      <div className={styles['num']}>{index + 1}.</div>
                      <div>
                        <Space>
                          <FormItem
                            name={[field.name, 'speak']}
                            fieldKey={[field.fieldKey, 'speak']}
                            label="澄清话术"
                          >
                            <GlobalVarButton
                              placeholder="请输入澄清话术"
                              style={{ width: '400px' }}
                              autoComplete="off"
                            />
                          </FormItem>
                        </Space>

                        <FormItem
                          name={[field.name, 'label_var']}
                          fieldKey={[field.fieldKey, 'label_var']}
                          label="选择标签"
                        >
                          <LabelSelect color="orange"></LabelSelect>
                        </FormItem>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </FormList>

          <FormItem name="exit_speak" label="结束话术">
            <GlobalVarButton
              placeholder="请输入结束话术"
              style={{ width: '400px' }}
              autoComplete="off"
            />
          </FormItem>

          <FormItem name="exit_label_var" label="选择标签">
            <LabelSelect color="orange"></LabelSelect>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default WordSlotModal;
