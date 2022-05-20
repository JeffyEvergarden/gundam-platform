import { Modal, Tree } from 'antd';
import style from './style.less';
import React, { useImperativeHandle, useMemo, useState } from 'react';

const ClassifyModal: React.FC<any> = (props: any) => {
  const { cref, treeData, editQ } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [treeSelect, setTreeSelect] = useState<any[]>([]);
  const [QInfo, setQInfo] = useState<any>([]);

  const submit = () => {
    console.log(treeSelect);
    editQ({ id: QInfo?.id, faqTypeId: treeSelect?.[0] });
    setVisible(false);
    // setTreeSelect([]);
  };

  // 树形结构加工
  const processTreeData = (data: any[], parent?: any) => {
    if (!Array.isArray(data)) {
      return [];
    }

    let _data = data.map((item: any) => {
      let obj: any = {
        title: item?.title,
        key: item?.key,
        // parent: parent,
      };
      let children: any = processTreeData(item?.children, obj);
      obj.children = children;
      if (obj.children && obj.children.length > 0) {
        obj.selectable = false;
      }
      return obj;
    });
    return _data;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setTreeSelect([row.faqTypeId]);
      setQInfo(row);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  //树选择
  const onSelect = (val: any) => {
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
      destroyOnClose={true} //关闭销毁
      okText={'确定'}
      onOk={submit}
      // confirmLoading={loading}
    >
      <div className={style['modal_bg']}>
        <Tree
          onSelect={onSelect}
          treeData={processTreeData(treeData)}
          defaultSelectedKeys={treeSelect}
          defaultExpandedKeys={treeSelect}
        />
      </div>
    </Modal>
  );
};
export default ClassifyModal;
