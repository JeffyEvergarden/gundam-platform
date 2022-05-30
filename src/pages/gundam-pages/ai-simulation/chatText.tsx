import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Input, Button, message, Space, Radio, Modal } from 'antd';
import styles from './style.less';
import { useModel } from 'umi';
import { useChatModel } from './model';
import robotPhoto from '@/asset/image/headMan.png';
import customerPhoto from '@/asset/image/headWoman.png';
const { TextArea } = Input;

export default (props: any) => {
  const {
    modalData,
    getEnvirmentValue,
    initRobotChat,
    resetTalking,
    talkingFlag,
    clearDialogFlag,
  } = props;
  const [dialogList, setDialogList] = useState<any>([]); // 对话内容
  const [textMessage, setTextMessage] = useState<string>(''); // 输入的信息，发送成功之后立马清空
  const [number, setNumber] = useState<number>(0); // 存储 发送按钮 点击的次数，监听变化
  const [environment, setEnvironment] = useState<string>('test'); // 设置环境值： 生产、测试 默认为测试
  // begin(开始),silence(客户沉默),dialogue(对话),end(结束)

  const [chatEvent, setChatEvent] = useState<string>('begin'); // 会话事件类型

  const [nluInfo, setNluInfo] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const { textRobotDialogueText, soundRobotDialogue } = useChatModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const boxRef: any = useRef<any>(null);

  // 保存输入的文字内容
  const inputChange = (e: any) => {
    setTextMessage(e.target.value);
    // 开始会话 触发成功后，设置事件
    if (talkingFlag) {
      setChatEvent('dialogue');
    }
  };

  const onKeyDown = (e: any) => {
    if ((e?.keyCode == '13' || e?.which == '13') && !e?.shiftKey) {
      sendMessage();
      // 禁止换行
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const detail = (nluInfo: string) => {
    let temp = JSON.parse(nluInfo);
    temp = JSON.stringify(temp, null, 2);
    setNluInfo(temp);
    setVisible(true);
  };

  // 机器人回复内容
  const robotResponse = async (data?: any) => {
    console.log('info', info);
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
      event: chatEvent, // 事件类型
      actionType: '',
    };
    let res: any;
    if (info.robotType === 0) {
      //文本机器人
      res = await textRobotDialogueText(params);
    }
    if (info.robotType === 1) {
      //语音机器人
      params.actionType = 'text';
      res = await soundRobotDialogue(params);
    }

    if (res?.resultCode == '100') {
      let newData = [...dialogList];
      newData.push({
        type: 'robot',
        askText: res?.data?.askText,
        message: res?.data?.actionMessage,
        recommendQuestion: res?.data?.recommendQuestion,
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
  const sendMessage = async () => {
    if (!talkingFlag) {
      message.warning('请点击‘开始对话’按钮启动对话');
      return;
    }
    if (textMessage?.length == 0 || textMessage.trim().length == 0) {
      message.warning('不能发送空白文字');
      return;
    }
    if (textMessage?.length > 200 || textMessage.trim().length > 200) {
      message.warning('最多发送200字');
      return;
    }
    let data = [...dialogList];
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    let params = {
      requestId: modalData.requestId,
      occurTime: occurDay + ' ' + newTime,
      systemCode: modalData.systemCode,
      sessionId: modalData.sessionId,
      message: textMessage,
      event: chatEvent, // 事件类型
      actionType: '',
    };
    let res: any;
    if (info.robotType === 0) {
      //文本机器人
      res = await textRobotDialogueText(params);
    }
    if (info.robotType === 1) {
      //语音机器人
      params.actionType = 'text';
      res = await soundRobotDialogue(params);
    }
    if (res?.resultCode == '100') {
      data.push(
        {
          type: 'customer',
          message: textMessage,
          askKey: res?.data?.askKey,
          nluInfo: res?.data?.nluInfo,
        },
        {
          type: 'robot',
          askText: res?.data?.askText,
          message: res?.data?.actionMessage,
          recommendQuestion: res?.data?.recommendQuestion,
        },
      );
      setTextMessage('');
      setChatEvent('dialogue');
    } else {
      data.push({
        type: 'customer',
        message: textMessage,
        askKey: res?.data?.askKey,
        nluInfo: res?.data?.nluInfo,
      });
      message.error(res?.resultDesc);
    }
    setDialogList(data);

    // let a = number;
    // a++;
    // setNumber(a);
  };

  const resetDialog = () => {
    setDialogList([]);
  };

  const clearDialog = () => {
    setDialogList([]);
  };

  // 环境值 判断是生产环境还是测试环境
  const radioChange = (e: any) => {
    setEnvironment(e?.target?.value);
    getEnvirmentValue(e?.target?.value);
    setChatEvent('begin'); // 更换环境、会话重新开始
    resetTalking(); // 环境切换后重置对话
    setDialogList([]); // 清空会话内容
  };

  const sendQuiet = async () => {
    if (!talkingFlag) {
      message.warning('请点击‘开始对话’按钮启动对话');
      return;
    }
    let data = [...dialogList];
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    let params = {
      requestId: modalData.requestId,
      occurTime: occurDay + ' ' + newTime,
      systemCode: modalData.systemCode,
      sessionId: modalData.sessionId,
      message: textMessage,
      event: 'silence', // 事件类型
      actionType: '',
    };
    let res: any;
    if (info.robotType === 0) {
      //文本机器人
      res = await textRobotDialogueText(params);
    }
    if (info.robotType === 1) {
      //语音机器人
      params.actionType = 'text';
      res = await soundRobotDialogue(params);
    }
    if (res?.resultCode == '100') {
      data.push(
        {
          type: 'customer',
          message: '静默',
          askKey: res?.data?.askKey,
          nluInfo: res?.data?.nluInfo,
        },
        {
          type: 'robot',
          askText: res?.data?.askText,
          message: res?.data?.actionMessage,
          recommendQuestion: res?.data?.recommendQuestion,
        },
      );
    } else {
      data.push({
        type: 'customer',
        message: '静默',
        askKey: res?.data?.askKey,
        nluInfo: res?.data?.nluInfo,
      });
      message.error(res?.resultDesc);
    }
    setDialogList(data);
    // setChatEvent('silence');
    // let a = number;
    // a++;
    // setNumber(a);
  };

  //  只负责清空
  useEffect(() => {
    setDialogList([]); // 清空会话内容
    setChatEvent('begin'); // 更换环境、会话重新开始
    let a = number;
    a++;
    setNumber(a);
  }, [clearDialogFlag]);

  useEffect(() => {
    number > 1 && robotResponse();
  }, [number]);

  // 初始化，先执行上一个接口
  // useEffect(() => {
  //   initRobotChat && robotResponse();
  // }, [initRobotChat]);

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
          {/* <Button type="primary" size={'small'} onClick={resetDialog}>
            重置对话
          </Button> */}
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
                      <div className={styles['wordsbox']}>
                        <div className={styles['words']}>{item.message}</div>
                        <div className={styles['words-type']}>
                          <Space>
                            <span>{item.askKey}</span>
                            <a onClick={() => detail(item?.nluInfo)}>详情</a>
                          </Space>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.type == 'robot' && (
                    <Fragment>
                      {item.askText && (
                        <div className={styles['robot-part']}>
                          <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                          <div>
                            <div
                              className={styles['askText']}
                              dangerouslySetInnerHTML={{ __html: item?.askText }}
                            />
                          </div>
                        </div>
                      )}
                      {item.message && (
                        <div className={styles['robot-part']}>
                          <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                          <div>
                            <div className={styles['words']}>{item?.message}</div>
                          </div>
                        </div>
                      )}
                      {item.recommendQuestion && item.recommendQuestion.length > 0 && (
                        <div className={styles['robot-part']}>
                          <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                          <div>
                            <div className={styles['words']}>
                              {item.recommendQuestion.map((el: any) => {
                                return (
                                  <Fragment key={el.number}>
                                    {item.message === '' && <div>您是否还想咨询一下问题：</div>}
                                    <div>{el.number + ':' + el.askText}</div>
                                  </Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </Fragment>
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
              maxLength={200}
              placeholder={'请输入文本，按回车键发送'}
              // showCount
            />

            <Button className={styles['send-btn']} type="primary" onClick={() => sendMessage()}>
              发送
            </Button>
            {info.robotType === 1 && (
              <Button
                className={styles['send-btn-quiet']}
                type="primary"
                onClick={() => sendQuiet()}
              >
                发送静默
              </Button>
            )}
          </div>
        </div>
      )}
      <Modal
        title={'详情'}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        bodyStyle={{ maxHeight: 400, overflowY: 'auto' }}
      >
        <pre> {nluInfo}</pre>
      </Modal>
    </div>
  );
};
