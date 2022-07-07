import { Request, Response } from 'express';

const getUsers = (req: Request, res: Response) => {
  res.json({
    data: [
      {
        id: '000000001',
        name: '梁山伯',
        account: 'liangshanbo',
        departName: '科技部',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        lastLoginTime: '2018-08-09 19:00',
        roles: [
          {
            id: '001',
            name: '系统管理员',
          },
          {
            id: '002',
            name: '普通管理员',
          },
        ],
      },
      {
        id: '000000002',
        name: '梁世清',
        departName: '世界部',
        account: 'liangshiqing',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        lastLoginTime: '2018-08-09 19:00',
        roles: [
          {
            id: '001',
            name: '系统管理员',
          },
          {
            id: '000',
            name: '系统管理员1',
          },
          {
            id: '002',
            name: '系统管理员2',
          },
          {
            id: '003',
            name: '系统管理员3',
          },
          {
            id: '004',
            name: '系统管理员4',
          },
        ],
      },
      {
        id: '000000003',
        name: '黄RUI',
        account: 'HR',
        departName: '世界部',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        lastLoginTime: '2018-08-09 19:00',
        roles: [
          {
            id: '001',
            name: '系统管理员',
          },
        ],
      },
    ],
  });
};

export default {
  'GET /aichat/robot/users/userlist': getUsers,
};
