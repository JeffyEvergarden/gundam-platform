import { Request, Response } from 'express';

const successCode = 100;
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
    datas: [
      {
        id: 'xxxxx',
        configType: 0,
        configName: 'thresholdGap',
        configValue: '1.0',
        configDesc: 'var1',
        configKey: 'THRESHOLD_GAP',
        robotId: '00000',
      },
      {
        id: 'xxxxx',
        configType: 0,
        configName: 'threshold',
        configValue: '1.0',
        configDesc: 'var1',
        configKey: 'THRESHOLD',
        robotId: '00000',
      },
      {
        id: 'xxxxx',
        configType: 0,
        configName: 'silenceToDeal',
        configValue: '静默',
        configDesc: 'var1',
        configKey: 'SILENCE_TO_DEAL',
        robotId: '00000',
      },
      {
        id: 'xxxxx',
        configType: 0,
        configName: 'refuseToDeal',
        configValue: '拒识',
        configDesc: 'var1',
        configKey: 'REFUSE_TO_DEAL',
        robotId: '00000',
      },
      {
        id: 'xxxxx',
        configType: 0,
        configName: 'clearToDeal',
        configValue: '澄清',
        configDesc: 'var1',
        configKey: 'CLEAR_TO_DEAL',
        robotId: '00000',
      },
      {
        id: 'xxxxx',
        configType: 1,
        configName: 'thresholdGap',
        configValue: '1.0',
        configDesc: 'var1',
        configKey: 'THRESHOLD_GAP',
        robotId: '00000',
      },
    ],
  });
};

export default {
  'POST /aichat/robot/config/configInfo': getConfig, //
  'POST /aichat/robot/config/configUpdate': editConfig, //
};
