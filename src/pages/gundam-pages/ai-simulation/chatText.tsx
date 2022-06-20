import robotPhoto from '@/asset/image/headMan.png';
import customerPhoto from '@/asset/image/headWoman.png';
import { Button, Input, message, Modal, Popover, Radio, Space } from 'antd';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useChatModel } from './model';
import styles from './style.less';
const { TextArea } = Input;

const debounce = (fn: (...arr: any[]) => void, second: number) => {
  let timer: any = null;
  // let content = this;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    // let flag = !timer;

    timer = setTimeout(() => {
      timer = null;
      fn.apply(fn, args);
    }, second * 1000);

    // if (flag) {
    //   fn.apply(fn, args);
    // }
  };
};

export default (props: any) => {
  const {
    modalData,
    getEnvirmentValue,
    initRobotChat,
    resetTalking,
    talkingFlag, // 开启会话标志
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

  const [loading, setLoading] = useState<boolean>(false);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const {
    textRobotDialogueText,
    soundRobotDialogue,
    associationList, // 搜索联想
    opLoading, // 查询loading
    setAssociationList,
    getAssociationTextList,
  } = useChatModel();

  const timeFn: any = useRef<any>({ time: 0, inputVal: '' });
  const [focus, setFocus] = useState<boolean>(false);
  // 防抖获取联想内容
  const getAssociation = useMemo(() => {
    const fn: any = async (inputVal: any) => {
      // 和上次结果一样
      if (timeFn.current.inputVal === inputVal) {
        return;
      }
      if (inputVal.length >= 20) {
        return;
      }
      // ----------------
      let res = await getAssociationTextList({
        query: inputVal,
        suggestNumber: 8,
        robotId: info.id,
        sessionId: modalData.sessionId,
      });
      if (res) {
        timeFn.current.inputVal = inputVal;
      }
    };
    return debounce(fn, 0.8);
  }, []);
  // 弹窗显示
  const PopoverVisible = useMemo(() => {
    // console.log(opLoading, chatEvent, associationList.length);
    if (chatEvent === 'dialogue' && associationList.length > 0 && focus) {
      // console.log('PopoverVisible 显示');
      return true;
    } else {
      return false;
    }
  }, [opLoading, chatEvent, associationList, focus]);

  const boxRef: any = useRef<any>(null);

  // 保存输入的文字内容
  const inputChange = (e: any) => {
    let val = e.target.value;
    setTextMessage(e.target.value);
    // 开始会话 触发成功后，设置事件
    if (talkingFlag) {
      setChatEvent('dialogue');
    }
    // 触发级联搜索
    if (!opLoading && chatEvent === 'dialogue') {
      getAssociation(val);
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
  const sendMessage = async (text?: any) => {
    if (loading) {
      return;
    }
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
    setLoading(true);
    let data = [...dialogList];
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    let params = {
      requestId: modalData.requestId,
      occurTime: occurDay + ' ' + newTime,
      systemCode: modalData.systemCode,
      sessionId: modalData.sessionId,
      message: text || textMessage,
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
          message: text || textMessage,
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
        message: text || textMessage,
        askKey: res?.data?.askKey,
        nluInfo: res?.data?.nluInfo,
      });
      message.error(res?.resultDesc);
    }
    setLoading(false);
    setDialogList(data);

    // let a = number;
    // a++;
    // setNumber(a);
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
    if (loading) {
      return;
    }
    if (!talkingFlag) {
      message.warning('请点击‘开始对话’按钮启动对话');
      return;
    }
    setLoading(true);
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
    setLoading(false);
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

  useEffect(() => {
    (boxRef.current as any).scrollTop = (boxRef.current as any).scrollHeight;
  }, [dialogList]);

  const toolTipRef = useRef<any>({});

  const toolTipsContent = (
    <div className={styles['question-box']} ref={toolTipRef}>
      {associationList.map((item: any, i: number) => {
        return (
          <div
            className={styles['qustion-label']}
            key={i}
            onClick={() => {
              setTextMessage(item.label);
              timeFn.current.inputVal = item.label;
              setAssociationList([]);
              sendMessage(item.label);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );

  useEffect(() => {
    if (toolTipRef.current) {
      toolTipRef.current.scrollTop = 0;
    }
  }, [associationList]);

  return (
    <div>
      <div className={styles['chat-topTitle']}>
        <span className={styles['box-title']}>对话测试</span>
        <Space>
          <Button size={'small'} onClick={clearDialog}>
            清空内容
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
                              {item.message === '' && (
                                <div style={{ fontWeight: 'bold' }}>您是否还想咨询以下问题：</div>
                              )}
                              {item.recommendQuestion.map((el: any) => {
                                return (
                                  <Fragment key={el.number}>
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
            <Popover visible={PopoverVisible} content={toolTipsContent} placement="topLeft">
              <div className={styles['hide-box']}></div>
            </Popover>

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
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setFocus(false);
                  setAssociationList([]);
                }, 300);
              }}
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
        bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
      >
        <pre> {nluInfo}</pre>
      </Modal>
    </div>
  );
};
