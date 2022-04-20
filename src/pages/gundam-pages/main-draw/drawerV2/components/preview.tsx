import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Button, Popover } from 'antd';
import { useModel } from 'umi';

const WordSlotModal: React.FC<any> = (props: any) => {
  const { text } = props;
  const [content, setContent] = useState<any>();
  const { wordSlotList } = useModel('drawer' as any, (model: any) => ({
    wordSlotList: model._wordSlotList, // 业务流程列表
  }));
  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList, // 业务流程列表
  }));

  const reg = /(\$|#)\{\w+\}/g;

  const formatHtml = (str: any) => {
    if (!str) {
      return ['无内容展示'];
    }
    // 正则列表匹配出来的
    const list = str.match(reg);
    if (list) {
      let strList = [];
      while (list.length > 0) {
        let key = list.shift();
        let _list = str.split(key);
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
  console.log(formatHtml(text));
  const fanyi = (textArr: any) => {
    let str = '';
    textArr?.forEach((item: any) => {
      if (typeof item == 'string') {
        str += item;
      } else {
        if (item.type == '变量') {
          console.log(globalVarList.find((val: any) => item.value == val.name));
          str += `<span>${globalVarList.find((val: any) => item.value == val.name).label}</span>`;
        } else if (item.type == '词槽') {
          str += `<span>${wordSlotList.find((val: any) => item.value == val.name).label}</span>`;
        }
      }
    });
    return <div dangerouslySetInnerHTML={{ __html: str }}></div>;
  };
  useEffect(() => {
    setContent(fanyi(formatHtml(text)));
  }, [text]);

  return (
    <Popover content={content}>
      <Button type="link">预览</Button>
    </Popover>
  );
};

export default WordSlotModal;
