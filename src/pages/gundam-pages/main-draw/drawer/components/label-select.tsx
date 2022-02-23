import { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './style.less';
import LabelSelectModal from './label-select-modal';

const { Option } = Select;

const LabelSelect: React.FC<any> = (props: any) => {
  const { value, onChange, color, style } = props;

  const [num, setNum] = useState<number>(1);

  const modelRef = useRef<any>(null);

  const onConfirm = (val: any) => {
    onChange(val);
  };

  const openModal = () => {
    let vals: any = value || [];
    (modelRef.current as any).open(
      vals.map((item: any) => {
        return item.id;
      }),
    );
  };

  const deleteCurrentTag = (index: number) => {
    let temp: any[] = value || [];
    temp.splice(index, 1);
    onChange(temp);
  };

  // useEffect(() => {
  //   console.log('value:', value);
  // }, [value]);

  return (
    <div className={styles['zy-row']} style={style}>
      <div className={styles['left']}>
        {!value && '--'}
        {value &&
          value?.map?.((item: any, index: number) => {
            return (
              <Tag
                color={color}
                key={index}
                closable
                onClose={() => {
                  deleteCurrentTag(index);
                }}
              >
                {item.actionLabel}
              </Tag>
            );
          })}
      </div>
      <div className={styles['right']}>
        <Button type="link" icon={<PlusOutlined />} onClick={openModal}></Button>
      </div>
      <LabelSelectModal cref={modelRef} confirm={onConfirm} />
    </div>
  );
};

export default LabelSelect;
