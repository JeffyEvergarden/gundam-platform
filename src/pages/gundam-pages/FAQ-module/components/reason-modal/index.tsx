import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { useModel } from 'umi';
import style from './style.less';
import { useApprovalModel } from '../awaitList/model';
import config from '@/config';

const ReasonModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;
  const [form] = Form.useForm();
  const { approvalReturn, approvalDelete } = useApprovalModel();

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<any>('');
  const [questionInfo, setQuestionInfo] = useState<any>();

  useImperativeHandle(cref, () => ({
    open: (row: any, title: any) => {
      form.resetFields();
      setQuestionInfo(row);
      setType(title);
      setVisible(true);
    },
    close,
  }));

  const submit = async () => {
    let val: any = await form.validateFields();
    console.log(val);
    let res: any;
    if (type == '退回') {
      res = await approvalReturn({ id: questionInfo?.id, ...val });
    } else if (type == '删除') {
      res = await approvalDelete({ id: questionInfo?.id, ...val });
    } else {
      message.info('非退回非删除');
    }
    if (res) {
      refresh();
      close();
    }
  };

  const close = () => {
    setVisible(false);
  };

  return (
    <Modal
      width={450}
      title={type || '标题'}
      visible={visible}
      onCancel={() => close()}
      okText={'确定'}
      onOk={submit}
    >
      <Form form={form}>
        <Form.Item
          label={'备注'}
          name={'approvalReason'}
          rules={[{ required: true, message: `请填写${type}原因` }]}
        >
          <Input.TextArea placeholder={`请填写${type}原因`} maxLength={200}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReasonModal;
