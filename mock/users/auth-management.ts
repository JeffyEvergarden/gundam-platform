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
          code: '001',
          name: '超级管理员',
          userCount: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          code: '002',
          name: '普通管理员',
          userCount: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
        {
          code: '003',
          name: '管理员1',
          userCount: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          code: '004',
          name: '管理员2',
          userCount: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
        {
          code: '005',
          name: '管理员3',
          userCount: '超级赛亚人4',
          createTime: '2022-02-02 22:22:22',
        },
        {
          code: '006',
          name: '管理员4',
          userCount: '超级赛亚人',
          createTime: '2022-02-02 22:22:22',
        },
      ],
    },
  });
};

const getRoleInfo = (req: Request, res: Response) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    datas: {
      code: '001',
      name: '超级管理员',
      userCount: '超级赛亚人4',
      createTime: '2022-02-02 22:22:22',
      authKeys: ['001-001-001'],
    },
    data: [
      {
        operationCode: '001-001-001',
        roleCode: '超级管理员',
      },
      {
        operationCode: '001-002-001',
        roleCode: '超级管理员',
      },
    ],
  });
};

const normalRes = (req: Request, res: Response) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    type: 'normal',
  });
};

export default {
  'GET /aichat/users/myAuth': getMyAuth,
  'GET /aichat/robot/role/list': getRoleList,
  'GET /aichat/robot/role/getPermission': getRoleInfo,
  'POST /aichat/users/role/addInfo': normalRes,
  'POST /aichat/users/role/updateInfo': normalRes,
  'POST /aichat/robot/role/savePermission': normalRes,
};
