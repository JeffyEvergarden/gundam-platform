import { CanvasPanel, DetailPanel, EdgePanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import DetailForm from './DetailForm';
import styles from './index.less';

const FlowDetailPanel = () => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge" />
    </EdgePanel>
  </DetailPanel>
);

export default FlowDetailPanel;
