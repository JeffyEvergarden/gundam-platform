import { Item, ItemPanel } from 'gg-editor';
import { Card } from 'antd';
import MyNodeList from './NodeList';
import styles from './index.less';
import { DetailPanel, NodePanel } from 'gg-editor';
import img2 from '@/asset/image/rect_2.svg';

interface PanelProps {
  addNode?: (node: any) => void;
  clickItem?: (node: any) => void;
}

const FlowItemPanel = (props: PanelProps) => {
  const { clickItem } = props;
  return (
    <ItemPanel className={styles.itemPanel}>
      <Item
        type="node"
        size="140*45"
        shape="flow-rect"
        model={{
          color: '#1890FF',
          label: '新节点',
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
          color: '#fffbe6',
          label: '业务流程节点',
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
    </ItemPanel>
  );
};

export default FlowItemPanel;
