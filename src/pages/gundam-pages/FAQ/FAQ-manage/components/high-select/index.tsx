import { Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { HIGH_CONFIG_SELECT } from '../../const';
import style from './style.less';

interface HighConfigProps {
  value: any;
  onChange: (...args: any[]) => void;
}

const HighConfigSelect = (props: HighConfigProps) => {
  const { value, onChange } = props;

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { userList, getCreateUser } = useModel('drawer' as any, (model: any) => ({
    userList: model.userList,
    getCreateUser: model.getCreateUser,
  }));

  const includes = (name: any, val: any) => {
    if (Array.isArray(val)) {
      return val.includes(name);
    } else {
      return val === name;
    }
  };

  useEffect(() => {
    getCreateUser(info.id);
  }, []);

  return (
    <div className={style['high-config-box']}>
      {HIGH_CONFIG_SELECT.map((listItem: any, listKey: number) => {
        const title = listItem.label;
        const _key = listItem.name; // 对象key值

        const val = value?.[_key];

        const children = listItem.children || [];

        const type = listItem.type || 'single';

        const onClick = (name: any, key: string, type: string, _key: any) => {
          console.log(name, key, type);

          let _val = value?.[key];
          if (type === 'single') {
            if (_key == 'orderType') {
              _val = name;
            } else {
              _val = [name];
            }
          } else if (type === 'multi') {
            _val = Array.isArray(_val) ? _val : [];

            const i = _val.indexOf(name);
            if (name == null) {
              // 是全部 得清空其他值
              _val = null;
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
              {_key == 'creatorList' &&
                userList.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`${style['sub-item']} ${
                        includes(item == '全部' ? null : item, val)
                          ? style['sub-item_selected']
                          : ''
                      }`}
                      onClick={() => {
                        onClick(item == '全部' ? null : item, _key, type, _key);
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              {_key != 'creatorList' &&
                children.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`${style['sub-item']} ${
                        includes(item.name, val) ? style['sub-item_selected'] : ''
                      }`}
                      onClick={() => {
                        onClick(item.name, _key, type, _key);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="link"
          onClick={() => {
            onChange({
              channelList: ['all'],
              approvalStatusList: [0],
              orderType: 0,
              creatorList: null,
            });
          }}
        >
          重置
        </Button>
      </div>
    </div>
  );
};

export default HighConfigSelect;
