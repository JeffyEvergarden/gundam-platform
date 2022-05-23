import Switch from '@/components/Route/Switch';
import Route from '@/components/Route';
import FAQManage from './FAQ-manage';
import QuestionBoardLayout from './question-board/layout';
import QuestionBoardSingle from './question-board/single';
import QuestionRecycle from './question-recycle';
import QuestionImport from './question-import';
import QuestionRecommend from './question-recommend';
import KeepAlive, { AliveScope } from 'react-activation';
import { history, useLocation } from 'umi';
import Page404 from '@/pages/404';

const KeepAliveFAQManage = () => {
  return (
    <KeepAlive>
      <FAQManage />
    </KeepAlive>
  );
};

const pathList = [
  {
    path: '/gundamPages/faq/main',
    component: KeepAliveFAQManage,
    name: 'FAQ管理',
  },
  {
    path: '/gundamPages/faq/board',
    component: QuestionBoardLayout,
    name: '编辑面板',
  },
  {
    path: '/gundamPages/faq/answer',
    component: QuestionBoardSingle,
    name: '编辑面板',
  },
  {
    path: '/gundamPages/faq/recycle',
    component: QuestionRecycle,
    name: '问题回收站',
  },
  {
    path: '/gundamPages/faq/import',
    component: QuestionImport,
    name: '问题批量导入',
  },
  {
    path: '/gundamPages/faq/recommend',
    component: QuestionRecommend,
    name: '推荐问',
  },
  {
    component: Page404,
    name: '404',
  },
];

const FAQPagesHome = (props: any) => {
  const location = useLocation();

  return (
    <AliveScope>
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          {pathList &&
            pathList.map((item: any) => {
              return <Route path={item.path} component={item.component} />;
            })}
        </Switch>
      </div>
    </AliveScope>
  );
};

export default FAQPagesHome;
