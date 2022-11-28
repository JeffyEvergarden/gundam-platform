import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { Button, Input, message, Select } from 'antd';
import { useRef, useState } from 'react';
import GlobalVarModal from '../../drawer/components/global-var-modal';
import Preview from './preview';
import styles from './style.less';
import WordSlotModal from './wordslot-select-modal';

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
    required = false,
    sound,
    ...res
  } = props;

  const modalRef = useRef<any>(null);

  const modalRef2 = useRef<any>(null);

  const [startPos, setStartPos] = useState<number>(-1);

  const openGlobalVarModal = () => {
    (modalRef.current as any).open();
  };

  const openWordSlotModal = () => {
    console.log('打开词槽模胎框');
    (modalRef2.current as any).open();
  };

  const changeVal = (e: any) => {
    onChange(e.target.value);
  };

  const confirm = (val: any, type: any = '变量') => {
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
  };

  const blurEvent = (e: any) => {
    let num = e.target.selectionStart;
    setStartPos(isNaN(num) ? -1 : num);
  };

  return (
    <div className={''}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className={styles['zy-row']}>
          <div>
            <Condition r-if={required}>
              <span style={{ color: 'red' }}>*</span>{' '}
            </Condition>
            {title}
          </div>
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
          <Tip
            title={
              '添加变量/添加词槽：点击可以在澄清话术中插入变量或词槽的占位符，实际播报时，会将变量或词槽的值进行填充。'
            }
          />
        </div>
        <div id={styles['soundType']}>
          {sound && sound()}
          <Preview text={value}></Preview>
        </div>
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
