import { useState } from 'react';
import { message } from 'antd';

import { getConfig } from './api';

export const successCode = '000000';

// 机器人配置
export const useConfigModel = () => {
  const [configMsg, setConfigMsg] = useState<any>();
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const getRobotConfig = async (params?: any) => {
    setConfigLoading(true);
    let res: any = await getConfig(params);
    setConfigLoading(false);
    setConfigMsg(res?.data);
    return res?.data;
  };

  return {
    configMsg,
    configLoading,
    getRobotConfig,
  };
};
