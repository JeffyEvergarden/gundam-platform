import { Form, InputNumber, Modal, Select } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { useSampleModel } from '../../model';
import style from '../sampleModal/style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const EvaluationModal: React.FC<any> = (props: any) => {
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
    open: () => {
      setVisible(true);
    },
    close,
    submit,
  }));

  return (
    <Modal
      width={650}
      title={'提交评估'}
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
            label="样本集"
            style={{ width: '360px' }}
          >
            <Select placeholder={'请选择'}></Select>
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请填写样本集名称' }]}
            name="sampleName"
            label="阈值"
            style={{ width: '360px' }}
          >
            <InputNumber placeholder={'请输入'} min="0" max="1" step="0.01" precision={2} />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请填写样本集名称' }]}
            name="sampleName"
            label="得分差值"
            style={{ width: '360px' }}
          >
            <InputNumber placeholder={'请输入'} min="0" max="1" step="0.01" precision={2} />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请填写样本集名称' }]}
            name="sampleName"
            label="澄清数量"
            style={{ width: '360px' }}
          >
            <InputNumber placeholder={'请输入'} min={1} max={99} step="1" precision={0} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default EvaluationModal;
