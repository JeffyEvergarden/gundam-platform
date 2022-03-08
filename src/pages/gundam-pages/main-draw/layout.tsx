import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Button, Space, Badge, Tooltip } from 'antd';

import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';

import style from './style.less';
import { usePublishModel } from '../../gundam/management/model';
import Condition from '@/components/Condition';
import MainDraw from './index';

// 机器人列表
const MainLayout: React.FC = (props: any) => {
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
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
  return (
    <PageContainer
      header={{
        title: <ProBreadcrumb />,
        ghost: true,
        extra: (
          <Space>
            <div className={style['time-box']}>
              <Condition r-if={productionTime}>
                <span className={style['time-module']} style={{ marginRight: '24px' }}>
                  <span className={style['label']}>生产发布时间:</span>
                  {status && (
                    <span>
                      <Badge status="success" size="default" />
                      <span>{productionTime}</span>
                    </span>
                  )}

                  {!status && (
                    <Tooltip placement="bottomLeft" title={result || '未知系统异常'}>
                      <span>
                        <Badge status="error" />
                        <span>{productionTime}</span>
                      </span>
                    </Tooltip>
                  )}
                </span>
              </Condition>
              <Condition r-if={testTime}>
                <span className={style['time-module']}>
                  <span className={style['label']}>测试发布时间:</span>
                  {testStatus && (
                    <span>
                      <Badge status="success" />
                      <span>{testTime}</span>
                    </span>
                  )}

                  {!testStatus && (
                    <Tooltip placement="bottomLeft" title={testResult || '未知系统异常'}>
                      <span>
                        <Badge status="error" />
                        <span>{productionTime}</span>
                      </span>
                    </Tooltip>
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
      <MainDraw />
    </PageContainer>
  );
};

export default MainLayout;
