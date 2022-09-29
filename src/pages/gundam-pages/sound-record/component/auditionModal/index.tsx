import AudioPlay from '@/components/AudioPlay';
import config from '@/config';
import { Modal } from 'antd';
import React, { useImperativeHandle, useState } from 'react';

const AuditionModal: React.FC<any> = (props: any) => {
  const { cref } = props;
  const [visible, setVisible] = useState<any>(false);
  const [soundInfo, setSoundInfo] = useState<any>({});

  useImperativeHandle(cref, () => ({
    open: (r: any) => {
      setVisible(true);
      setSoundInfo(r);
    },
  }));

  return (
    <Modal
      width={650}
      title={'试听录音'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={null}
    >
      <AudioPlay musicSrc={`${config.basePath}/robot/file/getFile?path=${soundInfo?.soundPath}`} />
    </Modal>
  );
};

export default AuditionModal;
