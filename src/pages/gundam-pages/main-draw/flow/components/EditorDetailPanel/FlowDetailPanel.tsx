import { CanvasPanel, DetailPanel, EdgePanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import DetailForm from './DetailForm';
import styles from './index.less';

const FlowDetailPanel = (props: any) => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node" {...props} />
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge" {...props} />
    </EdgePanel>
  </DetailPanel>
);

export default FlowDetailPanel;
