import { ContextMenu, EdgeMenu, NodeMenu, withPropsAPI } from 'gg-editor';

import { useEffect } from 'react';
import styles from './index.less';
import MenuItem from './MenuItem';

const FlowContextMenu = (props: any) => {
  const { propsAPI, activeNode } = props;

  const _nodetype = activeNode?._nodetype;

  // console.log(_nodetype);

  // const item: any = propsAPI?.getSelected?.()?.[0];

  useEffect(() => {
    console.log('------');
    console.log(propsAPI?.getSelected?.());
  }, []);

  return (
    <ContextMenu className={styles.contextMenu}>
      <NodeMenu>
        {_nodetype === 'business' && <MenuItem command="go" text={'进入'} />}
        <MenuItem command="delete" text={'删除'} />
        <MenuItem command="copy" text={'复制'} />
      </NodeMenu>
      <MenuItem command="pasteHere" text={'粘贴'} />

      <EdgeMenu>
        <MenuItem command="delete" text={'删除'} />
      </EdgeMenu>
    </ContextMenu>
  );
};

export default withPropsAPI(FlowContextMenu as any);
