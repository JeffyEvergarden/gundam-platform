import { Col, Row, message } from 'antd';
import GGEditor, { Flow, Item } from 'gg-editor';

import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from '../EditorDetailPanel'; //
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import { useEffect, useMemo, useRef } from 'react';
import { judgeLineByNode } from './utils/util';
import eventbus from './utils/eventbus';
import { useImperativeHandle } from 'react';

GGEditor.setTrackable(false);

interface PageViewProps {
  cref?: any;
  type?: any;
  save?: (node: any) => void;
  insertNode?: (node: any) => void;
  removeNode?: (node: any) => void;
  clickItem?: (node: any) => void;
  openSetting?: (node: any) => void;
  openEdgeSetting?: (node: any) => void;
}

const EditorView = (props: PageViewProps) => {
  const { type = 'main', insertNode, removeNode, save, cref, openSetting, openEdgeSetting } = props;

  const editorRef = useRef<any>(null);

  // 可以输出看看有啥方法
  // useEffect(() => {
  //   console.log(editorRef.current?.propsAPI);
  // }, []);

  // 获取 propsAPI
  const getPropsAPI = () => {
    return editorRef.current?.propsAPI;
  };

  // 初始化
  useImperativeHandle(cref, () => ({
    init: (initData: any) => {
      // 初始化
      console.log('初始化画布数据', initData);
      const propsAPI = getPropsAPI();
      propsAPI?.read?.(initData || {});
      refreshOtherPane();
    },
    deleteNode,
    updateNode,
    executeCommand: (...args: any[]) => {
      const propsAPI = getPropsAPI();
      propsAPI?.executeCommand(...args);
    },
    find: (id: string) => {
      const propsAPI = getPropsAPI();
      return propsAPI?.find(id)?.getModel() || null;
    },
  }));

  // 刷新
  const refreshOtherPane = () => {
    const [nodes] = getAllNode();
    eventbus.$emit('flashNodeList', nodes);
  };

  // 获取所有节点
  const getAllNode = () => {
    const propsAPI = getPropsAPI();
    const rep = propsAPI.save();
    const nodes = rep.nodes || []; // 节点
    // index：序号   id：标识  type：类型
    const edges = rep.edges || []; // 线
    //  index 、 id 、 source 、 target
    // console.log('nodes:', nodes);
    // console.log('edges:', edges);
    return [nodes, edges];
  };

  // 删除节点 by id 或者 对象的id
  const deleteNode = (item: any) => {
    const propsAPI = getPropsAPI();
    propsAPI.remove(item.id || item);
    refreshOtherPane();
  };

  // 插入节点
  const _insert = (event: any) => {
    if (event.action === 'add') {
      // 插入事件
      // 插入前是没有item的，插入后追加的
      if (event?.item.type === 'node') {
        // 节点是 node （节点随便插入）
        insertNode?.(event.model);
        refreshOtherPane();
      } else if (event?.item.type === 'edge') {
        // 节点是线 （线不能随便连）
        console.log('插线');
        _insertLine(event);
      }
    }
  };

  // 插入线
  // 这跟线没有其他源指向它
  const _insertLine = (event: any) => {
    const target = event.item.model;
    const [nodes, lines] = getAllNode();
    // console.log(lines);
    // 过滤掉自己本身
    const arr = lines.filter((item: any) => {
      // if (item.id === target.id) {
      //   console.log('插入后确实存在');
      // }
      return item.id !== target.id;
    });

    let max = 1;
    arr.forEach((item: any) => {
      if (item.level >= max) {
        max = item.level + 1;
      }
    });

    updateNode(target.id, {
      label: `${1}.连线`,
      _name: '连线',
      level: 1,
    });

    // 规则有以下
    // 1、线必须有前后节点
    // 2、节点不能与自己相连
    // 3、存在一样的连接
    // 4、以上都是根据线来判断，还得根据节点关系来判断

    // 针对 1
    // 连的是节点是 那source和 target字段就是字符串id、 不然是 对象 {x,y} 的坐标
    if (typeof target.source === 'object' || typeof target.target === 'object') {
      console.log('头尾需有明确指向');
      deleteNode(target);
      return;
    }
    // 针对 2
    // 不能自己相连
    if (target.source === target.target) {
      console.log('不能自己连自己');
      deleteNode(target);
      return;
    }
    // 针对3的处理
    //
    // console.log('判断')
    // console.log(arr)
    // console.log(target)
    for (let i = 0; i < arr.length; i++) {
      let tmp = arr[i];
      // 存在一样的连接节点
      if (tmp.target === target.target && tmp.source === target.source) {
        console.log('存在一样的连接节点');
        deleteNode(target);
        return;
      }
    }
    // 根据节点关系判断是否删除节点
    let flag = false; // 设置是否删除该线的标识
    flag = judgeLineByNode(target, [nodes, lines]);
    if (!flag) {
      console.log('存在环图需删除');
      message.warning('不允许存在环形结构');
      deleteNode(target);
    }
  };

  // 更改线
  const _updateLine = (event: any) => {
    // let keys = Object.keys(event.updateModel);
    const next = event.updateModel;
    const last = event.originModel;
    const [nodes, lines] = getAllNode();
    // 如果更改了源头 且（非锚点变更）
    if (next.source && next.source !== last.source) {
      _insertLine(event);
      // 如果改了目标节点 且（非锚点变更）
    } else if (next.target && next.target !== last.target) {
      _insertLine(event);
    } else {
      // 其他改值就无视
      return;
    }
  };

  // 关系
  const saveFn = () => {
    // 保存时条件
    // 需每个节点都有关系
    const [nodes, lines] = getAllNode();
    if (nodes.length === 0) {
      message.warning('并未新建任务节点');
      return;
    }
    if (nodes.length > 1 && lines.length === 0) {
      message.warning('任务节点之间并未存在关系');
      return;
    }
    // nodes 必须每个节点都有关系
    const map = {};
    const nodeMap = {};
    let startNode: any = null;
    nodes.forEach((item: any) => {
      map[item.id] = 0;
      nodeMap[item.id] = item;
      if (item._nodetype === 'start') {
        console.log('存在开始节点');
        startNode = item;
      }
    });
    let keys = Object.keys(map);
    lines.forEach((item: any) => {
      item._source = nodeMap[item.source]?._id;
      item._target = nodeMap[item.target]?._id;
      if (keys.indexOf(item.source) > -1) {
        map[item.source]++;
      }
      if (keys.indexOf(item.target) > -1) {
        map[item.target]++;
      }
    });
    if (startNode) {
      // 如果存在startNode, 不允许有节点的target是它
      let line: any = lines.find((item: any) => {
        return item.target === startNode.id;
      });
      if (line) {
        // 存在这条线违法
        message.warning(`开始节点不允许作为其他节点的尾节点`);
        return;
      }
    }
    let illegalNode: any[] = []; // 违法Node
    keys.forEach((item: any) => {
      if (map[item] === 0) {
        // 不合规数量汇总
        illegalNode.push(nodeMap[item]);
      }
    });
    if (illegalNode.length > 0) {
      let labels = illegalNode.map((item) => item.label).join('、');
      message.warning(`节点${labels}需补全连接关系`);
    } else {
      save?.({ nodes, edges: lines });
    }
  };

  // 开启设置
  const _openSetting = () => {
    const propsAPI: any = getPropsAPI();
    const info: any = propsAPI.getSelected()[0]?.getModel();
    openSetting?.(info);
  };

  // 汇总绑定到 组件上
  const editorEvent = {
    // 插入前
    onBeforeChange: (event: any) => {
      console.log('before', event);
      if (event.action === 'add') {
        const [nodes] = getAllNode();
        let node: any = nodes.find((item: any) => {
          // 存在同样的隐藏_id
          return item._id === event.model._id;
        });
        if (node) {
          event.model._type = 'copy';
          event.model.copy_id = node._id;
        }
      }
      return false;
    },
    // 监视插入
    onAfterChange: (event: any) => {
      // console.log('after');
      // console.log(event); // action: "add" //item：节点 //affectedItemIds 影响id
      if (event.action === 'add') {
        // console.log('插入后');
        _insert(event);
      } else if (event.action === 'remove' && event?.item.type === 'node') {
        // 删除事件
        // 删除也要刷新node节点列表
        removeNode?.(event?.item.model);
        refreshOtherPane();
      } else if (event.action === 'update') {
        // 更新事件 影响节点是node 且存在label 则更新
        if (
          Object.prototype.hasOwnProperty.call(event.updateModel, 'label') &&
          event?.item.type === 'node'
        ) {
          // console.log('更新事件刷新');
          refreshOtherPane();
        } else if (event?.item.type === 'edge') {
          // 影响节点是线
          // 改变线的前后节点
          // console.log('影响了线');
          _updateLine(event);
        }
      }
    },
  };

  // ------ eventbus 事件
  //
  const addNode = (newNode: any) => {
    const propsAPI = getPropsAPI();
    propsAPI.add('node', newNode);
    refreshOtherPane();
  };

  const updateNode = (id: any, model: any) => {
    const propsAPI = getPropsAPI();
    propsAPI.update(id, model);
    refreshOtherPane();
  };
  const watchCommand = (msg: any) => {
    console.log('watch:' + msg);
  };

  useEffect(() => {
    eventbus.$on('addNode', addNode); // 监听添加节点
    eventbus.$on('deleteNode', deleteNode); // 监听删除节点
    eventbus.$on('updateNode', updateNode); // 监听修改节点
    return () => {
      eventbus.$off('addNode', addNode);
      eventbus.$off('deleteNode', deleteNode);
      eventbus.$off('updateNode', updateNode);
    };
  }, []);

  return (
    <GGEditor className={styles.editor} ref={editorRef}>
      {/* 上层按钮   相关了解 commend 组件 */}
      <Row style={{ height: '100%' }}>
        <Col span={4}>
          <FlowItemPanel type={type} />
        </Col>

        <Col span={20}>
          <div className={styles['editor-box']}>
            <div className={styles.editorHd}>
              <FlowToolbar save={saveFn} />
            </div>

            {/* 编辑部分   左菜单  中间编辑 */}
            <Row className={styles.editorBd}>
              <Col span={18} className={styles.editorContent}>
                <Flow className={styles.flow} {...editorEvent} />
              </Col>

              <Col span={6} className={styles.editorSidebar}>
                <FlowDetailPanel
                  type={type}
                  openSetting={openSetting}
                  openEdgeSetting={openEdgeSetting}
                />
                <EditorMinimap />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* 在元素下右键浮动按钮 */}
      <FlowContextMenu onClick={_openSetting} />
    </GGEditor>
  );
};

export default EditorView;
