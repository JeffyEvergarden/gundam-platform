import { Form, Input, Modal, Select } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { useSampleModel } from '../../model';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const SampleModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;

  const { addSample, editSample } = useSampleModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      robotId: info.id,
      ...values,
    };
    if (modalType == 'add') {
      await addSample(reqData).then((res) => {
        if (res) {
          close();
        }
      });
    }
    if (modalType == 'edit') {
      await editSample(reqData).then((res) => {
        if (res) {
          close();
        }
      });
    }
  };

  const close = () => {
    form.resetFields();
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (type: any, row?: any) => {
      if (row) {
        console.log(row);
        form.setFieldsValue({
          sampleName: row.sampleName,
        });
      }
      setVisible(true);
      setModalType(type);
    },
    close,
    submit,
  }));

  return (
    <Modal
      width={650}
      title={`${modalType == 'add' ? '新建' : '编辑'}样本集`}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      okText={'提交'}
      onOk={submit}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '400px' }}>
          <FormItem
            rules={[{ required: true, message: '请填写样本集名称' }]}
            name="sampleName"
            label="样本集名称"
            style={{ width: '360px' }}
          >
            <Input maxLength={200}></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default SampleModal;
