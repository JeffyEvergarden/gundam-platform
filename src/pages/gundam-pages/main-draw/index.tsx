import { useRef, useEffect } from 'react';

import FlowPage from './flow';
import { useModel } from 'umi';
import DrawerForm from './drawer';
import EdgeDrawerForm from './EdgeDrawer';
import style from './style.less';
import { useNodeOpsModel, useSelectModel } from './model';
import { processType } from './model/const';
import eventbus from './flow/utils/eventbus';
import { message } from 'antd';

const MainDraw = (props: any) => {
  const { type = 'main' } = props;

  // 初始化
  const fake = useRef<any>(null);
  const drawerRef = useRef<any>(null);
  const edgeDrawerRef = useRef<any>(null);

  const { info, getLabelList, getFlowList, businessFlowId } = useModel(
    'gundam' as any,
    (model: any) => ({
      info: model.info,
      getLabelList: model.getLabelList,
      getFlowList: model.getFlowList,
      businessFlowId: model.businessFlowId,
    }),
  );

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };

  const {
    infoLoading,
    addNode,
    deleteNode,
    getMachineMainDraw,
    saveDraw,
    getNodesConfig,
    getLineConfig,
  } = useNodeOpsModel();

  // 意图列表、词槽列表
  const { wishList, wordSlotList, getWishList, getWordSlotList } = useSelectModel();

  // 流程图相关 -----------------------
  // -- start-----
  // 插入节点
  const insertNode = async (node: any) => {
    // console.log('外层监测到插入Node');
    // console.log(node);
    // color: #1890FF 普通节点、 #fffbe6 业务节点
    let params: any = {
      ...preParams,
      frontId: node.id, // 前端id
      nodeName: node.label, // 节点名称
      nodeType: processType(node._nodetype),
      x: node.x, // 节点位置 横坐标
      y: node.y, // 节点位置 纵坐标
    };
    if (node._type === 'copy') {
      // 如果节点有复制标志会
      // 通过复制创建
      params.copyId = node.copy_id;
    }

    let res = await addNode(params);
    if (res === false) {
      (fake.current as any).deleteNode(node);
    } else {
      (fake.current as any).updateNode(node.id, {
        _id: res.datas?.id, //得到后端id
      });
    }
  };

  // 删除节点
  const removeNode = async (node: any) => {
    console.log('外层监测到删除Node');
    console.log(node);
    if (!node._id) {
      return;
    }
    if (node._nodetype === 'start') {
      message.warning('开始节点不允许删除');
      (fake.current as any).executeCommand?.('undo');
      return;
    }
    // let params: any = {
    //   ...preParams,
    //   id: node._id, // 后端id
    // };
    // let res = await deleteNode(params);
    // if (res === false) {
    //   // 删除失败 - 返回上一步
    //   (fake.current as any).executeCommand?.('undo');
    // }
  };

  const clickItem = (node: any) => {
    console.log('点击左边菜单节点事件');
    console.log(node);
  };

  // 保存节点
  const save = (obj: any) => {
    console.log('保存提交', obj);
    // 可能需要进一步作校验
    saveDraw({
      ...obj,
      ...preParams,
    });
  };

  // 初始情况默认去加载当前机器人信息

  const getMachineInfo = async () => {
    let data: any = await getMachineMainDraw({ ...preParams });
    let { nodes = [], edges = [] } = data || {};
    console.log(edges);
    (fake.current as any)?.init?.({
      nodes: nodes,
      edges: edges,
    });
  };

  // 打开节点弹窗
  const openSetting = async (info: any) => {
    if (infoLoading) {
      return;
    }
    console.log('打开节点设置信息:');
    if (!info) {
      return;
    }
    let config: any = null;
    // console.log(info); // 获取节点id
    config = await getNodesConfig({
      ...preParams,
      id: info._id,
      nodeType: processType(info._nodetype),
    });
    config = {
      ...info,
      ...config,
      id: info._id,
      frontId: info.id,
      name: config.nodeName || config.name,
      nodeType: processType(info._nodetype),
    };

    const callBack = (name: string) => {
      (fake.current as any).updateNode(info.id, {
        label: name || info.label,
      });
      eventbus.$emit('refresh');
    };

    (drawerRef.current as any).open(config, callBack);
  };

  // 打开线配置
  const openEdgeSetting = async (info: any) => {
    console.log('打开线的设置信息:', info);
    if (!info) {
      return;
    }
    let config: any = null;
    if (!info._id) {
      config = {};
    } else {
      config = await getLineConfig({
        ...preParams,
        id: info._id,
      });
    }
    config = {
      ...info,
      ...config,
      id: info._id,
      frontId: info.id,
      name: info._name || config.nodeName || config.name || info.label || '',
      source: (fake.current as any)?.find(info.source)?._id,
      frontSource: (fake.current as any)?.find(info.source)?.id,
      target: (fake.current as any)?.find(info.target)?._id,
      frontTarget: (fake.current as any)?.find(info.target)?.id,
      sourceAnchor: info?.sourceAnchor,
      targetAnchor: info?.targetAnchor,
      sourceType: processType((fake.current as any)?.find(info.source)?._nodetype),
      targetType: processType((fake.current as any)?.find(info.target)?._nodetype),
    };
    console.log((fake.current as any)?.find(info.target));

    // console.log(config);

    const callBack = (obj: any, id: any) => {
      (fake.current as any).updateNode(info.id, {
        ...obj,
        _id: id,
      });
      eventbus.$emit('refresh');
    };
    (edgeDrawerRef.current as any)?.open(config, callBack);
  };

  // 初始化设置
  useEffect(() => {
    getMachineInfo(); // 获取机器人主流程信息
    getLabelList(); // 获取话术标签
    getFlowList(); // 获取业务流程列表
    getWishList(info.id);
    getWordSlotList(info.id);
  }, []);
  // -- end-----

  return (
    <div className={style['main-draw']}>
      <div className={style['container']}>
        <div className={style['container_right']}>
          <FlowPage
            type={type} // 流程图类型
            insertNode={insertNode}
            removeNode={removeNode}
            openSetting={openSetting}
            openEdgeSetting={openEdgeSetting}
            save={save}
            clickItem={clickItem}
            cref={fake}
          />
        </div>
      </div>

      <DrawerForm cref={drawerRef} type={type} wishList={wishList} wordSlotList={wordSlotList} />

      <EdgeDrawerForm
        cref={edgeDrawerRef}
        type={type}
        wishList={wishList}
        wordSlotList={wordSlotList}
      />
    </div>
  );
};

export default MainDraw;

// 节点定义

// id: 前端节点id,
// _id: 后端节点id,
// label: 节点名称
// type: node / edge     节点或者线
// _type:  copy   表示是复制节点
// _nodetype:  start / normal / business     开始节点/普通节点/ 业务流程节点
