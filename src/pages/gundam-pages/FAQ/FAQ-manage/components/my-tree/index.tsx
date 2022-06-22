import Condition from '@/components/Condition';
import {
  CaretDownOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTreeModal } from '../../model';
import style from './style.less';

interface TreeProps {
  data: any[];
  onChange?: (...args: any) => void;
  touchChangeParent?: (...args: any) => void;
  deleteApi?: any;
  draggable: boolean;
  edit?: boolean;
  openEditModal?: (...args: any) => void;
  openAddModal?: (...args: any) => void;
  size?: string;
  selectTree?: any;
  leafClickOnly?: boolean;
  getTree?: any;
}

const { DirectoryTree } = Tree;
// tree 组件属性解释
// blockNode 是否节点占据一行

// 获取父节点
const getParentNode = (obj: any, arr: any) => {
  // console.log(obj);
  // 位置 第一个没用 和最后一个自己
  let newArr: any = [...arr];
  newArr.shift();
  newArr.shift();
  newArr.pop();
  let tmp = obj[0];
  console.log(newArr);
  newArr.forEach((it: any) => {
    // console.log(tmp);
    if (tmp.children) {
      tmp = tmp.children;
    }
    tmp = tmp?.[it];
  });
  if (tmp !== obj) {
    return tmp;
  } else {
    return null;
  }
};

const MyTree: React.FC<TreeProps> = (props: TreeProps) => {
  const {
    data,
    onChange,
    touchChangeParent,
    draggable,
    deleteApi = () => true,
    edit = true,
    size,
    leafClickOnly = true,
    getTree,
  } = props;

  const { deleteLeaf } = useTreeModal();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [defaultOpenTree, setDefaultOpenTree] = useState<any[]>([]);

  const location: any = useLocation();

  const query: any = location?.query;

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  // 选择节点
  const onSelect = (key: any, opt: any) => {
    let node = opt.node;
    if (leafClickOnly) {
      if (node.key === '0') {
        return;
      }
      if (!node.children || node.children?.length === 0) {
        onChange?.(key, opt);
      }
    } else {
      onChange?.(key, opt);
    }
    // 只有level2级的才会触发加载
    // if (opt?.node?.level === 2) {
    //   onChange?.(key, opt);
    // }
  };
  // ----
  // 复制节点
  const copyNode = (node: any) => {
    let newNode = {
      // key: node.key,
      // title: node.title,
      // children: node.children,
      // isLeaf: true,
    };
    Object.keys(node).forEach((name: any) => {
      newNode[name] = node[name];
    });
    return newNode;
  };

  // ---------- 最重要的方法
  const onDrop = (info: any) => {
    console.log(info);
    // info.dragNode - 拖动节点
    // info.node 目标节点
    // dropPosition 1-插到子节点  3-插到目标节点后面
    // 获取拖动节点位置
    let dragPos: any[] = info.dragNode.pos.split('-'); // 拖动节点
    // 获取目标节点位置
    let nodePos: any = info.node.pos.split('-'); // 目标节点
    // dropToGap = true ===> 表示可以直接在同级
    let dropToGap: any = info.dropToGap;
    let dropPosition: any = info.dropPosition; // 位置
    console.log(dropToGap, dropPosition, info.dragNode.title, info.node.title);

    info.node.children = info.node.children || [];
    // // 如果 拖拽节点层级 < 目标节点层级
    // if (dragPos.length < nodePos.length) {
    //   // 同层的节点变成目标节点的子节点
    //   return false;
    // }
    // 这种情况在目标节点首插入, dropToGap 为 false 在某节点子节点最前或最后位置插入
    if (!dropToGap) {
      let parentDragNode: any = getParentNode(dataSource, dragPos);
      const deleteIndex = dragPos[dragPos.length - 1];
      // 进行节点删除
      parentDragNode?.children?.splice(deleteIndex, 1);
      // 进行节点插入
      info.node.children.unshift(copyNode(info.dragNode));
      // 触发父节点变更 需要调接口
      // if (parentDragNode && info.node && parentDragNode.key !== info.node.key) {
      //   //
      //   touchChangeParent?.(info.dragNode, parentDragNode.key); // 触发接口
      // }
    }
    // 在该节点位置下前后位置插入
    if (dropToGap) {
      // 表示同层的节点
      console.log('插入位置:', dropPosition);
      // 找父节点
      let parentDragNode = getParentNode(dataSource, dragPos);
      console.log('移动节点的父节点： （进行删除操作）');
      console.log(parentDragNode);
      // 目标节点位置
      let parentTargetNode = getParentNode(dataSource, nodePos);
      console.log('目标节点的父节点： （进行新增节点操作）');
      console.log(parentTargetNode);

      // 针对移动至全部分类的不进行操作
      if (parentTargetNode === dataSource[0] && dropPosition === -1) {
        console.log('操作终止');
        return;
      }

      let children = (parentTargetNode.children = parentTargetNode.children || []);
      // 进行删除
      const deleteIndex = dragPos[dragPos.length - 1];
      // 删除该节点
      parentDragNode?.children?.splice(deleteIndex, 1);
      // 找到节点的index值
      let index = children.findIndex((item: any) => {
        return item.key === info.node.key;
      });
      console.log('找目标节点索引下标index:' + index);
      // 新增节点
      children.splice(index + 1, 0, copyNode(info.dragNode));

      // if (parentDragNode && parentTargetNode && parentDragNode.key !== parentTargetNode.key) {
      //   //
      //   touchChangeParent?.(info.dragNode, parentTargetNode.key);
      // }
    }
    // 更新节点
    setDataSource([...dataSource]);
  };

  // 打开新增弹窗

  const openAddModal = (e: any, nodeData: any) => {
    if (!defaultOpenTree.includes(nodeData?.key)) {
      setDefaultOpenTree([...defaultOpenTree, nodeData?.key]);
    }

    console.log(nodeData.key);

    // 阻止冒泡
    e.stopPropagation();
    const addCallback = (obj: any) => {
      if (obj.title) {
        obj.parent = nodeData;
        let newNode: any = copyNode(obj);
        nodeData.children = nodeData.children || [];
        nodeData.children?.push(newNode);
        setDataSource([...dataSource]);
      }
    };
    // 打开弹窗
    props?.openAddModal?.(nodeData, addCallback);
  };

  // 打开编辑弹窗
  const openEditModal = (e: any, nodeData: any) => {
    // 阻止冒泡
    e.stopPropagation();
    console.log('打开编辑事件');
    // 编辑回调
    const editCallback = (obj: any) => {
      if (obj.title) {
        nodeData.title = obj.title;
        nodeData.key = obj.title;
      }
      setDataSource([...dataSource]);
    };
    // 打开弹窗
    props?.openEditModal?.(nodeData, editCallback);
  };

  // 打开删除弹窗
  const openDeleteModal = (e: any, nodeData: any) => {
    console.log(nodeData);
    // 阻止冒泡
    e.stopPropagation();

    let parent: any = nodeData?.parent || undefined;

    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否删除当前分类？',
      onOk: async () => {
        console.log('删除');
        let res: any = await deleteLeaf({ id: nodeData?.key });
        if (res) {
          message.success('删除成功');
          getTree();
          if (parent) {
            let arr: any[] = parent.children || [];
            let index: number = arr.findIndex((item: any) => item.key === nodeData.key);
            if (index > -1) {
              arr.splice(index, 1);
            }
          } else {
            let index: number = dataSource.findIndex((item: any) => item.key === nodeData.key);
            if (index > -1) {
              dataSource.splice(index, 1);
            }
          }
          setDataSource([...dataSource]);
        }
      },
      onCancel() {},
    });
  };

  // 自定义渲染
  const diyRender = (nodeData: any) => {
    // console.log(nodeData);

    let extra = null;
    if (nodeData && nodeData?.deep < 5) {
      extra = (
        <PlusCircleOutlined
          style={{ marginRight: '8px', fontSize: '12px' }}
          onClick={(e: any) => {
            openAddModal(e, nodeData);
          }}
        />
      );
    }

    const def = () => {
      if (!nodeData.parent) {
        return {
          display: 'block',
        };
      }
      return {};
    };

    return (
      <div className={style['tree-node']}>
        <div className={style['label']}>
          <div>{nodeData.title}</div>
        </div>
        <Condition r-if={edit}>
          <div className={style['edit-layout']} style={def()}>
            {extra}
            {nodeData.parent && (
              <EditOutlined
                style={{ marginRight: '8px', fontSize: '12px' }}
                onClick={(e) => {
                  openEditModal(e, nodeData);
                }}
              />
            )}
            {nodeData.parent && !nodeData?.children?.length && (
              <DeleteOutlined
                style={{ fontSize: '12px' }}
                onClick={(e) => {
                  openDeleteModal(e, nodeData);
                }}
              />
            )}
          </div>
        </Condition>
      </div>
    );
  };

  // ----
  const onClick = () => {
    console.log(dataSource);
  };

  // useEffect(() => {
  //   setDefaultOpenTree(['0']);
  // }, []);

  return (
    <div className={`${style['faq-tree']} ${size === 'sm' ? style['faq-tree_sm'] : ''}`}>
      <Condition r-if={query?.test}>
        <div className={style['test-box']}>
          <Button type="primary" onClick={onClick}>
            输出树形结构
          </Button>
        </div>
      </Condition>

      <Tree
        // checkable
        // onCheck={onCheck}
        treeData={dataSource}
        switcherIcon={<CaretDownOutlined />}
        showLine
        showIcon={false}
        onSelect={onSelect}
        titleRender={diyRender}
        blockNode
        draggable={draggable}
        onDrop={onDrop}
        expandedKeys={defaultOpenTree}
        onExpand={(val: any) => {
          console.log(val);
          setDefaultOpenTree(val);
        }}
        // autoExpandParent={true}
      ></Tree>
    </div>
  );
};

export default MyTree;
