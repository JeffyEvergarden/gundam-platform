import config from '../../../src/config';

const successCode = config.successCode;
const editConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getTts = (req: any, res: any) => {
  res.json({
    data: {
      manufacturer: 'ali',
      id: '111',
      timbre: 'xiaomei',
      speed: 5.0,
      tone: 5.0,
      volume: 5.0,
    },
    resultCode: successCode,
    resultDesc: '成功',
  });
};

export default {
  'GET /aichat/robot/tts/getConfig': getTts,
  'POST /aichat/robot/tts/updateConfig': editConfig,
};
