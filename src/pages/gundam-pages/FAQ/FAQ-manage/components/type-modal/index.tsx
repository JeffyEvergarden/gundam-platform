import React, { useState, useImperativeHandle } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import { useTreeModal } from '../../model';
import { useRef } from 'react';
import style from './style.less';

const TypeModal = (props: any) => {
  const { cref, confirm } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>('create');
  const tmpObj: any = useRef<any>({});

  const [form] = Form.useForm();

  const { addLeaf, editLeaf, deleteLeaf } = useTreeModal();

  const handleOk = async (obj: any) => {
    const res: any = await form.validateFields().catch((err) => false);

    const callback: any = tmpObj.current?.callback;
    console.log(callback);
    // 校验成功
    if (res) {
      // 如果是新增分类节点
      if (type === 'create') {
        let data: any = {
          parent: tmpObj.current.node?.title,
          title: res.typeName,
        };
        let _res = await addLeaf(data);
        if (_res) {
          callback?.({
            title: data.title,
            key: data.title,
            children: [],
          });
          setVisible(false);
          message.success('添加成功');
        }
      } else if (type === 'edit') {
        let data: any = {
          id: tmpObj.current.node?.title,
          title: res.typeName,
        };
        let _res = await editLeaf(data);
        if (_res) {
          callback?.({
            title: data.title,
            key: data.title,
          });
          setVisible(false);
          message.success('修改成功');
        }
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    openModal: (obj: any) => {
      tmpObj.current.node = obj.node;
      tmpObj.current.callback = obj.callback;
      setType(obj.type || 'create');
      form.resetFields();
      if (obj.type === 'edit') {
        form.setFieldsValue({
          typeName: obj.node?.title,
        });
      }
      setVisible(true);
    },
  }));

  return (
    <Modal
      title={type === 'create' ? '添加分类' : '编辑分类'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style['modal-page']}>
        <div className={style['modal-form']}>
          <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} autoComplete="off">
            <Form.Item
              label="分类名称"
              name="typeName"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder={'请输入分类名称'} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default TypeModal;
