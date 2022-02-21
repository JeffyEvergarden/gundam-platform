import { useState, useImperativeHandle, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './style.less';

const { Option } = Select;

const LabelSelect: React.FC<any> = (props: any) => {
  const { value, onChange, color, style } = props;

  const [num, setNum] = useState<number>(1);

  const add = () => {
    let tmp = value || [];
    let newValue = [...tmp, { name: num, label: num }];
    setNum(num + 1);
    console.log(newValue);
    onChange(newValue || []);
  };

  useEffect(() => {
    console.log('value:', value);
  }, [value]);

  return (
    <div className={styles['zy-row']} style={style}>
      <div className={styles['left']}>
        {!value && '--'}
        {value &&
          value?.map?.((item: any, index: number) => {
            return (
              <Tag color={color} key={index}>
                {item.label}
              </Tag>
            );
          })}
      </div>
      <div className={styles['right']}>
        <Button type="link" icon={<PlusOutlined />} onClick={add}></Button>
      </div>
    </div>
  );
};

export default LabelSelect;
