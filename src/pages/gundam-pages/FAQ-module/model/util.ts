const channelMap = {
  media_wx: '微信',
  media_zyqb: '中邮钱包',
  media_zfb: '支付宝',
  media_jtyw: '集团邮务',
  media_gw: '中邮官网',
  media_ycsjyh: '邮储手机银行',
};

export const formatChannel = (val: any) => {
  if (typeof val === 'string' || typeof val === 'number') {
    return channelMap[val] || '';
  } else {
    return '';
  }
};