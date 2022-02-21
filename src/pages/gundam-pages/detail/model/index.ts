import { useState } from 'react';
import { message } from 'antd';

import { getConfig, editConfig } from './api';

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

  const editRobotConfig = async (params?: any) => {
    setConfigLoading(true);
    let res: any = await editConfig(params);
    setConfigLoading(false);
    if (res.resultCode == successCode) {
      message.success(res.resultDesc || '成功');
    } else {
      message.info(res.resultDesc || '未知错误');
    }
    return res;
  };

  return {
    configMsg,
    configLoading,
    getRobotConfig,
    editRobotConfig,
  };
};
