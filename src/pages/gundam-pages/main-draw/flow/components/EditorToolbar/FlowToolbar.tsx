import { Button } from 'antd';
import { Toolbar } from 'gg-editor';
import { FlowItemPanel } from '../EditorItemPanel';
import styles from './index.less';
import ToolbarButton from './ToolbarButton';

const FlowToolbar = (props: any) => {
  const { save, type } = props;
  const onSave = () => {
    save?.();
  };
  return (
    <div className={styles.toolbox}>
      <Toolbar className={styles.toolbar}>
        {/* 上一步 */}
        {/* <ToolbarButton command="undo" text={'上一步'} /> */}
        {/* 下一步 */}

        {/* <ToolbarButton command="redo" text={'下一步'} /> */}
        {/*
          <Divider type="vertical" />
          <ToolbarButton command="delete" />
          <Divider type="vertical" /> 
        */}
        <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
        <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
        <ToolbarButton command="autoZoom" icon="fit-map" text="居中定位" />
        <ToolbarButton command="resetZoom" icon="actual-size" text="回归原始尺寸" />

        <FlowItemPanel type={type} />
      </Toolbar>

      <div className={styles.extraBar}>
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};
export default FlowToolbar;
