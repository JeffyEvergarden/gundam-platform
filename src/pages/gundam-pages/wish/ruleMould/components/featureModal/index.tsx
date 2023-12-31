import Tip from '@/components/Tip';
import { Form, Input, Modal, Space } from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default (props: any) => {
  const { visible, type, cancel, save, modalData } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    visible &&
      form.setFieldsValue({
        key: modalData?.key,
        name: modalData?.name,
        wordSet: modalData?.wordSet,
      });
  }, [visible]);

  const onCancel = () => {
    cancel();
  };

  const submit = async () => {
    const values = await form.validateFields();
    save(values);
  };
  return (
    <Modal
      visible={visible}
      title={type === 'edit' ? '编辑特征词' : '添加特征词'}
      okText={'提交'}
      onCancel={onCancel}
      destroyOnClose={true}
      onOk={submit}
    >
      <Form form={form} {...layout}>
        <Form.Item
          name={'key'}
          label={'特征ID'}
          rules={[
            { required: true, message: '请输入特征ID' },
            { pattern: /^[A-zA-Z_]+$/g, message: '仅支持英文大小写与下划线"_"' },
          ]}
        >
          <Input
            placeholder={'仅支持英文大小写与下划线"_",一经定义不可修改'}
            disabled={type === 'edit'}
            maxLength={150}
          />
        </Form.Item>
        <Form.Item
          name={'name'}
          label={'特征名称'}
          rules={[{ required: true, message: '请输入特征名称' }]}
        >
          <Input placeholder={'请输入特征名称'} maxLength={150} />
        </Form.Item>
        <Form.Item label={'特征词集'}>
          <Space align="baseline">
            <Form.Item
              name={'wordSet'}
              noStyle
              rules={[{ required: true, message: '请输入特征词集' }]}
            >
              <TextArea
                placeholder={'请输入特征词集'}
                maxLength={200}
                rows={4}
                style={{ width: '354px' }}
              />
            </Form.Item>
            <Tip
              title={<>多个特征词换行输入，是一类描述的集合。例如“请问”、“问一下”、“请问一下”。</>}
            />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
