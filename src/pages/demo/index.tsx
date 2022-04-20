import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;

const reg = /(\$|#)\{\w+\}/g;

const formatHtml = (str: any) => {
  if (!str) {
    return ['无内容展示'];
  }
  // 正则列表匹配出来的
  const list: any[] = str.match(reg);
  console.log(list);
  if (list) {
    let strList = [];
    while (list.length > 0) {
      let key = list.shift();
      let _list: any[] = str.split(key);
      if (_list.length > 1) {
        let val = _list.shift();
        strList.push(val, {
          type: key[0] === '$' ? '变量' : '词槽',
          value: key.substring(2, key.length - 1),
        });
        str = _list.join(key);
      }
    }
    return strList;
  } else {
    return [str];
  }
};

const DrawerForm = (props: any) => {
  const strList: any[] = formatHtml('asfasfafa${fa${fuck00}ke}d#{fuck}adadas${fake2}');

  const [focus, setFocus] = useState<boolean>(true);

  return (
    <div className={`${styles['div-content']}`}>
      {strList?.map((item: any) => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object') {
          return <span className={styles['sp-text']}>{item.value}</span>;
        }
      })}
      {focus && <span className={styles['focus']}></span>}
    </div>
  );
};

export default DrawerForm;
