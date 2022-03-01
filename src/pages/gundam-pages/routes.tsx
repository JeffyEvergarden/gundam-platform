import { CrownOutlined } from '@ant-design/icons';

export default [
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/mainDraw',
    name: '主流程管理',
  },
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/detail',
    name: '机器人配置',
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
    path: '/gundamPages/aiSimulation',
    name: '机器人模拟',
  },
  {
    icon: <CrownOutlined />,
    hideInMenu: true,
    path: '/gundamPages/businessDraw/detail',
    name: '业务流程管理-详情配置',
  },
];
