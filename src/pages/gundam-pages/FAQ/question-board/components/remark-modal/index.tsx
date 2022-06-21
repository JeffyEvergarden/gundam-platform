import { Form, Input, Modal } from 'antd';
import { useImperativeHandle, useRef, useState } from 'react';
import style from './style.less';

const { TextArea } = Input;

const RemarkModal = (props: any) => {
  const { cref, confirm } = props;

  // const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
  //   info: model.info,
  //   setInfo: model.setInfo,
  // }));

  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>('create');
  const tmpObj: any = useRef<any>({});

  const [form] = Form.useForm();

  const handleOk = async (obj: any) => {
    const res: any = await form.validateFields().catch((err) => false);

    const callback: any = tmpObj.current?.callback;
    console.log(callback);
    // 校验成功
    if (res) {
      console.log(res);
      // 如果是新增分类节点
      if (type === 'create') {
        setVisible(false);
        confirm(res);
      } else if (type === 'edit') {
        setVisible(false);
        confirm(res);
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      console.log(obj);
      tmpObj.current.node = obj.node;
      tmpObj.current.callback = obj.callback;
      setType(obj.type || 'create');
      form.resetFields();
      if (obj.type === 'edit') {
        form.setFieldsValue(obj.info);
      }
      setVisible(true);
    },
  }));

  return (
    <Modal
      title={'提交'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <div className={style['modal-page']}>
        <div className={style['modal-form']}>
          <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} autoComplete="off">
            <Form.Item
              label="备注"
              name="reason"
              rules={[
                { required: true, message: '请输入备注内容' },
                { max: 200, message: '不能超过200个文字' },
              ]}
            >
              <TextArea
                placeholder={
                  '为了让审批人员快速了解本次提交的内容，请简明扼要说明本次修改的原由及修改要点，限200字'
                }
                maxLength={200}
                rows={4}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default RemarkModal;
