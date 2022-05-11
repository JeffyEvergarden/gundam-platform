import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import styles from './../index.less';

export default (props: any) => {
  const { visible, cancel, saveSame } = props;

  const onCancel = () => {
    cancel();
  };
  return (
    <Modal
      visible={visible}
      title={'相似语料提醒'}
      // footer={null}
      onCancel={onCancel}
      destroyOnClose={true}
      okText="仍然添加"
      cancelText="我再看看"
      onOk={saveSame}
    >
      <div className={styles.similarSty}>
        <InfoCircleOutlined style={{ color: 'rgba(250, 173, 20, 1)' }} />
        系统检测到与您即将提交的语料相似的语料，如下图所示，请留意是否合并！
      </div>
    </Modal>
  );
};
