import Tip from '@/components/Tip';
import { Popover } from 'antd';
import { useModel } from 'umi';
import style from './style.less';

const WordSlotModal: React.FC<any> = (props: any) => {
  const { text } = props;
  const { wordSlotList } = useModel('drawer' as any, (model: any) => ({
    wordSlotList: model._wordSlotList, // 业务流程列表
  }));
  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList, // 业务流程列表
  }));

  // const reg = /(\$|#)\{\w+\}/g;
  const reg = /(\$|#)\{([^}]*)\}/g;

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
      strList.push(str);
      return strList;
    } else {
      return [str];
    }
  };

  const fanyi = (textArr: any) => {
    return (
      <div className={style['div-content']}>
        {textArr?.map((item: any, index: any) => {
          if (typeof item == 'string') {
            return item;
          } else {
            if (item.type == '变量') {
              if (item.value?.indexOf('[') == '-1') {
                // if (!/^[\S]+\[[0-9]+\]\.+/g?.test(item?.value)) {
                if (item.value?.indexOf('.') != '-1') {
                  return (
                    <span key={index} className={style['varView-block']}>
                      {globalVarList?.find(
                        (val: any) => item.value?.slice(0, item.value?.indexOf('.')) == val.name,
                      )?.label
                        ? '${' +
                          `${
                            globalVarList?.find(
                              (val: any) =>
                                item.value?.slice(0, item.value?.indexOf('.')) == val.name,
                            )?.label + item.value?.slice(item.value?.indexOf('.'))
                          }}`
                        : `\${${item.value}}`}
                    </span>
                  );
                }
                return (
                  <span key={index} className={style['varView-block']}>
                    {globalVarList?.find((val: any) => item.value == val.name)?.label ||
                      `\${${item.value}}`}
                  </span>
                );
              } else {
                return (
                  <span key={index} className={style['varView-block']}>
                    {globalVarList?.find(
                      (val: any) => item.value?.slice(0, item.value?.indexOf('[')) == val.name,
                    )?.label
                      ? '${' +
                        `${
                          globalVarList?.find(
                            (val: any) =>
                              item.value?.slice(0, item.value?.indexOf('[')) == val.name,
                          )?.label + item.value?.slice(item.value?.indexOf('['))
                        }}`
                      : `\${${item.value}}`}
                  </span>
                );
              }
            } else if (item.type == '词槽') {
              console.log(item);
              // if (!/^[\S]+\[[0-9]+\]\.+/g?.test(item?.value)) {
              if (item.value?.indexOf('[') == '-1') {
                if (item.value?.indexOf('.') != '-1') {
                  return (
                    <span key={index} className={style['wordSoltView-block']}>
                      {wordSlotList?.find(
                        (val: any) => item.value?.slice(0, item.value?.indexOf('.')) == val.name,
                      )?.label
                        ? '#{' +
                          `${
                            wordSlotList?.find(
                              (val: any) =>
                                item.value?.slice(0, item.value?.indexOf('.')) == val.name,
                            )?.label + item.value?.slice(item.value?.indexOf('.'))
                          }}`
                        : `#{${item.value}}`}
                    </span>
                  );
                }
                return (
                  <span key={index} className={style['wordSoltView-block']}>
                    {wordSlotList?.find((val: any) => item.value == val.name)?.label ||
                      `#{${item.value}}`}
                  </span>
                );
              } else {
                return (
                  <span key={index} className={style['wordSoltView-block']}>
                    {wordSlotList?.find(
                      (val: any) => item.value?.slice(0, item.value?.indexOf('[')) == val.name,
                    )?.label
                      ? '#{' +
                        `${
                          wordSlotList?.find(
                            (val: any) =>
                              item.value?.slice(0, item.value?.indexOf('[')) == val.name,
                          )?.label + item.value?.slice(item.value?.indexOf('['))
                        }}`
                      : `#{${item.value}}`}
                  </span>
                );
              }
            }
          }
        })}
      </div>
    );
  };

  return (
    <span>
      <Popover content={fanyi(formatHtml(text))} placement={'topRight'}>
        <a type="link" style={{ justifySelf: 'flex-end' }}>
          预览
        </a>
      </Popover>{' '}
      <Tip
        placement={'topRight'}
        title={'将文本中插入的变量或词槽占位符转换为变量名及词槽名，方便查看。'}
      />
    </span>
  );
};

export default WordSlotModal;
