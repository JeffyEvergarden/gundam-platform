import { Modal } from 'antd';
import { useImperativeHandle, useState } from 'react';

const ReasonModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close,
  }));

  const close = () => {
    setVisible(false);
  };

  const submit = async () => {
    let res = await confirm();
    if (res) {
      close();
    }
  };

  return (
    <Modal
      width={450}
      title={'检测计划管理'}
      visible={visible}
      onCancel={() => close()}
      okText={'提交'}
      onOk={submit}
    >
      执行检测时会消耗比较大的服务器资源，有可能影响服务器日常的对外服务，您确定现在提交并执行检测吗？
    </Modal>
  );
};

export default ReasonModal;
