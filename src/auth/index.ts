import robot from './robot';

export const AUTH_LIST: any[] = [
  {
    label: '权限管理',
    value: 'auth',
    code: '000',
    children: [
      {
        label: '用户管理',
        value: 'auth',
        code: '000-001-000',
      },
      {
        label: '角色管理',
        value: 'auth',
        code: '000-002-000',
      },
    ],
  },
  {
    label: '机器人管理',
    value: 'robot_mg',
    code: '001-000',
    children: [
      {
        label: '机器人启用/停用',
        value: 'robot_mg-mg-op',
        code: '001-000-001',
      },
      {
        label: '机器人编辑',
        value: 'robot_mg-mg-edit',
        code: '001-000-003',
      },
      {
        label: '机器人配置',
        value: 'robot_mg-mg-conf',
        code: '001-000-002',
      },
      {
        label: '机器人删除',
        value: 'robot_mg-mg-del',
        code: '001-000-004',
      },
    ],
  },
  ...robot,
];
