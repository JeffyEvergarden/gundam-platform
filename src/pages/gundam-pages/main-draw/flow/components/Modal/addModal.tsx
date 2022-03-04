import React, { useEffect, useState } from 'react';
import { Form, Select, message, Modal, Input } from 'antd';
import { useImperativeHandle } from 'react';

const { Item: FormItem } = Form;
interface BaseFormProps {
  confirm?: (store: any) => void;
  cref?: any;
  list?: any[];
}

const AddModal: React.FC<BaseFormProps> = (props) => {
  const { confirm, cref, list } = props;
  const [form] = Form.useForm();

  // 显示按钮
  const [visible, setVisible] = useState<boolean>(false);

  const [id, setId] = useState<any>('');

  const [libraryList, setLibraryList] = useState<any[]>(list || []);

  const save = async () => {
    form
      .validateFields()
      .then((res) => {
        if (id) {
          console.log(res);
          confirm?.({ ...res, id });
        } else {
          confirm?.(res);
        }
        setVisible(false);
      })
      .catch((err) => {
        message.warning('参数报错');
      });
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open(obj: any) {
      if (obj?.id) {
        // 有id
        setId(obj.id);
        if (obj.extra) {
          // 有详情对象
          form.setFieldsValue({ taskId: '', taskName: '', codeType: undefined, ...obj.extra });
        } else {
          form.setFieldsValue({ taskId: '', taskName: '', codeType: undefined });
        }
      } else {
        setId('');
        form.setFieldsValue({ taskId: '', taskName: '', codeType: undefined });
      }
      setVisible(true);
    },
    close() {
      setVisible(false);
    },
  }));

  useEffect(() => {
    setLibraryList(list || []);
  }, [list]);

  return (
    <Modal
      title={id ? '编辑任务' : '新建任务'}
      visible={visible}
      onOk={save}
      okText={'确定'}
      width={'480px'}
      onCancel={close}
      cancelText={'取消'}
    >
      <div>
        <Form form={form}>
          <FormItem
            name="taskId"
            label="TASK_ID"
            labelAlign="right"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请输入TASK_ID',
              },
            ]}
          >
            <Input
              placeholder="请输入TASK_ID"
              autoComplete="off"
              style={{ width: '300px' }}
              maxLength={200}
            ></Input>
          </FormItem>

          <FormItem
            name="taskName"
            label="任务名称"
            labelAlign="right"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请输入任务名称',
              },
            ]}
          >
            <Input
              placeholder="请输入任务名称"
              autoComplete="off"
              maxLength={30}
              style={{ width: '300px' }}
            ></Input>
          </FormItem>

          <FormItem
            name="codeType"
            label="任务脚本类型"
            labelAlign="right"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
                message: '请选择任务脚本类型',
              },
            ]}
          >
            <Select placeholder="请选择任务脚本类型" style={{ width: '300px' }}>
              {libraryList.map((item: any) => {
                return (
                  <Select.Option value={item.value} key={item.value} item={item}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default AddModal;
