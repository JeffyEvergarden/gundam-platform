import { Card } from 'antd';
import { Minimap } from 'gg-editor';
import { useEffect } from 'react';

const EditorMinimap = () => {
  return (
    <Card type="inner" size="small" title="预览图" bordered={false}>
      <Minimap height={200} />
    </Card>
  );
};

export default EditorMinimap;
