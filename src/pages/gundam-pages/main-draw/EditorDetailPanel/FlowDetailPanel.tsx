import { CanvasPanel, DetailPanel, EdgePanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import NodeForm from './NodeForm';
import styles from './index.less';

const FlowDetailPanel = (props: any) => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <NodeForm {...props} type="node" />
    </NodePanel>
    <EdgePanel>
      <NodeForm openSetting={props.openEdgeSetting} type="edge" />
    </EdgePanel>
  </DetailPanel>
);

export default FlowDetailPanel;
