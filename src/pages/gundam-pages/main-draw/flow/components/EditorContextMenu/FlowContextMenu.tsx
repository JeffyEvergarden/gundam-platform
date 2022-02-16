import { ContextMenu, EdgeMenu, NodeMenu } from 'gg-editor';

import MenuItem from './MenuItem';
import styles from './index.less';

const FlowContextMenu = () => (
  <ContextMenu className={styles.contextMenu}>
    <NodeMenu>
      <MenuItem command="delete" text={'删除'} />
    </NodeMenu>
    <EdgeMenu>
      <MenuItem command="delete" text={'删除'} />
    </EdgeMenu>
  </ContextMenu>
);

export default FlowContextMenu;
