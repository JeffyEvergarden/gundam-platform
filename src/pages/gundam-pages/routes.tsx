import { CrownOutlined } from '@ant-design/icons';

export default [
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/mainDraw',
    name: '主流程配置',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/detail',
    name: '全局配置',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/nodeConfig',
        // component: './gundam-pages/detail',
        name: '节点配置',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/globalConfig',
        // component: './gundam-pages/detail',
        name: '全局变量配置',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/interfaceConfig',
        // component: './gundam-pages/detail/interfaceConfig',
        name: '接口配置',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/FAQConfig',
        // component: './gundam-pages/detail/interfaceConfig',
        name: 'FAQ配置',
      },
    ],
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/wish',
    name: '意图管理',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/wordSlotLibrary',
    name: '词槽管理',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/lexiconManage',
    name: '词库管理',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/spokenLabel',
    name: '话术标签管理',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/businessDraw',
    exact: true,
    _info: { fuck: true },
    name: '业务流程管理',
  },
  {
    icon: <CrownOutlined />,
    hideInMenu: true,
    path: '/gundamPages/businessDraw/detail',
    name: '业务流程管理-详情配置',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/faq',
    name: 'FAQ管理',
  },
];
