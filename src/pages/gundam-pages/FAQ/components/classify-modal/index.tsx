import { Modal, Tree } from 'antd';
import style from './style.less';
import React, { useImperativeHandle, useState } from 'react';
import MyTree from '../../FAQ-manage/components/my-tree';

const ClassifyModal: React.FC<any> = (props: any) => {
  const { cref, treeData } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [treeSelect, setTreeSelect] = useState<any[]>([]);

  const submit = () => {
    console.log(treeSelect);
    setTreeSelect([]);
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  //树选择
  const onCheck = (val: any) => {
    console.log(val);
    setTreeSelect(val);
  };

  return (
    <Modal
      width={650}
      title={'问题分类配置'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setTreeSelect([]);
      }}
      okText={'确定'}
      onOk={submit}
      // confirmLoading={loading}
    >
      <div className={style['modal_bg']}>
        <Tree showLine checkable onCheck={onCheck} treeData={treeData} />
      </div>
    </Modal>
  );
};
export default ClassifyModal;
