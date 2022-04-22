import { Item, ItemPanel } from 'gg-editor';
import { Card } from 'antd';
import styles from './index.less';
import Condition from '@/components/Condition';
interface PanelProps {
  type?: any;
}

const FlowItemPanel = (props: PanelProps) => {
  const { type } = props;
  return (
    <ItemPanel className={styles.itemPanel}>
      <Item
        type="node"
        size="140*45"
        shape="flow-rect"
        model={{
          color: '#2890F3',
          label: '新节点',
          _nodetype: 'normal',
        }}
        src={''}
      >
        <div className={styles['blue-node']}>普通节点</div>
      </Item>

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
        <div className={styles['orange-node']}>业务流程节点</div>
      </Item>
    </ItemPanel>
  );
};

export default FlowItemPanel;
