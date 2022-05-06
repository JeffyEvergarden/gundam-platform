import { HIGH_CONFIG_SELECT } from '../../const';
import style from './style.less';

interface HighConfigProps {
  value: any;
  onChange: (...args: any[]) => void;
}

const HighConfigSelect = (props: HighConfigProps) => {
  const { value, onChange } = props;

  const includes = (name: any, val: any) => {
    if (Array.isArray(val)) {
      return val.includes(name);
    } else {
      return val === name;
    }
  };

  return (
    <div className={style['high-config-box']}>
      {HIGH_CONFIG_SELECT.map((listItem: any, listKey: number) => {
        const title = listItem.label;
        const _key = listItem.name; // 对象key值

        const val = value?.[_key];

        const children = listItem.children || [];

        const type = listItem.type || 'single';

        const onClick = (name: any, key: string, type: string) => {
          let _val = value?.[key];
          if (type === 'single') {
            _val = name;
          } else if (type === 'multi') {
            _val = Array.isArray(_val) ? _val : [];

            const i = _val.indexOf(name);
            if (name == 0) {
              // 是全部 得清空其他值
              _val = [0];
            } else if (i > -1) {
              _val.splice(i, 1);
            } else {
              _val = _val.filter((item: any) => {
                return item !== 0;
              });
              _val.push(name);
            }
          }
          onChange({
            ...value,
            [key]: _val,
          });
        };

        return (
          <div key={listKey} className={style['box-item']}>
            <div className={style['box-title']}>{title}</div>
            <div className={style['box-content']}>
              {children.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`${style['sub-item']} ${
                      includes(item.name, val) ? style['sub-item_selected'] : ''
                    }`}
                    onClick={() => {
                      onClick(item.name, _key, type);
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HighConfigSelect;
