import { channelMap } from '../../FAQ/const';

export const formatChannel = (val: any) => {
  if (typeof val === 'string' || typeof val === 'number') {
    return channelMap[val] || '';
  } else {
    return '';
  }
};
