import { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Tag, message } from 'antd';
import { PlusOutlined, DiffOutlined } from '@ant-design/icons';
import GlobalVarModal from '../../drawer/components/global-var-modal';
import styles from './style.less';
import Condition from '@/components/Condition';
import { useModel } from 'umi';

const { Option } = Select;
const { TextArea } = Input;

const GlobalVarButton: React.FC<any> = (props: any) => {
  const { value, type = 'input', onChange, style, maxlength = 200, ...res } = props;

  const modalRef = useRef<any>(null);

  const [startPos, setStartPos] = useState<number>(-1);

  const openGlobalVarModal = () => {
    (modalRef.current as any).open();
  };

  const openWordSlotModal = () => {
    console.log('打开词槽模胎框');
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
    <div className={styles['zy-row_top']}>
      <Condition r-if={type === 'input'}>
        <Input
          maxLength={maxlength}
          value={value}
          onChange={changeVal}
          onBlur={blurEvent}
          placeholder={props.placeholder}
          style={style}
          {...res}
        />
      </Condition>

      <Condition r-if={type === 'textarea'}>
        <TextArea
          maxLength={maxlength}
          value={value}
          onChange={changeVal}
          onBlur={blurEvent}
          rows={4}
          placeholder={props.placeholder}
          style={style}
          {...res}
        />
      </Condition>

      <div>
        <Button type="link" icon={<DiffOutlined />} onClick={openGlobalVarModal}>
          添加变量
        </Button>
        <br />
        <Button type="link" icon={<DiffOutlined />} onClick={openGlobalVarModal}>
          添加词槽
        </Button>
      </div>
      <GlobalVarModal cref={modalRef} onConfirm={confirm}></GlobalVarModal>
    </div>
  );
};

export default GlobalVarButton;
