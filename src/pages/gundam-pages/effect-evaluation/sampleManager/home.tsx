import Route from '@/components/Route';
import Switch from '@/components/Route/Switch';
import Page404 from '@/pages/404';
import KeepAlive, { AliveScope } from 'react-activation';

import SampleDetail from '../component/sampleDetail';
import SampleManager from '../sampleManager';

const Home = (props: any) => {
  // return <div style={{ width: '100%', height: '100%' }}>{props.children}</div>;

  const KeepAliveFAQManage = () => {
    return (
      <KeepAlive>
        <SampleManager />
      </KeepAlive>
    );
  };

  const pathList = [
    {
      path: '/gundamPages/effectEvaluation/sampleManager',
      component: KeepAliveFAQManage,
      name: '样本管理',
    },
    {
      path: '/gundamPages/effectEvaluation/sampleManager/sampleDetail',
      component: SampleDetail,
      name: '样本集',
    },
    { redirect: '/gundamPages/effectEvaluation/sampleManager' },
    {
      component: Page404,
      name: '404',
    },
  ];
  return (
    <AliveScope>
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          {pathList &&
            pathList.map((item: any, i: number) => {
              return (
                <Route
                  path={item.path}
                  key={i}
                  component={item.component}
                  redirect={item.redirect}
                />
              );
            })}
        </Switch>
      </div>
    </AliveScope>
  );
};

export default Home;
