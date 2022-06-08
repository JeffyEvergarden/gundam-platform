import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Form, Input, Modal } from 'antd';
import { useModel } from 'umi';
import style from './style.less';

const ReasonModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;
  const [form] = Form.useForm();

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<any>('');

  useImperativeHandle(cref, () => ({
    open: (title: any) => {
      setType(title);
      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    setVisible(false);
  };

  return (
    <Modal
      width={450}
      title={type || '标题'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <Form form={form}>
        <Form.Item label={'备注'}>
          <Input.TextArea placeholder="请填写退回原因" maxLength={200}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReasonModal;
