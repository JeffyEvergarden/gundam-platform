import { Input, Select } from 'antd';

import AudioPlay from '@/components/AudioPlay';
import { history, useLocation } from 'umi';
import styles from './style.less';
import MonacoEditor from '@/components/MonacoEditor';
const { TextArea } = Input;
const { Option } = Select;

const Demo = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const path = history.location.pathname;

  return (
    <div className={`${styles['div-content']}`}>
      <div className={styles['box']}>
        <AudioPlay musicSrc={'/aichat/mp3/bluebird.mp3'} />
      </div>
      <div className={styles['box']}>
        <AudioPlay musicSrc={'/aichat/mp3/bluebird.mp3'} />
      </div>
      <div>
        <MonacoEditor />
      </div>
    </div>
  );
};

export default Demo;
