import { Request, Response } from 'express';

const successCode = '000000';

//话术标签列表
const getConfig = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
    data: {
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
          configName: 'gagaluansha',
          configValue: 'weisuofayu',
          configDesc: 'rangwoduxiangjingyan',
        },
        {
          id: 'xxxxx',
          configType: 0,
          configKey: '222',
          configName: 'faqijinggong',
          configValue: 'kaishicetui',
          configDesc: 'qingqiujihe',
        },
        {
          id: 'xxxxx',
          configType: 0,
          configKey: '333',
          configName: 'jingongzhuzai',
          configValue: 'jingongbaojun',
          configDesc: 'difangshuijing',
        },
      ],
    },
  });
};

// 菜单管理相关
export default {
  // 话术标签管理相关
  'POST /robot/config/configInfo': getConfig, //话术标签删除
};
