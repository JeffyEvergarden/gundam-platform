import { Command } from 'gg-editor';
import React from 'react';
import eventbus from '../../utils/eventbus';
import styles from './index.less';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

type MenuItemProps = {
  command: string;
  icon?: string;
  text?: string;
};
const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <div
        className={styles.item}
        onClick={() => {
          console.log(command);
          eventbus.$emit('command', command); // 监听事件
        }}
      >
        <span>{text || upperFirst(command)}</span>
      </div>
    </Command>
  );
};

export default MenuItem;
