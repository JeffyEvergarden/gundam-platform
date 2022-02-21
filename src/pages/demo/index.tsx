import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref, confirm } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const list1: any = []; // 意图列表

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close: onClose,
  }));

  const saveNode = () => {
    console.log(form.getFieldsValue());
  };

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveNode}>
        保存
      </Button>
    </div>
  );

  // const addNew = () => {
  //   const list = form.getFieldValue('list_1') || [];
  //   // list.push({ response_speak: '' });
  //   // form.setFieldsValue({ list_1: [...list] });
  //   add({ response_speak: '' }, list.length);
  // };

  return (
    <Form form={form}>
      <FormList name="list_1">
        {(fields, { add }) => {
          const addNew = () => {
            const list = form.getFieldValue('list_1') || [];
            // list.push({ response_speak: '' });
            // form.setFieldsValue({ list_1: [...list] });
            add({ response_speak: '' }, list.length);
          };

          return (
            <div style={{ paddingLeft: '20px' }}>
              <div className={styles['zy-row']}>
                <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                  静默处理:
                </div>
                <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
              </div>

              {fields.map((field: any, index: number) => (
                <div key={index} className={styles['list-box']} style={{ marginLeft: '30px' }}>
                  <div className={styles['num']}>{index + 1}.</div>
                  <div>
                    <Form.Item
                      name={[field.name, 'response_speak']}
                      fieldKey={[field.fieldKey, 'response_speak']}
                      label="响应话术"
                    >
                      <Input placeholder="请输入响应话术" style={{ width: '400px' }} />
                    </Form.Item>

                    {/* <Form.Item
                        name={[field.name, 'global_var']}
                        fieldKey={[field.fieldKey, 'global_var']}
                        label="选择变量"
                      >
                        <LabelSelect color="blue"></LabelSelect>
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'label_var']}
                        fieldKey={[field.fieldKey, 'label_var']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </Form.Item> */}
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      </FormList>

      {footer}
    </Form>
  );
};

export default DrawerForm;
