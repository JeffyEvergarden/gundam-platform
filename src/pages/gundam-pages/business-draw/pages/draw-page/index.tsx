import React from 'react';
import { useModel } from 'umi';
import MainDraw from '@/pages/gundam-pages/main-draw';
import { Result } from 'antd';

const SubDrawPages: React.FC<any> = (props: any) => {
  const { businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  if (businessFlowId) {
    return <MainDraw type="business"></MainDraw>;
  } else {
    return (
      <Result
        title="业务流程流程管理"
        subTitle="获取不到业务流程ID"
        extra={
          <>
            {/* <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button> */}
          </>
        }
      />
    );
  }
};

export default SubDrawPages;
