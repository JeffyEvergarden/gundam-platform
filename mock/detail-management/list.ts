import { Request, Response } from 'express';

const successCode = '100';
const editConfig = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

const getConfig = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
    datas: {
      silencecToDeal: '还在吗？',
      refuseToDeal: '没明白您的意思，能换个说法吗？',
      robotType: 0,
      threshold: 0.93,
      thresholdGap: 0.13,
      maxThreshold: 0.93,
      minThreshold: 0.13,
      clearToDeal: 'ssxxzyzybaba',
      childrenList: [
        {
          id: 'xxxxx',
          configType: 0,
          configKey: '111',
          configName: '用户名',
          configValue: 'userName',
          configDesc: 'var1',
        },
        {
          id: 'xxxxx',
          configType: 0,
          configKey: '222',
          configName: '用户名2',
          configValue: 'userName2',
          configDesc: 'var2',
        },
        {
          id: 'xxxxx',
          configType: 0,
          configKey: '333',
          configName: '用户名3',
          configValue: 'userName3',
          configDesc: 'var3',
        },
      ],
    },
  });
};

export default {
  'POST /robot/config/configInfo': getConfig, //
  'POST /robot/config/configUpdate': editConfig, //
};
