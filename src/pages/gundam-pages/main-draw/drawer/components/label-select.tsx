import Tip from '@/components/Tip';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Tag } from 'antd';
import { useRef, useState } from 'react';
import LabelSelectModal from './label-select-modal';
import styles from './style.less';

const { Option } = Select;

const LabelSelect: React.FC<any> = (props: any) => {
  const { value, onChange, color, style, canEdit } = props;

  const [num, setNum] = useState<number>(1);

  const modelRef = useRef<any>(null);

  const onConfirm = (val: any) => {
    onChange(val);
  };

  const openModal = () => {
    let vals: any = value || [];
    (modelRef.current as any).open(vals);
  };

  const deleteCurrentTag = (index: number) => {
    let temp: any[] = value || [];
    temp.splice(index, 1);
    onChange([...temp]);
  };

  // useEffect(() => {
  //   console.log('value:', value);
  // }, [value]);

  return (
    <div className={styles['zy-row']} style={style}>
      <div className={styles['left']}>
        {(!value || (value && value.length === 0)) && '--'}
        {value &&
          value?.map?.((item: any, index: number) => {
            return (
              <Tag
                color={color}
                key={index}
                closable={!canEdit}
                onClose={() => {
                  deleteCurrentTag(index);
                }}
              >
                {item}
              </Tag>
            );
          })}
      </div>
      <div className={styles['right']}>
        <Button type="link" icon={<PlusOutlined />} onClick={openModal} disabled={canEdit}></Button>
        <Tip title={'提前在“话术标签管理”中定义标签，当机器人返回话术时将连同标签一同返回。'} />
      </div>
      <LabelSelectModal cref={modelRef} confirm={onConfirm} />
    </div>
  );
};

export default LabelSelect;
