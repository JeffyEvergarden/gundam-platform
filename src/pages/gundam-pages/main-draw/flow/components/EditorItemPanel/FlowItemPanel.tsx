import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { Item, ItemPanel } from 'gg-editor';
import { useEffect } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
interface PanelProps {
  type?: any;
}

const FlowItemPanel = (props: PanelProps) => {
  const { type } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useEffect(() => {
    console.log(type);
  }, []);

  return (
    <ItemPanel className={styles.itemPanel}>
      {/*文本不需要这个  0文本 1语音 */}
      <Condition r-if={info?.robotType == 1 || (info?.robotType == 0 && type == 'business')}>
        <Item
          type="node"
          size="140*45"
          shape="flow-rect"
          model={{
            color: '#2890F3',
            label: '新节点1',
            _nodetype: 'normal',
          }}
          src={''}
        >
          <div className={styles['blue-node']}>
            普通节点
            <Tip
              title={`普通节点是机器人流程的主要组成部分，可以配置关联词槽、对话回应和高级配置。普通节点或业务流程节点之间通过连线关联。将普通节点拖拽至画布中即可新增节点。根据连线确定节点上下游关系，节点最多只能有一个上游节点（开始节点可以没有上游节点），多个下游节点（结束节点可以没有下游节点）。`}
            />
          </div>
        </Item>
      </Condition>

      <Item
        type="node"
        size="140*45"
        shape="flow-rect"
        model={{
          color: '#B7EB8F',
          label: '运算节点',
          _nodetype: 'operation',
          style: {
            stroke: '#B7EB8F', //未选中时边框颜色
            lineWidth: 1,
          },
        }}
        src={''}
      >
        <div className={styles['green-node']}>
          运算节点
          <Tip title={`用于对词槽或变量进行运算，包括清空、赋值、加减乘除操作。`} />
        </div>
      </Item>
      {/* <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
        <Item
          type="node"
          size="140*45"
          shape="flow-rect"
          model={{
            color: '#9f94ff',
            label: '选择节点',
            _nodetype: 'select',
            style: {
              stroke: '#9f94ff',
              lineWidth: 1,
            },
          }}
          src={''}
        >
          <div className={styles['purple-node']}>选择节点</div>
        </Item>
      </Condition> */}

      <Item
        type="node"
        size="140*45"
        shape="flow-rect"
        model={{
          color: '#ffd591',
          label: '业务流程节点',
          _nodetype: 'business',
          style: {
            stroke: '#f90',
            lineWidth: 1,
          },
        }}
        src={''}
      >
        <div className={styles['orange-node']}>
          业务流程节点
          <Tip
            title={
              <>
                多个节点可以封装为一个业务流程重复使用，将业务流程节点拖拽至画布中即可新增，双击配置关联的业务流程。具体的业务流程需提前在“业务流程管理”模块中新增。{' '}
                <b>画布中右键业务流程节点可快速进入对应的业务流程。</b>{' '}
              </>
            }
          />
        </div>
      </Item>
    </ItemPanel>
  );
};

export default FlowItemPanel;
