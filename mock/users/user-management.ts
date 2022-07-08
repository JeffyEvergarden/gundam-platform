import { Request, Response } from 'express';
import config from '../../src/config';

// faq 标准模块相关

const successCode = config.successCode;

const getUsers = (req: Request, res: Response) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 2,
      page: 1,
      list: [
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
    },
  });
};

const normalDeal = (req: Request, res: Response) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
  });
};

export default {
  'GET /aichat/robot/users/userlist': getUsers,
  'POST /aichat/robot/users/updateUserAuth': normalDeal,
};
