import { Request, Response } from 'express';
import config from '../../src/config';
import { codeToObjMap } from '../../src/auth/util';

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
          userName: '梁山伯',
          account: 'liangshanbo',
          organization: '科技部',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          lastLoginTime: '2018-08-09 19:00',
          roles: [
            {
              code: '001',
              name: '系统管理员',
            },
            {
              code: '002',
              name: '普通管理员',
            },
          ],
        },
        {
          id: '000000002',
          userName: '梁世清',
          organization: '世界部',
          account: 'liangshiqing',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          lastLoginTime: '2018-08-09 19:00',
          roles: [
            {
              code: '001',
              name: '系统管理员',
            },
            {
              code: '000',
              name: '系统管理员1',
            },
            {
              code: '002',
              name: '系统管理员2',
            },
            {
              code: '003',
              name: '系统管理员3',
            },
            {
              code: '004',
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
              code: '001',
              name: '系统管理员',
            },
          ],
        },
      ],
    },
  });
};

const normalDeal = (req: Request, res: Response) => {
  const list: any = Object.keys(codeToObjMap).map((key: any) => {
    return {
      roleCode: '001',
      operationCode: key,
    };
  });
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: list,
  });
};

export default {
  'GET /aichat/robot/user/listPage': getUsers,
  'GET /aichat/robot/user/getPermission': normalDeal,
};
