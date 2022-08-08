import { Modal, Tree } from 'antd';
import style from './style.less';
import React, { useImperativeHandle, useState } from 'react';
import MyTree from '../../FAQ-manage/components/my-tree';
import SpCheckbox from '../../question-board/components/sp-checkbox';
import { useModel } from 'umi';
import { useEffect } from 'react';

const ChannelModal: React.FC<any> = (props: any) => {
  const { cref } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [choose, setChoose] = useState<any>([]);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
  }));

  useEffect(() => {
    getChannelList(info.id);
  }, []);

  const submit = () => {};

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  const changeCheckbox = (val: any) => {
    console.log(val);
    setChoose(val);
  };

  return (
    <Modal
      width={650}
      title={'生效渠道配置'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setChoose([]);
      }}
      okText={'确定'}
      onOk={submit}
      // confirmLoading={loading}
    >
      <div>
        <SpCheckbox
          value={choose}
          list={channelList}
          onChange={(val: any[]) => {
            changeCheckbox(val);
          }}
        ></SpCheckbox>
      </div>
    </Modal>
  );
};
export default ChannelModal;
