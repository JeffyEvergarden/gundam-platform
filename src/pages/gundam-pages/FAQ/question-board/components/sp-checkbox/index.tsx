import React from 'react';
import style from './style.less';

interface CheckboxProps {
  value: any;
  onChange: (val: any[]) => void;
  list: any[];
}

const Checkbox: React.FC<any> = (props: any) => {
  const { value, onChange, list } = props;

  const includes = (key: any) => {
    if (Array.isArray(value)) {
      return value.includes(key);
    }
    return false;
  };

  const onClick = (item: any) => {
    let _value = Array.isArray(value) ? [...value] : [];
    const i = _value.indexOf(item.value);
    if (i < 0) {
      //不存在这个值
      _value.push(item.value);
      if (item.value === 'all') {
        // 选择全部 情况其他值
        _value = ['all'];
      } else {
        _value = _value.filter((subitem) => subitem !== 'all');
      }
    } else {
      _value.splice(i, 1);
    }
    onChange(_value);
  };

  return (
    <div className={style['checkbox-box']}>
      <div
        className={includes('all') ? style['box-item_selected'] : style['box-item']}
        onClick={() => {
          onClick({
            value: 'all',
          });
        }}
      >
        全部
      </div>

      {list.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className={includes(item.value) ? style['box-item_selected'] : style['box-item']}
            onClick={() => {
              onClick(item);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default Checkbox;
