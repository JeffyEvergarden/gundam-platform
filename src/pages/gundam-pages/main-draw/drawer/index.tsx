import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select } from 'antd';
import styles from './index.less';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const list1: any = [];

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close: onClose,
  }));

  return (
    <Drawer
      title="流程图配置"
      width={720}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form}>
        <FormItem
          rules={[{ required: true, message: '请输入流程名称' }]}
          name="name"
          label="流程名称"
          style={{ width: '360px' }}
        >
          <Input placeholder="请输入流程名称" maxLength={150} />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入流程描述' }]}
          name="desc"
          label="流程描述"
          style={{ width: '360px' }}
        >
          <TextArea rows={4} placeholder="请输入流程描述" maxLength={200} />
        </FormItem>

        <FormItem name="wish" label="使用意图" style={{ width: '360px' }}>
          <Select placeholder="请选择使用意图">
            {list1.map((item: any, index: number) => {
              return (
                <Option key={index} value={item.name} opt={item}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
