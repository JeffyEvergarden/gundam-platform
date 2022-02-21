import React, { useRef, useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';

import FlowPage from './flow';
import { useModel } from 'umi';
import EditorOuterPannel from './flow/components/EditorOuterPanel';
import DrawerForm from './drawer';
import style from './style.less';
import { useNodeOpsModel } from './model';

const { TabPane } = Tabs;

const MainDraw = (props: any) => {
  // 初始化
  const fake = useRef<any>(null);

  const drawerRef = useRef<any>(null);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { addNode, deleteNode, updateNode, getMachineMainDraw } = useNodeOpsModel();

  // 流程图相关 -----------------------
  // -- start-----
  const insertNode = async (node: any) => {
    console.log('外层监测到插入Node');
    console.log(node);
    // color: #1890FF 普通节点、 #fffbe6 业务节点
    let params: any = {
      ...node,
      id: node.id, // 前端id
      label: node.label,
    };
    let res = await addNode(params);
    if (res === false) {
      (fake.current as any).deleteNode(node);
    }
  };

  const removeNode = async (node: any) => {
    console.log('外层监测到删除Node');
    console.log(node);
    let params: any = {
      id: node.id, // 前端id
    };
    let res = await deleteNode(params);
    if (res === false) {
      // 删除失败 - 返回上一步
      (fake.current as any).executeCommand?.('undo');
    }
  };

  const clickItem = (node: any) => {
    console.log('点击左边菜单节点事件');
    console.log(node);
  };

  const save = (obj: any) => {
    console.log('保存提交', obj);
  };

  // 初始情况默认去加载当前机器人信息

  const getMachineInfo = async () => {
    let data: any = await getMachineMainDraw({ id: info.id });
    let { nodes = [] } = data || {};
    (fake.current as any)?.init?.({
      nodes: nodes,
    });
  };

  const openSetting = async (info: any) => {
    console.log('设置信息:');
    console.log(info);
    (drawerRef.current as any).open(info);
  };

  // 初始化设置
  useEffect(() => {
    getMachineInfo();
    (drawerRef.current as any).open();
  }, []);
  // -- end-----

  return (
    <div className={style['main-draw']}>
      <div className={style['container']}>
        {/* <div className={style['container_left']}>
          <EditorOuterPannel clickItem={clickItem} />
        </div> */}
        <div className={style['container_right']}>
          <FlowPage
            insertNode={insertNode}
            removeNode={removeNode}
            openSetting={openSetting}
            save={save}
            clickItem={clickItem}
            cref={fake}
          />
        </div>
      </div>

      <DrawerForm cref={drawerRef} />
    </div>
  );
};

export default MainDraw;
