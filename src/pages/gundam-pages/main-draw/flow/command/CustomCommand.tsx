import React from 'react';
import { RegisterCommand } from 'gg-editor';
import eventbus from '../utils/eventbus';

class CustomCommand extends React.Component {
  render() {
    const config = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      // 正向命令逻辑
      execute(/* editor */) {
        console.log('执行正向命令');
        eventbus.$emit('go');
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log('执行反向命令');
      },

      // 快捷按键配置
      shortcutCodes: [],
    };

    return <RegisterCommand name="go" config={config} />;
  }
}

export default CustomCommand;
