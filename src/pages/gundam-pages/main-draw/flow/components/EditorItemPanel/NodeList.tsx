import React, { useEffect, useState, useRef } from 'react';
// gg-editor
import { Item, withPropsAPI } from 'gg-editor';

import AddModal from '../Modal/addModal';

// 通用组件相关
import { Input, Space, message } from 'antd';
import { PlusSquareOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Condition from '../../common/Condition';
import style from './index.less';
import eventbus from '../../utils/eventbus';
const defaultPos: any = {
  w: 80,
  h: 30,
};

const testList = [
  {
    value: 1,
    label: '1个和尚',
  },
  {
    value: 2,
    label: '2个和尚',
  },
];

const NodeList = (props: any) => {
  const { propsAPI, defaultValue, max, clickItem: clickNode } = props;

  const [nameVal, setNameVal] = useState<string>('');

  const [nodeList, setNodeList] = useState<any[]>(defaultValue || []);

  const changeNameVal = (e: any) => {
    let val = e.target.value;
    setNameVal(val);
  };

  // 增加节点
  const addNode = (obj: any) => {
    // 新节点位置
    let [x, y] = getNewNodePostion();
    const newNode = {
      size: `${defaultPos.w}*${defaultPos.h}`,
      shape: 'flow-rect',
      color: '#1890FF', //'#FA8C16',
      label: obj.taskName,
      taskId: obj.taskId, // 不知道会不会补进来
      extra: obj, // 试试
      x: x,
      y: y,
    };
    propsAPI.add('node', newNode);
    // 更新list
    reflashList();
  };
  // 修改节点
  const updateModel = (val: any) => {
    propsAPI.update(val.id, {
      label: val.taskName,
      taskId: val.taskId,
      extra: val,
    });
  };

  // 获取所有节点
  const getAllNode = () => {
    const rep = propsAPI.save();
    const nodes = rep.nodes || []; // 节点
    // index：序号   id：标识  type：类型
    const edges = rep.edges || []; // 线
    //  index 、 id 、 source 、 target
    return [nodes, edges];
  };
  // 设置节点新位置
  const getNewNodePostion = () => {
    const [nodes] = getAllNode();
    if (nodes.length === 0) {
      return [100, 100];
    } else {
      const lastNode = nodes[nodes.length - 1];
      const newX = lastNode.x + 150; // 节点左顶点
      const newY = lastNode.y + 150;
      if (max && newX + defaultPos.w < max) {
        return [newX, lastNode.y];
      } else if (max && newX > max) {
        return [lastNode.x, newY];
      } else {
        return [newX, lastNode.y];
      }
    }
  };
  // 刷新列表
  const reflashList = () => {
    const [nodes] = getAllNode();
    // console.log(nodes);
    setNameVal('');
    setNodeList(nodes);
  };

  // 点击节点， 选中节点
  const clickItem = (e: MouseEvent, item: any) => {
    if (item) {
      const node = propsAPI.find(item.id);
      // console.log(node);
      propsAPI.currentPage.setSelected(node);
      clickNode?.(node.model);
    }
  };

  // 删除节点
  const deleteNode = (item: any, index: any) => {
    propsAPI.remove(item.id); // 删除节点
    reflashList(); //; 刷新
  };

  // 切换成编辑模式
  const changeMode = (item: any, index: any) => {
    if (!item.edit) {
      // 切成编辑
      item.inputVal = item.label;
    } else {
      // 切回文本
      if (item.inputVal && item.inputVal.trim()) {
        item.label = item.inputVal;
        // 节点label变更
        propsAPI.update(item.id, {
          label: item.label,
        });
      }
    }
    item.edit = !item.edit;
    // 刷新
    setNodeList([...nodeList]);
  };

  // 输入框编辑
  const changeItemInput = (e: any, item: any) => {
    item.inputVal = e.target.value;
    setNodeList([...nodeList]);
  };

  // 测试用
  const test = () => {
    console.log('propsAPI:');
    console.log(propsAPI);
    console.log('获取画布：');
    console.log(propsAPI.currentPage);
    console.log(propsAPI.currentPage.getGraph());
    console.log('获取选择节点：');
    console.log(propsAPI.getSelected());
    console.log('获取选择节点：');
    console.log(propsAPI.save());
  };

  // 搜索框 触发
  const search = () => {
    const val = nameVal.trim();
    setNameVal(val);
    if (!val || (val && val.length == 0)) {
      const [nodes] = getAllNode();
      setNodeList(nodes);
      return;
    }
    // 有值时
    const newList = nodeList.filter((item: any) => {
      if (!item.label) {
        return true;
      }
      return item.label.includes(val) || val.includes(item.label);
    });
    setNodeList(newList);
  };

  // 创建编辑弹窗相关

  const AddModalRef = useRef<any>(null);

  const openAddModal = () => {
    console.log('打开弹窗');
    console.log('----');
    AddModalRef.current?.open();
  };

  // 打开编辑弹窗
  const openUpdateModal = (item: any, index: number) => {
    console.log('打开修改弹窗');
    console.log('----');
    console.log(item);
    // 更新
    AddModalRef.current?.open(item);
  };

  // 弹窗确认
  const confirm = (val: any) => {
    if (val.id) {
      // 更新
      updateModel(val);
    } else {
      // 新建
      addNode(val);
    }
  };

  useEffect(() => {
    const reflashNodeList = () => {
      reflashList();
    };
    eventbus.$on('flashNodeList', reflashNodeList);
    return () => {
      eventbus.$off('flashNodeList', reflashNodeList);
    };
  }, []);

  return (
    <div className={style['node-box']}>
      <div className={style['node-header']}>
        <Input
          value={nameVal}
          placeholder="搜索任务名"
          onChange={changeNameVal}
          onPressEnter={search}
          // allowClear
        />
        <PlusSquareOutlined
          onClick={openAddModal}
          style={{ fontSize: 20, color: '#1890ff', paddingLeft: '16px' }}
        />
      </div>

      <div className={style['node-content']}>
        {nodeList.map((item: any, index: any) => {
          return (
            <div key={item.id} className={style['node-item']}>
              <Condition r-if={!item.edit}>
                <div className={style['node-item_label']} onClick={(e: any) => clickItem(e, item)}>
                  {item.label || '---'}
                </div>
              </Condition>

              {/* 编辑模式代码无用 */}
              <Condition r-if={item.edit}>
                <div className={style['node-item_label']}>
                  <Input
                    value={item.inputVal}
                    className={style['node-item_input']}
                    onPressEnter={() => {
                      changeMode(item, index);
                    }}
                    onChange={(e: any) => changeItemInput(e, item)}
                  />
                </div>
              </Condition>

              <Space>
                <EditOutlined
                  style={{ color: '#1890ff' }}
                  onClick={() => {
                    openUpdateModal(item, index);
                  }}
                />
                <MinusCircleOutlined
                  style={{ color: '#ff4d4f' }}
                  onClick={() => deleteNode(item, index)}
                />
              </Space>
            </div>
          );
        })}
      </div>

      <AddModal cref={AddModalRef} confirm={confirm} list={testList} />
    </div>
  );
};

export default withPropsAPI(NodeList as any);
