import { Badge, Button, Space, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { history, useAccess, useModel } from 'umi';

import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';

import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { usePublishModel } from '../../gundam/management/model';
import MainDraw from './index';
import style from './style.less';

// 机器人列表
const MainLayout: React.FC = (props: any) => {
  const access = useAccess();
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

  useEffect(() => {
    if (!access.accessAuth('robot_mg-main_page')) {
      //  code: 'robot_mg-main_page',
      history.replace('/gundamPages/home');
    }
  }, []);

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
              <Tip
                title={`发布生产后，将变更的内容部署至生产环境，包括全局配置、主流程配置、意图管理、录音管理的变化（FAQ新增后自动生效无需发布），可在“机器人模拟-生产”中测试效果。发布失败时，可在左侧查看失败原因。`}
              />
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
              <Tip
                title={
                  '发布测试后，将变更的内容部署至测试环境，包括全局配置、主流程配置、意图管理、录音管理的变化（FAQ新增后自动生效无需发布），可在“机器人模拟-测试”中测试效果。当测试没问题后可“发布生产”。发布失败时，可在左侧查看失败原因。'
                }
              />
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
