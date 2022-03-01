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
          color: '#1890FF',
          label: '新节点',
          _nodetype: 'normal',
        }}
        src={''}
      >
        <div className={styles['blue-node']}>普通节点</div>
      </Item>

      <Condition r-if={type === 'main'}>
        <Item
          type="node"
          size="140*45"
          shape="flow-rect"
          model={{
            color: '#fffbe6',
            label: '业务流程节点',
            _nodetype: 'business',
            style: {
              stroke: '#f90',
              lineWidth: 1,
              strokeOpacity: 1,
            },
          }}
          src={''}
        >
          <div className={styles['orange-node']}>业务流程节点</div>
        </Item>
      </Condition>
    </ItemPanel>
  );
};

export default FlowItemPanel;
