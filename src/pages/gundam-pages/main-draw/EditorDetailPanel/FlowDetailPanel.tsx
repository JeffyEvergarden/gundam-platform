import { CanvasPanel, DetailPanel, EdgePanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import NodeForm from './NodeForm';
import styles from './index.less';

const FlowDetailPanel = (props: any) => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <NodeForm type="node" {...props} />
    </NodePanel>
    <EdgePanel>
      <NodeForm type="edge" openSetting={props.openEdgeSetting} />
    </EdgePanel>
  </DetailPanel>
);

export default FlowDetailPanel;
