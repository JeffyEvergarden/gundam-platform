import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const Testmodel: React.FC<any> = (props: any) => {
  // 业务流程列表
  const { flowList, treeData } = useModel('drawer' as any, (model: any) => {
    if (!model) {
      console.log('model为空');
    }
    return {
      flowList: model?._originFlowList || [],
      treeData: model?.treeData || [],
    };
  });

  return (
    <div>
      {flowList.length} _ {treeData.length}
    </div>
  );
};

export default Testmodel;
