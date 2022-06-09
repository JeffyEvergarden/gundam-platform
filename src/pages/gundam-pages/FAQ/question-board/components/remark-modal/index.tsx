import React, { useState, useImperativeHandle, useRef } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import style from './style.less';
import { useModel } from 'umi';

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
      console.log(tmpObj);
      // 如果是新增分类节点
      if (type === 'create') {
        setVisible(false);
        confirm(tmpObj);
      } else if (type === 'edit') {
        setVisible(false);
        confirm(tmpObj);
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
      title={'填写备注'}
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
              name="remark"
              rules={[
                { required: true, message: '请输入备注内容' },
                { max: 200, message: '不能超过200个文字' },
              ]}
            >
              <TextArea placeholder={'请输入备注内容'} maxLength={200} rows={4} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default RemarkModal;
