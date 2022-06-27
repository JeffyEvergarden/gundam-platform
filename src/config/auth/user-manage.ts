export default [
  {
    key: '1',
    label: '用户管理',
    appKey: 'um',
    children: [
      {
        key: '1-1',
        label: '用户管理',
        appKey: 'um-user',
        children: [
          {
            key: '1-1-1',
            label: '查看列表',
            appKey: 'um-user-view',
          },
          {
            key: '1-1-2',
            label: '编辑',
            appKey: 'um-user-edit',
          },
          {
            key: '1-1-3',
            label: '删除',
            appKey: 'um-user-delete',
          },
        ],
      },
      {
        key: '1-2',
        label: '权限管理',
        appKey: 'um-role',
        children: [
          {
            key: '1-2-1',
            label: '查看列表',
            appKey: 'um-role-view',
          },
          {
            key: '1-2-2',
            label: '编辑',
            appKey: 'um-role-edit',
          },
          {
            key: '1-2-3',
            label: '删除',
            appKey: 'um-role-delete',
          },
        ],
      },
    ],
  },
];
