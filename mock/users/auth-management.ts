import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const getMyAuth = (req: Request, res: Response) => {
  res.json({
    datas: ['0-0-1', '0-0-2', '0-0-3', '1-0-0', '1-0-0'],
    resultCode: successCode,
  });
};

const getRoleList = (req: Request, res: Response) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalPage: 6,
      page: 1,
      list: [
        {
          id: '001',
          roleName: '超级管理员',
          roleDesc: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '002',
          roleName: '普通管理员',
          roleDesc: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '003',
          roleName: '管理员1',
          roleDesc: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '004',
          roleName: '管理员2',
          roleDesc: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '005',
          roleName: '管理员3',
          roleDesc: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '006',
          roleName: '管理员4',
          roleDesc: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
      ],
    },
  });
};

export default {
  'GET /aichat/users/myAuth': getMyAuth,
  'GET /aichat/users/role/list': getRoleList,
};
