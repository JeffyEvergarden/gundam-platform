import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const uploadFile = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: 'fategrandorder',
  });
};

//获取图片
// no such file or directory, stat '/Users/jeffy/Documents/code/gundam-platform/logo.png'
const getFile = (req: any, res: any, next: any) => {
  var options = {
    root: './public',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  // 图片
  res.sendFile('logo.png', options, function (err: any) {
    if (err) {
      next(err);
    } else {
    }
  });
};

export default {
  'POST /aichat/robot/file/uploadFile': uploadFile, // 获取问答列表
  'GET /aichat/robot/file/getFile': getFile,
};
