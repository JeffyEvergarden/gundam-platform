import React, { useEffect } from 'react';
import { useModel, Link } from 'umi';
import MainDraw from '@/pages/gundam-pages/main-draw';
import { Result, Button, Space, Badge, Tooltip, Breadcrumb } from 'antd';

import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';

const SubDrawPages: React.FC<any> = (props: any) => {
  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));
  const { getFlowList, originFlowList } = useModel('drawer' as any, (model: any) => ({
    originFlowList: model._originFlowList,
    getFlowList: model.getFlowList,
  }));

  useEffect(() => {
    getFlowList(info.id);
  }, []);

  if (businessFlowId) {
    return (
      <PageContainer
        header={{
          title: (
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to={'/gundamPages/businessDraw'}>业务流程管理-详情配置</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={'/gundamPages/businessDraw/detail'}>
                  {originFlowList?.find((item: any) => item?.id == businessFlowId)?.flowName}
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          ),
          ghost: true,
        }}
      >
        <MainDraw type="business"></MainDraw>
      </PageContainer>
    );
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
