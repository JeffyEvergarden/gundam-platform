import { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GlobalVarModal from './global-var-modal';
import styles from './style.less';
import { useModel } from '@/.umi/plugin-model/useModel';

const { Option } = Select;

const GlobalVarButton: React.FC<any> = (props: any) => {
  const { value, onChange, style, maxlength = 1000, ...res } = props;

  const modalRef = useRef<any>(null);

  const [startPos, setStartPos] = useState<number>(-1);

  const openModal = () => {
    (modalRef.current as any).open();
  };

  const changeVal = (e: any) => {
    onChange(e.target.value);
  };

  const confirm = (val: any) => {
    console.log(val);
    let target = '';
    let tmp: any = value || '';
    val.forEach((item: any) => {
      target += item?.name ? `\$\{${item.name}\}` : '';
    });
    if (startPos > -1) {
      let pre = tmp.slice(0, startPos);
      let last = tmp.slice(startPos);
      tmp = pre + target + last;
      if (tmp.length > maxlength) {
        message.warning(`字符不能超过${maxlength}个字`);
        tmp = value;
      }
    } else {
      tmp = tmp + target;
    }
    onChange(tmp);
  };

  const blurEvent = (e: any) => {
    let num = e.target.selectionStart;
    setStartPos(isNaN(num) ? -1 : num);
  };

  return (
    <div className={styles['zy-row']}>
      <Input
        maxLength={maxlength}
        value={value}
        onChange={changeVal}
        onBlur={blurEvent}
        placeholder={props.placeholder}
        style={style}
        {...res}
      />

      <Button type="link" icon={<PlusOutlined />} onClick={openModal}>
        选择变量
      </Button>

      <GlobalVarModal cref={modalRef} onConfirm={confirm}></GlobalVarModal>
    </div>
  );
};

export default GlobalVarButton;
