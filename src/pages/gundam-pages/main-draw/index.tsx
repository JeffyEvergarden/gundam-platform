import { useEffect, useRef } from 'react';

import { message } from 'antd';
import { useState } from 'react';
import { history, useModel } from 'umi';
import DrawerForm from './drawerV2';
import SpDrawerForm from './drawerV2/sp-index';
import EdgeDrawerForm from './EdgeDrawer';
import FlowPage from './flow';
import eventbus from './flow/utils/eventbus';
import { useNodeOpsModel } from './model';
import { processType } from './model/const';
import style from './style.less';

const debounce = (fn: (...arr: any[]) => void, second: number) => {
  let timer: any = null;
  // let content = this;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    // let flag = !timer;

    timer = setTimeout(() => {
      timer = null;
      fn.apply(fn, args);
    }, second * 1000);
  };
};

const MainDraw = (props: any) => {
  const { type = 'main' } = props;

  // 初始化
  const fake = useRef<any>(null);
  const dom = useRef<any>(null);

  const drawerRef = useRef<any>(null);
  const edgeDrawerRef = useRef<any>(null);
  const spNodeDrawerRef = useRef<any>(null);
  const operationNodeDrawerRef = useRef<any>(null);
  // const [bFlowId, setBFlowId] = useState('');

  // 历史遗留问题
  // 话术标签、业务流程列表

  const { info, businessFlowId, setBusinessFlowId, getGlobalValConfig, drawType, setDrawType } =
    useModel('gundam' as any, (model: any) => {
      // console.log('gundam', model);
      return {
        info: model.info,
        businessFlowId: model.businessFlowId,
        getGlobalValConfig: model.getGlobalValConfig,
        drawType: model.drawType, // 画布类型
        setDrawType: model.setDrawType,
        setBusinessFlowId: model.setBusinessFlowId,
      };
    });

  // 意图列表、词槽列表
  // 短信模版列表
  const {
    flowList,
    getMessageList,
    wishList,
    wordSlotList,
    getWishList,
    getWordSlotList,
    getLabelList,
    getFlowList,
    getGlobalConfig,
  } = useModel('drawer' as any, (model: any) => ({
    flowList: model._originFlowList || [],
    wishList: model._wishList || [],
    wordSlotList: model._wordSlotList || [],
    getMessageList: model.getMessageList || [],
    getWishList: model.getWishList || [],
    getWordSlotList: model.getWordSlotList || [],
    getLabelList: model.getLabelList || [],
    getFlowList: model.getFlowList || [],
    getGlobalConfig: model.getGlobalConfig || {},
  }));

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

  // 流程图相关 -----------------------
  // -- start-----
  // 插入节点
  const insertNode = async (node: any) => {
    // console.log('外层监测到插入Node');
    console.log(fake.current.getInfo());

    console.log(node);
    // color: #1890FF 普通节点、 #fffbe6 业务节点
    let params: any = {
      ...preParams,
      frontId: node.id, // 前端id
      nodeName: node._label || node.label, // 节点名称  （接口）
      nodeType: processType(node._nodetype),
      x: node.x, // 节点位置 横坐标
      y: node.y, // 节点位置 纵坐标
    };
    if (node._type === 'copy') {
      // 如果节点有复制标志会
      // 通过复制创建
      params.copyId = node.copy_id;
    }
    if (node._nodetype === 'start') {
      (fake.current as any).executeCommand?.('undo');
      message.warning('开始节点不允许复制粘贴');
      return;
    }

    if (node._nodetype === 'start') {
      (fake.current as any).executeCommand?.('undo');
      message.warning('开始节点不允许复制粘贴');
      return;
    }

    if (node._nodetype === 'sp_business') {
      (fake.current as any).executeCommand?.('undo');
      message.warning('特殊业务节点不允许复制粘贴');
      return;
    }

    let res = await addNode(params);
    if (res === false) {
      (fake.current as any).deleteNode(node);
    } else {
      (fake.current as any).updateNode(node.id, {
        _id: res?.data?.id, //得到后端id
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
    if (node._nodetype === 'start' || node._nodetype === 'sp_business') {
      message.warning('该节点不允许删除');
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
    // console.log(edges);
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
    console.log(info); // 获取节点id
    config = await getNodesConfig({
      ...preParams,
      id: info._id,
      nodeType: processType(info._nodetype),
    });
    console.log(config, info);

    config = {
      node: {
        ...info,
      },
      config: {
        ...config,
      },
      id: info._id, // 后端id
      frontId: info.id, // 前端id
      name: config.nodeName || config.name, // 前端名称
      nodeType: processType(info._nodetype), // 后端节点类型
      _nodetype: info._nodetype,
    };

    const callBack = (obj: any) => {
      (fake.current as any)?.updateNode(info.id, {
        ...obj,
      });
      eventbus.$emit('refresh');
    };
    if (['sp_business', 'business'].includes(info._nodetype)) {
      (spNodeDrawerRef.current as any).open(config, callBack);
    }
    // else if (info._nodetype == 'operation') {
    //   (operationNodeDrawerRef.current as any).open(config, callBack);
    // }
    else {
      (drawerRef.current as any).open(config, callBack);
    }
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
    // console.log((fake.current as any)?.find(info.target));

    // console.log(config);

    const callBack = (obj: any, id: any) => {
      console.log(fake.current);
      (fake.current as any)?.updateNode(info.id, {
        ...obj,
        _id: id,
      });
      eventbus.$emit('refresh');
    };
    (edgeDrawerRef.current as any)?.open(config, callBack);
  };

  const goLink = async (info: any) => {
    let nodeType = info?._nodetype;
    console.log(info);

    if (nodeType === 'business') {
      let res = await getNodesConfig({
        ...preParams,
        id: info._id,
        nodeType: processType(info._nodetype),
      });
      console.log(res);
      if (res?.nodeFlowId) {
        localStorage.setItem('businessFlowId', res?.nodeFlowId || '');
        sessionStorage.setItem('businessFlowId', res?.nodeFlowId || '');
        setBusinessFlowId(res?.nodeFlowId || '');
        // 业务流程节点
        history.push(`/gundamPages/businessDraw/detail`);
        // setBFlowId(res?.nodeFlowId);
      } else {
        message.warning('未配置业务流程');
      }
    }
  };

  // 初始化设置
  useEffect(() => {
    setDrawType(type);
    getLabelList(info.id); // 获取话术标签
    getFlowList(info.id); // 获取业务流程列表
    getWishList(info.id); // 意图列表
    getWordSlotList(info.id); // 词槽列表
    getMessageList(info.id); // 短信
    getGlobalValConfig(info.id); // 获取全局变量列表
    getGlobalConfig(info.id); //获取全局节点配置
  }, []);

  useEffect(() => {
    // setBFlowId(businessFlowId);
    getMachineInfo().then((res) => {
      fake.current?.executeCommand?.('autoZoom');
      fake.current?.executeCommand?.('resetZoom');
    }); // 获取机器人主流程信息
  }, [businessFlowId]);

  const [key, setKey] = useState(0);
  const infoRef: any = useRef({});

  useEffect(() => {
    const timeFn = () => {
      // 定时储存
      const _info = fake.current?.getInfo?.() || {};
      infoRef.current.info = _info || {};
      if (!infoRef.current.key) {
        infoRef.current.key = 0;
      } else if (infoRef.current.key > 1000) {
        infoRef.current.key = 0;
      }
      infoRef.current.key++;
    };
    const tf = setInterval(() => {
      timeFn();
    }, 1500);

    // resize 防抖
    const fn = debounce(() => {
      setKey(infoRef.current.key);
      // console.log(infoRef.current.key);
      fake.current?.init(infoRef.current.info || {});
    }, 0.8);

    window.addEventListener('resize', fn);

    return () => {
      clearInterval(tf);
      window.removeEventListener('resize', fn);
    };
  }, []);

  // -- end-----

  return (
    <div className={style['main-draw']}>
      {/* <Condition r-if={type == 'business'}>
        <Select
          size="small"
          style={{ marginBottom: '16px', width: '200px' }}
          value={bFlowId}
          onChange={(val) => {
            localStorage.setItem('businessFlowId', val || '');
            sessionStorage.setItem('businessFlowId', val || '');
            setBusinessFlowId(val || '');
            setBFlowId(val);
          }}
        >
          {flowList.map((item: any) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.flowName}
              </Select.Option>
            );
          })}
        </Select>
      </Condition> */}
      <div className={style['container']}>
        <div className={style['container_right']} ref={dom}>
          <FlowPage
            type={type} // 流程图类型
            key={key}
            insertNode={insertNode}
            removeNode={removeNode}
            openSetting={openSetting}
            openEdgeSetting={openEdgeSetting}
            onGoinCommand={goLink}
            save={save}
            clickItem={clickItem}
            cref={fake}
          />
        </div>
      </div>

      <DrawerForm cref={drawerRef} type={type} wishList={wishList} wordSlotList={wordSlotList} />

      <SpDrawerForm cref={spNodeDrawerRef} type={type} />

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
// _name: 节点名称
// type: node / edge     节点或者线
// _type:  copy   表示是复制节点
// _nodetype:  start / normal / business     开始节点/普通节点/ 业务流程节点
