import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from '../drawer/style.less';
import { useModel } from 'umi';

import { useNodeOpsModel } from '../model';
import RuleVarButton from '../drawer/components/rule-var-button';

const { Item: FormItem } = Form;
const { TextArea } = Input;
import config from '@/config';

const EdgeDrawerForm = (props: any) => {
  const { cref, confirm } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const recordInfo = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      form.resetFields();
      form.setFieldsValue(info);
      setVisible(true);
    },
    close: onClose,
  }));

  const { saveLine: _saveLine } = useNodeOpsModel();

  const saveLine = async () => {
    // console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => false);
    if (res === false) {
      return;
    } else {
      let result: any = await _saveLine(res);
      if (result === true) {
        recordInfo.current?.callback?.(res?.name); // 成功回调修改名称
        onClose();
      }
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveLine}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title="连线配置"
      width={850}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      <Form form={form}>
        <div className={styles['antd-form']}>
          <FormItem
            rules={[{ required: true, message: '请输入连线名称' }]}
            name="name"
            label="连线名称"
            style={{ width: '400px' }}
          >
            <Input placeholder="请输入流程名称" maxLength={150} autoComplete="off" />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请输入连线描述' }]}
            name="nodeDesc"
            label="连线描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入流程描述" maxLength={200} />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请输入优先级' }]}
            name="level"
            label="优先级"
            style={{ width: '400px' }}
          >
            <InputNumber
              placeholder="请输入优先级"
              precision={0}
              min={0}
              max={999}
              style={{ width: '120px' }}
            />
          </FormItem>

          <FormItem name="rules" label="规则配置" style={{ width: '400px' }}>
            <RuleVarButton />
          </FormItem>
        </div>
      </Form>
    </Drawer>
  );
};

export default EdgeDrawerForm;
