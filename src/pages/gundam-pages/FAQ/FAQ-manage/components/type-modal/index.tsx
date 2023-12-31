import { Form, Input, message, Modal } from 'antd';
import { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useTreeModal } from '../../model';
import style from './style.less';

const TypeModal = (props: any) => {
  const { cref, confirm, getTree } = props;

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

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
      console.log(tmpObj);
      // 如果是新增分类节点
      if (type === 'create') {
        let data: any = {
          robotId: info.id,
          parentId: tmpObj.current.node?.key, //当前节点id
          name: res.typeName,
          type: tmpObj.current.node?.type,
        };
        let _res = await addLeaf(data);
        if (_res) {
          // callback?.({
          //   title: data.name,
          //   key: data.name,
          //   children: [],
          // });
          setVisible(false);
          message.success('添加成功');
        }
      } else if (type === 'edit') {
        let data: any = {
          parentId: tmpObj.current.node?.parent?.key || tmpObj.current.node?.parent,
          id: tmpObj.current.node?.key,
          name: res.typeName,
        };
        let _res = await editLeaf(data);
        if (_res) {
          // callback?.({
          //   title: data.title,
          //   key: data.title,
          // });
          setVisible(false);
          message.success('修改成功');
        }
      }
      getTree();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    openModal: (obj: any) => {
      console.log(obj);

      tmpObj.current.node = obj.node;
      tmpObj.current.callback = obj.callback;
      setType(obj.type || 'create');
      form.resetFields();
      if (obj.type === 'edit') {
        form.setFieldsValue({
          typeName: obj.node?.classify,
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
              rules={[
                { required: true, message: '请输入分类名称' },
                { max: 30, message: '不能超过30个字符' },
              ]}
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
