import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const getMyAuth = (req: Request, res: Response) => {
  res.json({
    datas: ['0-0-1', '0-0-2', '0-0-3', '1-0-0', '1-0-0'],
    resultCode: '000',
  });
};

const getRoleList = (req: Request, res: Response) => {
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
          id: '1',
          roleName: '超级管理员',
          roleDesc: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          id: '2',
          roleName: '普通管理员',
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
