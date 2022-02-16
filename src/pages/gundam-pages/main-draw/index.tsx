import React, { useRef, useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';

import FlowPage from './flow';
import { PageContainer } from '@ant-design/pro-layout';
import EditorOuterPannel from './flow/components/EditorOuterPanel';
import style from './style.less';
const { TabPane } = Tabs;

const PageView = (props: any) => {
  // 页面 tab
  const [currentPage, setCurrentPage] = useState<any>('paint');
  const [pages, setPages] = useState<any[]>([]);

  const [map, setMap] = useState<any>({});

  // 更改pageTab
  const onChange = (val: any) => {
    console.log('tabChange:');
    console.log(val);
    setCurrentPage(val);
  };
  const onEdit = (val: any) => {
    console.log('tabEdit:', val);
    setPages(pages.filter((item: any) => item.key !== val));
  };

  // 流程图相关
  // -- start-----
  const insertNode = (node: any) => {
    console.log('外层监测到插入Node');
    console.log(node);
    let newPane = {
      key: node.id,
      title: node.label,
      content: node.label,
      closable: true,
    };
    setPages([...pages, newPane]);
  };

  const removeNode = (node: any) => {
    console.log('外层监测到删除Node');
    console.log(node);
    // 删除 Tab
    const newPages = pages.filter((item: any) => {
      return item.key !== node.key;
    });
    if (newPages.length !== pages.length) {
      setPages(newPages);
    }
  };
  const clickItem = (node: any) => {
    console.log('点击左边菜单节点事件');
    console.log(node);
    let key = pages.findIndex((item: any) => {
      return item.key === node.id;
    });
    if (key > -1) {
      // 已存在tab了
      return;
    }
    let newPane = {
      key: node.id,
      title: node.label,
      content: node.label,
      closable: true,
    };
    setPages([...pages, newPane]);
  };

  const save = (obj: any) => {
    console.log('保存提交', obj);
  };
  // 初始化
  const fake = useRef<any>(null);
  // 初始化测试
  useEffect(() => {
    (fake.current as any).init({
      nodes: [
        {
          id: '03c9203b',
          color: '#78f3f3',
          label: 'fake',
          shape: 'flow-rect',
          size: '80*30',
          taskId: 'fake',
          x: 100,
          y: 100,
        },
      ],
    });
  }, []);
  // -- end-----

  return (
    <div className={style['main-draw']}>
      <div className={style['container']}>
        <div className={style['container_left']}>
          <EditorOuterPannel clickItem={clickItem} />
        </div>
        <div className={style['container_right']}>
          <FlowPage
            insertNode={insertNode}
            removeNode={removeNode}
            save={save}
            clickItem={clickItem}
            cref={fake}
          />
        </div>
      </div>
    </div>
  );
};

export default PageView;
