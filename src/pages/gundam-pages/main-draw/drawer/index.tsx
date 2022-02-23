import { useState, useImperativeHandle, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { BUSINESS_NODE_LIST, LABEL_LIST } from './test';
import { ACTION_LIST } from './const';
import ConversationConfig from './child/conversation-config';
import HighConfig from './child/high-config';
import RuleModal from './components/rule-modal';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref, confirm } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const list1: any = []; // 意图列表

  const list2: any = BUSINESS_NODE_LIST; // 业务流程节点

  const list3: any = LABEL_LIST; // 标签列表
  // -----------------------
  const [testVal, setTestVal] = useState<any>('');

  const onChange = (val: any) => {
    console.log(val);
    setTestVal(val);
  };

  const fake = useRef<any>(null);
  const [form2] = Form.useForm();
  // 打开弹窗
  const openModal = () => {
    fake.current.open();
  };

  // ------------------------

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

  return (
    <Drawer
      title="节点配置"
      width={820}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
    >
      <Form form={form}>
        <div className={styles['antd-form']}>
          <FormItem
            rules={[{ required: true, message: '请输入流程名称' }]}
            name="name"
            label="节点名称"
            style={{ width: '400px' }}
          >
            <Input placeholder="请输入流程名称" maxLength={150} autoComplete="off" />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请输入流程描述' }]}
            name="desc"
            label="节点描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入流程描述" maxLength={200} />
          </FormItem>
        </div>
        {/* <FormItem name="rules" label="添加规则">
          ---------
        </FormItem> */}

        <ConversationConfig form={form}></ConversationConfig>

        <HighConfig form={form} wishList={list1} bussinessList={list2}></HighConfig>
      </Form>

      <Button onClick={openModal}>添加规则</Button>

      <RuleModal cref={fake} wishList={list1} />
    </Drawer>
  );
};

export default DrawerForm;
