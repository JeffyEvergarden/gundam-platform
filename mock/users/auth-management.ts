import { Request, Response } from 'express';
import { result } from 'lodash';

const getMyAuth = (req: Request, res: Response) => {
  res.json({
    datas: ['0-0-1', '0-0-2', '0-0-3', '1-0-0', '1-0-0'],
    resultCode: '000',
  });
};

export default {
  'GET /aichat/users/myAuth': getMyAuth,
};
