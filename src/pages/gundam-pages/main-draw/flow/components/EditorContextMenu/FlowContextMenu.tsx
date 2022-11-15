import { withPropsAPI, ContextMenu, EdgeMenu, NodeMenu } from 'gg-editor';

import MenuItem from './MenuItem';
import styles from './index.less';
import { useEffect } from 'react';

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
      <MenuItem command="pasteHere" text={'粘贴'} />
      <NodeMenu>
        <MenuItem command="delete" text={'删除'} />
        <MenuItem command="copy" text={'复制'} />
        {_nodetype === 'business' && <MenuItem command="go" text={'进入'} />}
      </NodeMenu>
      <EdgeMenu>
        <MenuItem command="delete" text={'删除'} />
      </EdgeMenu>
    </ContextMenu>
  );
};

export default withPropsAPI(FlowContextMenu as any);
