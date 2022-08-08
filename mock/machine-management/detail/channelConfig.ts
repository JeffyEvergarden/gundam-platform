import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getChannelConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      pageSize: 10,
      totalPage: 12,
      page: 1,
      list: [
        {
          channelCode: 'media_wx',
          channelName: '微信',
        },
        {
          channelCode: 'media_zyqb',
          channelName: '中邮钱包',
        },
        {
          channelCode: 'media_zfb',
          channelName: '支付宝',
        },
        {
          channelCode: 'media_jtyw',
          channelName: '集团邮务',
        },
        {
          channelCode: 'media_gw',
          channelName: '中邮官网',
        },
        {
          channelCode: 'media_ycsjyh',
          channelName: '邮储手机银行',
        },
        {
          channelCode: 'media_test',
          channelName: '测试',
        },
        {
          channelCode: 'media_zfb2',
          channelName: '支付宝2',
        },
        {
          channelCode: 'media_jtyw2',
          channelName: '集团邮务2',
        },
        {
          channelCode: 'media_gw2',
          channelName: '中邮官网2',
        },
        {
          channelCode: 'media_ycsjyh2',
          channelName: '邮储手机银行2',
        },
        {
          channelCode: 'media_test2',
          channelName: '测试2',
        },
      ],
    },
  });
};

export default {
  'GET /aichat/robot/channel/list': getChannelConfig, // 获取渠道列表
  'POST /aichat/robot/channel/add': normalDeal, // 添加新渠道

  'POST /aichat/robot/channel/update': normalDeal, // 修改渠道
  'POST /aichat/robot/channel/delete': normalDeal, // 删除渠道
};
