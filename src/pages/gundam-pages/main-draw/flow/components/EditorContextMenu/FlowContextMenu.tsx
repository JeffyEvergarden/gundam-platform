import { ContextMenu, EdgeMenu, NodeMenu } from 'gg-editor';

import MenuItem from './MenuItem';
import styles from './index.less';

const FlowContextMenu = (props: any) => {
  const { onClick } = props;

  return (
    <ContextMenu className={styles.contextMenu}>
      <MenuItem command="pasteHere" text={'粘贴'} />
      <NodeMenu>
        <MenuItem command="delete" text={'删除'} />
        <MenuItem command="copy" text={'复制'} />
        {/* <div className={styles.item} onClick={onClick}>
          <span>设置</span>
        </div> */}
      </NodeMenu>
      <EdgeMenu>
        <MenuItem command="delete" text={'删除'} />
      </EdgeMenu>
    </ContextMenu>
  );
};

export default FlowContextMenu;
