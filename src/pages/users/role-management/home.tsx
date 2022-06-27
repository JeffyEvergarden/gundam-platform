import Switch from '@/components/Route/Switch';
import Route from '@/components/Route';

import KeepAlive, { AliveScope } from 'react-activation';
import { history, useLocation } from 'umi';
import Page404 from '@/pages/404';
import RoleManegement from './index';
import RoleManegementEdit from './sub-page/auth-page';

const KeepAliveRoleManage = () => {
  return (
    <KeepAlive>
      <RoleManegement />
    </KeepAlive>
  );
};

const pathList = [
  {
    path: '/users/roleManagement/list',
    component: KeepAliveRoleManage,
    name: '角色列表',
  },
  {
    path: '/users/roleManagement/edit',
    component: RoleManegementEdit,
    name: '编辑面板',
  },
  { redirect: '/users/roleManagement/list' },
  {
    component: Page404,
    name: '404',
  },
];

const RoleManagementHome = (props: any) => {
  const location = useLocation();

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

export default RoleManagementHome;
