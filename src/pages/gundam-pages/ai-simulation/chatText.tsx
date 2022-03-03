import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, message, Space, Radio } from 'antd';
import styles from './style.less';
import { useChatModel } from './model';
import robotPhoto from '@/asset/image/headMan.png';
import customerPhoto from '@/asset/image/headWoman.png';
const { TextArea } = Input;

export default (props: any) => {
  const { modalData } = props;
  const [dialogList, setDialogList] = useState<any>([]); // 对话内容
  const [textMessage, setTextMessage] = useState<string>(''); // 输入的信息，发送成功之后立马清空
  const [number, setNumber] = useState<number>(0); // 存储 发送按钮 点击的次数，监听变化
  const [environment, setEnvironment] = useState<string>('test'); // 设置环境值： 生产、测试 默认为测试
  const [eventType, setEventType] = useState<string>(''); //机器人事件响应类型

  const { getDialogData } = useChatModel();

  const boxRef: any = useRef<any>(null);

  // 保存输入的文字内容
  const inputChange = (e: any) => {
    setTextMessage(e.target.value);
  };

  const onKeyDown = (e: any) => {
    // console.log('keyDown', e?.keyCode, e?.which);
    if ((e?.keyCode == '13' || e?.which == '13') && !e?.shiftKey) {
      sendMessage();
      // 禁止换行
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 机器人回复内容
  const robotResponse = async (data?: any) => {
    console.log('textMessage', textMessage);
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    let params = {
      requestId: modalData.requestId,
      occurTime: occurDay + ' ' + newTime,
      systemCode: modalData.systemCode,
      sessionId: modalData.sessionId,
      message: textMessage,
      event: eventType,
      actionType: 'text',
    };
    const res: any = await getDialogData(params);
    if (res?.resultCode == '100') {
      let newData = [...dialogList];
      newData.push({
        type: 'robot',
        message: res?.resultDesc,
      });
      setTimeout(() => {
        setDialogList(newData);
        setTextMessage('');
      }, 1);
    } else {
      message.error(res?.resultDesc);
    }
  };

  // 发送按钮
  const sendMessage = () => {
    if (textMessage?.length == 0 || textMessage.trim().length == 0) {
      message.info('不能发送空白字符');
      return;
    }
    let a = number;
    a++;
    setNumber(a);
    let data = [...dialogList];
    data.push({
      type: 'customer',
      message: textMessage,
    });
    setDialogList(data);
  };

  const resetDialog = () => {};

  const clearDialog = () => {
    setDialogList([]);
  };

  // 环境值 判断是生产环境还是测试环境
  const radioChange = (e: any) => {
    setEnvironment(e?.target?.value);
  };

  useEffect(() => {
    number > 0 && robotResponse();
  }, [number]);

  useEffect(() => {
    (boxRef.current as any).scrollTop = (boxRef.current as any).scrollHeight;
  }, [dialogList]);

  return (
    <div>
      <div className={styles['chat-topTitle']}>
        <span className={styles['box-title']}>对话测试</span>
        <Space>
          <Button size={'small'} onClick={clearDialog}>
            清空内容
          </Button>
          <Button type="primary" size={'small'} onClick={resetDialog}>
            重置对话
          </Button>
        </Space>
      </div>
      <div className={styles['chat-environment']}>
        <Radio.Group onChange={radioChange} value={environment}>
          <Radio value={'prod'}>生产</Radio>
          <Radio value={'test'}>测试</Radio>
        </Radio.Group>
      </div>

      {true && (
        <div className={styles['chat-box']}>
          <div className={styles['chat-dialog']} ref={boxRef}>
            {dialogList?.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {item.type == 'customer' && (
                    <div className={styles['customer-part']}>
                      <img className={styles['head-customer']} alt="customer" src={customerPhoto} />
                      <div>
                        <div className={styles['words']}>{item.message}</div>
                        <div className={styles['words-type']}>肯定意图</div>
                      </div>
                    </div>
                  )}
                  {item.type == 'robot' && (
                    <div className={styles['robot-part']}>
                      <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                      <div>
                        <div className={styles['words']}>{item?.message}</div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className={styles['chat-footer']}>
            <TextArea
              value={textMessage}
              className={styles['text-area']}
              autoSize={{ minRows: 6, maxRows: 6 }}
              onPressEnter={inputChange}
              // handleKeyDown={()=>{}}
              onKeyDown={onKeyDown}
              onChange={inputChange}
              placeholder={'请输入文本，按回车键发送'}
              // showCount
            />

            <div className={styles['send-btn']} onClick={sendMessage}>
              发送
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
