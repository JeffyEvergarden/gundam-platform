import MainDraw from '@/pages/gundam-pages/main-draw';
import { Badge, Breadcrumb, Button, Result, Space, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { Link, useModel } from 'umi';

import Condition from '@/components/Condition';
import { usePublishModel } from '@/pages/gundam/management/model';
import { PageContainer } from '@ant-design/pro-layout';
import style from '../../../main-draw/style.less'; //主流程样式

const SubDrawPages: React.FC<any> = (props: any) => {
  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));
  const { getFlowList, originFlowList } = useModel('drawer' as any, (model: any) => ({
    originFlowList: model._originFlowList,
    getFlowList: model.getFlowList,
  }));
  const {
    loading,
    testLoading,
    publishProduction,
    publishTest,
    productionTime,
    testTime,
    getTime,
    status,
    testStatus,
    result,
    testResult,
  } = usePublishModel();

  useEffect(() => {
    if (!info.id) {
      return;
    }
    // 开启定时刷新生产时间
    getTime(info.id);
    const fn: any = setInterval(() => {
      getTime(info.id);
    }, 30 * 1000);

    return () => {
      clearInterval(fn);
    };
  }, [info]);

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
          extra: (
            <Space>
              <div className={style['time-box']}>
                <Condition r-if={productionTime}>
                  <span className={style['time-module']} style={{ marginRight: '24px' }}>
                    <span className={style['label']}>生产发布状态:</span>
                    {status == 1 && (
                      <span className={style['box']}>
                        <Badge status="success" size="default" />
                        <span className={style['msg']}>正常</span>
                        <span className={style['time']}>({productionTime})</span>
                      </span>
                    )}

                    {status == 0 && (
                      <Tooltip placement="bottomLeft" title={result || '未知系统异常'}>
                        <span className={style['box']}>
                          <Badge status={`${productionTime == '-' ? 'default' : 'error'}`} />
                          <span className={style['msg']}>
                            {productionTime == '-' ? '未发布' : `失败，${result}`}
                          </span>
                          <span className={style['time']}>({productionTime})</span>
                        </span>
                      </Tooltip>
                    )}
                    {status == 2 && (
                      <span className={style['box']}>
                        <Badge status="warning" size="default" />
                        <span className={style['msg']}>发布中</span>
                        <span className={style['time']}>({productionTime})</span>
                      </span>
                    )}
                  </span>
                </Condition>
                <Condition r-if={testTime}>
                  <span className={style['time-module']}>
                    <span className={style['label']}>测试发布状态:</span>
                    {testStatus == 1 && (
                      <span className={style['box']}>
                        <Badge status="success" />
                        <span className={style['msg']}>正常</span>
                        <span className={style['time']}>({testTime})</span>
                      </span>
                    )}

                    {testStatus == 0 && (
                      <Tooltip placement="bottomLeft" title={testResult || '未知系统异常'}>
                        <span className={style['box']}>
                          <Badge status={`${testTime == '-' ? 'default' : 'error'}`} />
                          <span className={style['msg']}>
                            {testTime == '-' ? '未发布' : `失败，${testResult}`}
                          </span>
                          <span className={style['time']}>({testTime})</span>
                        </span>
                      </Tooltip>
                    )}
                    {testStatus == 2 && (
                      <span className={style['box']}>
                        <Badge status="warning" />
                        <span className={style['msg']}>发布中</span>
                        <span className={style['time']}>({testTime})</span>
                      </span>
                    )}
                  </span>
                </Condition>
              </div>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  publishProduction(info.id);
                }}
                disabled={info.status == 1}
              >
                发布生产
              </Button>

              <Button
                type="default"
                loading={testLoading}
                onClick={() => {
                  publishTest(info.id);
                }}
                disabled={info.status == 1 ? true : false}
              >
                发布测试
              </Button>
            </Space>
          ),
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
