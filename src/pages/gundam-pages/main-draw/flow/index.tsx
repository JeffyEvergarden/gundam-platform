import { Col, message, Row } from 'antd';
import GGEditor, { Flow } from 'gg-editor';

import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import eventbus from './utils/eventbus';
import { judgeLineByNode } from './utils/util';

import CustomCommand from './command/CustomCommand';

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
  onGoinCommand?: (node: any) => void;
}

const EditorView = (props: PageViewProps) => {
  const {
    type = 'main',
    insertNode,
    removeNode,
    save,
    cref,
    openSetting,
    openEdgeSetting,
    onGoinCommand,
  } = props;

  const editorRef = useRef<any>(null);

  const [activeNode, setActiveNode] = useState<any>({});

  // 可以输出看看有啥方法
  useEffect(() => {
    console.log('propsAPI', editorRef.current?.propsAPI);
  }, []);

  // 获取 propsAPI
  const getPropsAPI = () => {
    return editorRef.current?.propsAPI;
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

  // 初始化
  useImperativeHandle(cref, () => ({
    init: (initData: any) => {
      // 初始化
      console.log('初始化画布数据', initData);
      const propsAPI = getPropsAPI();
      console.log(propsAPI);
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
    getInfo: () => {
      const [nodes, edges] = getAllNode();
      return {
        nodes,
        edges,
      };
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
        console.log(event.model);
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
    console.log(event);

    const target = event.item.model;
    const originName = event?.originModel?._name || '';
    const originModel = event?.originModel;
    const [nodes, lines] = getAllNode();

    console.log(lines);
    // 过滤掉自己本身
    const arr = lines.filter((item: any) => {
      // if (item.id === target.id) {
      //   console.log('插入后确实存在');
      // }
      return item.id !== target.id;
    });

    let maxLevel: any = arr
      ?.filter((item: any) => item?.source == target?.source)
      ?.sort((a: any, b: any) => b?.level - a?.level)?.[0]?.level;

    console.log(maxLevel);

    let max = 1;
    arr.forEach((item: any) => {
      if (item.level >= max) {
        max = item.level + 1;
      }
    });

    updateNode(target.id, {
      label: `${maxLevel ? Number(maxLevel) + 1 : 1}.${originName || '连线'}`,
      _name: originName || '连线',
      level: maxLevel ? Number(maxLevel) + 1 : 1,
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
      if (event?.action == 'update') {
        updateNode(target.id, {
          source: event?.originModel?.source,
          target: event?.originModel?.target,
          label:
            originModel?.label || `${maxLevel ? Number(maxLevel) + 1 : 1}.${originName || '连线'}`,
          _name: originName || '连线',
          level: originModel?.level || 1,
        });
        return;
      }
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
    console.log(event);

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
    console.log(nodes);

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
    let spBussinessNode: any = null;
    nodes.forEach((item: any) => {
      map[item.id] = 0;
      nodeMap[item.id] = item;
      if (item._nodetype === 'start') {
        console.log('存在开始节点');
        startNode = item;
      } else if (item._nodetype === 'sp_business') {
        console.log('存在特殊业务流程节点');
        spBussinessNode = item;
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
      // 如果存在startNode(开始节点), 不允许有节点的target是它
      let line: any = lines.find((item: any) => {
        return item.target === startNode.id;
      });
      if (line) {
        // 存在这条线违法
        message.warning(`开始节点不允许作为其他节点的尾节点`);
        return;
      }
    }

    // 判断根节点个数
    const tailNodesIds = lines.map((item: any) => {
      return item.target;
    });
    // 找出根节点个数
    const rootNodes = nodes.filter((item: any) => {
      return !tailNodesIds.includes(item.id);
    });
    if (rootNodes?.length > 1) {
      message.warning(`只能存在一个根节点`);
      return;
    }
    //______
    const sourceNodesIds = lines.map((item: any) => {
      return item.source;
    });
    // 找出所有最后的尾节点 （因为尾节点不会作为连线的源头）
    const tailNodes: any[] = nodes.filter((item: any) => {
      return !sourceNodesIds.includes(item.id);
    });

    // 这里判断是否存在没有任何关系的节点
    let illegalNode: any[] = []; // 违法Node
    keys.forEach((item: any) => {
      if (map[item] === 0) {
        // 不合规数量汇总
        illegalNode.push(nodeMap[item]);
      }
    });
    if (illegalNode.length > 0 && nodes.length > 1) {
      let labels = illegalNode.map((item) => item.label || item._name).join('、');
      message.warning(`节点${labels}需补全连接关系`);
      return;
    }
    if (spBussinessNode) {
      // 如果存在特殊的业务流程节点，则该节点必须是结束尾节点 （而且仅有一个尾节点）。
      if (!tailNodes.includes(spBussinessNode) || tailNodes.length > 1) {
        message.warning('特殊的业务流程节点(红色)必须作为唯一的流程结束节点');
        return;
      }
    }

    save?.({ nodes, edges: lines });
  };

  // 开启设置
  const _openSetting = () => {
    const propsAPI: any = getPropsAPI();
    const info: any = propsAPI.getSelected()[0]?.getModel();
    openSetting?.(info);
  };

  // 汇总绑定到 组件上
  const editorEvent = {
    onDoubleClick: (event: any) => {
      if (!event || !event?.item) {
        return;
      }
      if (event.item.type === 'node') {
        openSetting?.(event.item.model);
      } else if (event.item.type === 'edge') {
        openEdgeSetting?.(event.item.model);
      }
    },
    // 插入前
    onBeforeChange: (event: any) => {
      const type = event?.item?.type;
      if (event.action === 'add') {
        console.log('before', event);
        let [nodes, lines] = getAllNode();

        if (type == 'edge') return;
        // console.log(nodes, lines);
        // if (event.model.level) {
        //   console.log('xian');

        //   let maxLevel: any = lines
        //     ?.filter((item: any) => item?.source == event?.model?.source)
        //     ?.sort((a: any, b: any) => b?.level - a?.level)?.[0]?.level;

        //   console.log(maxLevel);

        //   event.model.label = maxLevel ? `${Number(maxLevel) + 1}.连线` : '1.连线';
        //   event.model.level = maxLevel ? Number(maxLevel) + 1 : 1;
        // } else {
        let node: any = nodes.find((item: any) => {
          // 存在同样的隐藏_id
          return item._id === event.model._id;
        });
        // console.log(event);

        if (node) {
          let label: any = (event?.model?._label || event?.model?.label) + '_副本';
          let reg = new RegExp(`^${label}[0-9]+$`);
          let maxCopy = nodes //找到当前复制节点最高
            ?.filter((item: any) => reg?.test(item?._label || item?.label))
            ?.map(
              (item: any) =>
                item?._label?.slice?.(label?.length) || item?.label?.slice?.(label?.length),
            )
            ?.sort((a: any, b: any) => b - a)?.[0];
          // console.log(maxCopy);

          event.model._type = 'copy';
          event.model.copy_id = node._id;

          event.model.label =
            (label + (maxCopy ? Number?.(maxCopy) + 1 : 1))?.length > 10
              ? (label + (maxCopy ? Number?.(maxCopy) + 1 : 1)).slice(0, 10) + '...'
              : label + (maxCopy ? Number?.(maxCopy) + 1 : 1); //用于展示

          event.model._label = label + (maxCopy ? Number?.(maxCopy) + 1 : 1); //用于接口新增
        } else {
          let reg = /^新节点[0-9]+$/;
          let maxNew = nodes //找到当前新增节点最高
            ?.filter((item: any) => reg?.test(item?.label))
            ?.map((item: any) => item?.label?.slice?.(3))
            ?.sort((a: any, b: any) => b - a)?.[0];
          event.model.label =
            `新节点${maxNew ? Number?.(maxNew) + 1 : 1}`?.length > 10
              ? `新节点${maxNew ? Number?.(maxNew) + 1 : 1}`.slice(0, 10) + '...'
              : `新节点${maxNew ? Number?.(maxNew) + 1 : 1}`;
          event.model._label = `新节点${maxNew ? Number?.(maxNew) + 1 : 1}`;
        }
        // }
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
          Object.prototype.hasOwnProperty.call(event.updateModel, '_name') &&
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

    // onAfterItemActived: (e: any) => {
    //   console.log(e);

    //   if (e?.item?.model) {
    //     setActiveNode(e.item.model); //
    //   }
    // },

    onAfterItemSelected: (e: any) => {
      console.log('选中', e);

      if (e?.item?.model) {
        setActiveNode(e.item.model); //
      }
    },

    // --------- 滚轮
    onMouseWheel: (e: any) => {
      console.log('滚轮e', e);
    },
    mousewheel: (e: any) => {
      console.log('滚轮e', e);
    },
  };

  // 业务流程节点跳转
  const goToLink = (e: any) => {
    if (e === 'go') {
      const propsAPI: any = getPropsAPI();
      const info: any = propsAPI.getSelected()[0]?.getModel();
      // console.log(info);
      onGoinCommand?.(info);
    }
  };

  useEffect(() => {
    eventbus.$on('addNode', addNode); // 监听添加节点
    eventbus.$on('deleteNode', deleteNode); // 监听删除节点
    eventbus.$on('updateNode', updateNode); // 监听修改节点
    eventbus.$on('command', goToLink);
    return () => {
      eventbus.$off('addNode', addNode);
      eventbus.$off('deleteNode', deleteNode);
      eventbus.$off('updateNode', updateNode);
      eventbus.$off('command', goToLink);
    };
  }, []);

  return (
    <GGEditor className={styles.editor} ref={editorRef}>
      {/* 上层按钮   相关了解 commend 组件 */}
      <Row style={{ height: '100%', userSelect: 'none' }}>
        {/* <Col span={5} style={{ borderRight: '1px solid #e6f7ff' }}>
          <div className={styles.editorHd}>新增节点</div>
          <FlowItemPanel type={type} />  // 拖拽创建

          <FlowDetailPanel   // 节点详情
            type={type}
            openSetting={openSetting}
            openEdgeSetting={openEdgeSetting}
          />
        </Col> */}

        <Col span={24}>
          <div className={styles['editor-box']}>
            <div className={styles.editorHd}>
              <FlowToolbar save={saveFn} type={type} />
            </div>

            {/* 编辑部分   左菜单  中间编辑 */}
            <Row className={styles.editorBd}>
              <Col span={24} className={styles.editorContent}>
                <Flow className={styles.flow} {...editorEvent} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* 在元素下右键浮动按钮 */}
      <FlowContextMenu onClick={_openSetting} activeNode={activeNode} />

      <CustomCommand />
    </GGEditor>
  );
};

export default EditorView;
