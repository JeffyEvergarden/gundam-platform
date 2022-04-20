import { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, Tag, message } from 'antd';
import { PlusOutlined, DiffOutlined } from '@ant-design/icons';
import GlobalVarModal from '../../drawer/components/global-var-modal';
import WordSlotModal from './wordslot-select-modal';
import styles from './style.less';
import Condition from '@/components/Condition';
import Preview from './preview';
import { useModel } from 'umi';

const { Option } = Select;
const { TextArea } = Input;

const CvsInput: React.FC<any> = (props: any) => {
  const {
    value,
    type = 'input',
    onChange,
    style,
    maxlength = 200,
    title,
    rows,
    canEdit,
    ...res
  } = props;

  const modalRef = useRef<any>(null);

  const modalRef2 = useRef<any>(null);

  const [startPos, setStartPos] = useState<number>(-1);
  const [content, setContent] = useState<string>('');

  const openGlobalVarModal = () => {
    (modalRef.current as any).open();
  };

  const openWordSlotModal = () => {
    console.log('打开词槽模胎框');
    (modalRef2.current as any).open();
  };

  const changeVal = (e: any) => {
    onChange(e.target.value);
    setContent(e.target.value);
  };

  const confirm = (val: any, type: any = '变量') => {
    // console.log(val);
    let target = '';
    let tmp: any = value || '';
    val.forEach((item: any) => {
      if (type === '变量') {
        target += item?.name ? `\$\{${item.name}\}` : '';
      } else if (type === '词槽') {
        target += item?.name ? `#\{${item.name}\}` : '';
      }
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
    setContent(tmp);
  };

  const confirm2 = (val: any) => {
    console.log(val);
  };

  const blurEvent = (e: any) => {
    let num = e.target.selectionStart;
    setStartPos(isNaN(num) ? -1 : num);
  };

  useEffect(() => {
    setContent(value);
  }, []);

  return (
    <div className={''}>
      <div className={styles['zy-row']}>
        <div>{title}</div>
        <Button
          type="link"
          disabled={canEdit}
          onClick={() => {
            openGlobalVarModal();
          }}
        >
          {'{$}'}添加变量{canEdit}
        </Button>
        <Button
          type="link"
          disabled={canEdit}
          onClick={() => {
            openWordSlotModal();
          }}
        >
          {'{#}'}添加词槽
        </Button>
        <Preview text={content}></Preview>
      </div>
      <Condition r-if={type === 'input'}>
        <Input
          maxLength={maxlength}
          value={value}
          onChange={changeVal}
          onBlur={blurEvent}
          placeholder={props.placeholder}
          style={style}
          disabled={canEdit}
          {...res}
        />
      </Condition>

      <Condition r-if={type === 'textarea'}>
        <TextArea
          maxLength={maxlength}
          value={value}
          onChange={changeVal}
          onBlur={blurEvent}
          rows={rows || 4}
          placeholder={props.placeholder}
          style={style}
          disabled={canEdit}
          {...res}
        />
      </Condition>

      <GlobalVarModal
        cref={modalRef}
        onConfirm={(val: any) => {
          confirm(val, '变量');
        }}
      ></GlobalVarModal>

      <WordSlotModal
        cref={modalRef2}
        onConfirm={(val: any) => {
          confirm(val, '词槽');
        }}
      ></WordSlotModal>
    </div>
  );
};

export default CvsInput;
