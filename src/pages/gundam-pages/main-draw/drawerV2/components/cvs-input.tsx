import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import EditBoard from '@/pages/gundam-pages/FAQ/question-board';
import { Button, Input, message, Select } from 'antd';
import { useRef, useState } from 'react';
import { useModel } from 'umi';
import GlobalVarModal from '../../drawer/components/global-var-modal';
import BreakModal from './breakModal';
import Preview from './preview';
import styles from './style.less';
import WordSlotModal from './wordslot-select-modal';

const { Option } = Select;
const { TextArea } = Input;

const CvsInput: React.FC<any> = (props: any) => {
  const {
    value,
    onBlur,
    type = 'input',
    onChange,
    style,
    maxlength = 1000,
    title,
    rows,
    canEdit,
    required = false,
    sound,
    showBreak,
    ...res
  } = props;

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const modalRef = useRef<any>(null);

  const modalRef2 = useRef<any>(null);
  const modalRef3 = useRef<any>(null);
  const editorRef = useRef<any>(null);

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

  const confirm = (val: any, intype: any = '变量') => {
    let target = '';
    let tmp: any = value || '';

    if (intype == '间隔') {
      target = `<break time="${val}ms" />`;
    } else {
      val.forEach((item: any) => {
        if (intype === '变量') {
          target += item?.name ? `\$\{${item.name}\}` : '';
        } else if (intype === '词槽') {
          target += item?.name ? `#\{${item.name}\}` : '';
        }
      });
    }

    if (startPos > -1 || type === 'EditBoard') {
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
    if (startPos != -1) {
      setStartPos(startPos + target?.length);
    }
    if (type === 'EditBoard') {
      if (tmp.length <= maxlength) {
        editorRef?.current?.insertInEditor(target);
      }
    } else {
      onChange(tmp);
    }
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
          <Condition r-if={config.robotTypeMap[info?.robotType] === '语音' && showBreak}>
            <Button
              type="link"
              disabled={canEdit}
              onClick={() => {
                (modalRef3.current as any).open();
              }}
            >
              插入停顿
            </Button>
          </Condition>

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

      <Condition r-if={type === 'EditBoard'}>
        <div>
          <EditBoard cref={editorRef} value={value} onBlur={onBlur} onChange={onChange} />
        </div>
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

      <BreakModal
        cref={modalRef3}
        onConfirm={(val: any) => {
          confirm(val, '间隔');
        }}
      ></BreakModal>
    </div>
  );
};

export default CvsInput;
