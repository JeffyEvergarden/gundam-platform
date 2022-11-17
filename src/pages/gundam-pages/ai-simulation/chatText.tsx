import customerPhoto from '@/asset/image/customer.png';
import robotPhoto from '@/asset/image/robot.png';
import AudioPlay from '@/components/AudioPlay';
import Tip from '@/components/Tip';
import config from '@/config';
import { Button, Dropdown, Input, Menu, message, Modal, Popover, Radio, Space } from 'antd';
import React, { Fragment, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useChatModel } from './model';
import {
  textRobotRecommendDialogue,
  textRobotSearchEvent,
  textRobotSuggestClick,
} from './model/api';
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
    cref,
    modalData,
    formData,
    getEnvirmentValue,
    initRobotChat,
    resetTalking,
    talkingFlag, // 开启会话标志
    clearDialogFlag,
    envirValue, //环境
  } = props;
  const [dialogList, setDialogList] = useState<any>([]); // 对话内容
  const [textMessage, setTextMessage] = useState<string>(''); // 输入的信息，发送成功之后立马清空
  const [number, setNumber] = useState<number>(0); // 存储 发送按钮 点击的次数，监听变化
  const [environment, setEnvironment] = useState<string>('test'); // 设置环境值： 生产、测试 默认为测试
  // begin(开始),silence(客户沉默),dialogue(对话),end(结束)

  const [chatEvent, setChatEvent] = useState<string>('begin'); // 会话事件类型

  const [nluInfo, setNluInfo] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [chatVisible, setChatVisible] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const audioPlayRef = useRef<any>(null);

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
      // if (timeFn.current.inputVal === inputVal) {
      //   return;
      // }
      if (config.robotTypeMap[info?.robotType] === '语音') {
        return; //语音不要联想
      }

      console.log('调用');
      if (inputVal.length >= 20 || !inputVal.length) {
        setFocus(false);
        return;
      }
      // ----------------
      let res = await getAssociationTextList({
        query: inputVal,
        suggestNumber: 8,
        robotId: envirValue == 'prod' ? info.id : `test_${info.id}`,
        sessionId: modalData.sessionId,
        formData,
      });
      if (res) {
        setFocus(true);
        timeFn.current.inputVal = inputVal;
      }
    };
    return debounce(fn, 0.3);
  }, [modalData]);
  // 弹窗显示
  const PopoverVisible = useMemo(() => {
    // console.log(opLoading, chatEvent, associationList.length);
    if (
      chatEvent === 'dialogue' &&
      associationList.length > 0 &&
      focus &&
      chatVisible &&
      textMessage
    ) {
      // console.log('PopoverVisible 显示');
      return true;
    } else {
      return false;
    }
  }, [opLoading, chatEvent, associationList, focus, chatVisible]);

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
    if (chatEvent === 'dialogue') {
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

  const img = (text: any) => {
    let reg = /\$\{getResoureUrl\}/g;
    const reg1 = /^\<\w+\>/;
    const reg2 = /\<\/\w+\>$/;
    if (reg1.test(text) && reg2.test(text)) {
      return text.replace(reg, '/aichat/robot/file/getFile');
    }
    return text;
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
        askText: img(res?.data?.askText),
        message: res?.data?.actionMessage,
        recommendText: res?.data?.recommendText,
        recommendQuestion: res?.data?.recommendQuestion,
        isClear: res?.data?.aiTextHitType == 2 || res?.data?.aiTextHitType == 6 ? true : false,
        actionTextSplitList: res?.data?.actionTextSplitList,
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
  const sendMessage = async (text?: any, skipCheck?: any, reqData?: any) => {
    if (loading) {
      return;
    }
    if (!talkingFlag) {
      message.warning('请点击‘开始对话’按钮启动对话');
      return;
    }

    if (!skipCheck && (textMessage?.length == 0 || textMessage.trim().length == 0)) {
      message.warning('不能发送空白文字');
      return;
    }
    if (!skipCheck && (textMessage?.length > 200 || textMessage.trim().length > 200)) {
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
      systemCode: 'test',
      sessionId: modalData.sessionId,
      message: text || textMessage,
      event: chatEvent, // 事件类型
      actionType: '',
    };
    let res: any;

    if (info.robotType === 0) {
      //发送埋点
      if (skipCheck) {
        res = await textRobotRecommendDialogue(reqData);
      } else {
        textRobotSearchEvent(params);
        //文本机器人
        res = await textRobotDialogueText(params);
      }
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
          message: repEnter(text || textMessage),
          askKey: res?.data?.askKey,
          nluInfo: res?.data?.nluInfo,
        },
        {
          type: 'robot',
          askText: img(res?.data?.askText),
          message: res?.data?.actionMessage,
          recommendText: res?.data?.recommendText,
          recommendQuestion: res?.data?.recommendQuestion,
          isClear: res?.data?.aiTextHitType == 2 || res?.data?.aiTextHitType == 6 ? true : false,
          actionTextSplitList: res?.data?.actionTextSplitList,
        },
      );
      setTextMessage('');
      setFocus(false);
      setAssociationList([]);
      setChatEvent('dialogue');
    } else {
      data.push({
        type: 'customer',
        message: repEnter(text || textMessage),
        askKey: res?.data?.askKey,
        nluInfo: res?.data?.nluInfo,
      });
      message.error(res?.resultDesc);
    }
    setLoading(false);
    setDialogList(data);
  };

  //替换回车
  const repEnter = (text: any) => {
    return text.replace('/\\n/g', '<br/>');
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
          askText: img(res?.data?.askText),
          message: res?.data?.actionMessage,
          recommendText: res?.data?.recommendText,
          recommendQuestion: res?.data?.recommendQuestion,
          isClear: res?.data?.aiTextHitType == 2 || res?.data?.aiTextHitType == 6 ? true : false,
          actionTextSplitList: res?.data?.actionTextSplitList,
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
              //联想埋点
              let newDay = new Date().toLocaleDateString();
              let occurDay = newDay.replace(/\//g, '-');
              let newTime = new Date().toLocaleTimeString('en-GB');
              if (info.robotType === 0) {
                textRobotSuggestClick({
                  requestId: modalData?.requestId,
                  occurTime: occurDay + ' ' + newTime,
                  systemCode: 'test',
                  sessionId: modalData?.sessionId,
                  num: i + 1,
                  type: item?.type,
                  stdQueryId: item?.stdQueryId,
                  suggestQuery: item?.suggestQuery,
                  id: item?.id,
                });
              }

              sendMessage(item.label);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );

  const submit = (text: any) => {
    sendMessage(text);
  };

  //关闭语音播放
  const closeAudio = () => {
    audioPlayRef?.current?.close?.();
  };

  useImperativeHandle(cref, () => ({
    setChatVisible,
    close: () => {
      closeAudio();
    },
  }));

  useEffect(() => {
    if (toolTipRef.current) {
      toolTipRef.current.scrollTop = 0;
    }
  }, [associationList]);

  const handleMenuClick = async (item: any) => {
    if (item.key == '2') {
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
        message: '',
        event: chatEvent, // 事件类型
        actionType: 'text',
        buttonText: textMessage,
      };
      let res = await soundRobotDialogue(params);
      if (res?.resultCode == '100') {
        data.push(
          {
            type: 'customer',
            message: repEnter(textMessage),
            askKey: res?.data?.askKey,
            nluInfo: res?.data?.nluInfo,
          },
          {
            type: 'robot',
            askText: img(res?.data?.askText),
            message: res?.data?.actionMessage,
            recommendText: res?.data?.recommendText,
            recommendQuestion: res?.data?.recommendQuestion,
            isClear: res?.data?.aiTextHitType == 2 || res?.data?.aiTextHitType == 6 ? true : false,
            actionTextSplitList: res?.data?.actionTextSplitList,
          },
        );
        setTextMessage('');
        setFocus(false);
        setAssociationList([]);
        setChatEvent('dialogue');
      } else {
        data.push({
          type: 'customer',
          message: repEnter(textMessage),
          askKey: res?.data?.askKey,
          nluInfo: res?.data?.nluInfo,
        });
        message.error(res?.resultDesc);
      }
      setLoading(false);
      setDialogList(data);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={'2'}>发送按键</Menu.Item>
    </Menu>
  );

  // const test = async () => {
  //   let params = {
  //     robotId: info?.id,
  //     voiceList: [
  //       {
  //         type: '1',
  //         text: '你好',
  //       },
  //       { type: '1', text: '您好', urlPath: '/xxx/xxx.wmb' },
  //     ],
  //   };
  //   let res = await testAction(params);
  //   debugger;
  // };
  return (
    <div>
      <div className={styles['chat-topTitle']}>
        <span className={styles['box-title']}>
          对话测试
          <Tip
            title={
              '用于模拟用户与机器人对话，测试机器人效果。可以使用生产或测试环境，对应主流程里的生产和发布环境。在生产发生的对话，可以在“报表管理-访客会话明细”中查询。对话前请确认修改的配置已发布成功。'
            }
          ></Tip>
        </span>
        <Space>
          <Radio.Group onChange={radioChange} value={environment}>
            <Radio value={'prod'}>生产</Radio>
            <Radio value={'test'}>测试</Radio>
          </Radio.Group>
          <Button onClick={clearDialog}>清空内容</Button>
        </Space>
      </div>
      <div className={styles['chat-environment']} />

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
                        <div
                          className={styles['words']}
                          style={{ whiteSpace: 'pre-wrap' }}
                          dangerouslySetInnerHTML={{ __html: item?.message }}
                        />
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
                      {item.askText && info?.robotType == 0 && (
                        <div className={styles['robot-part']}>
                          <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                          <div className={styles['wordsbox-robot']}>
                            <div
                              className={styles['askText']}
                              dangerouslySetInnerHTML={{ __html: item?.askText }}
                            />
                            {/* {info?.robotType == 1 && (
                              <div className={styles['words-type-audio']}>
                                <AudioPlay musicSrc={'/aichat/mp3/bluebird.mp3'} />
                              </div>
                            )} */}
                          </div>
                        </div>
                      )}
                      {item.message && !item.isClear && (
                        <div className={styles['robot-part']}>
                          <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                          <div className={styles['wordsbox-robot']}>
                            <div className={styles['words']}>{item?.message}</div>
                            {info?.robotType == 1 && (
                              <div className={styles['words-type-audio']}>
                                <AudioPlay
                                  size="small"
                                  musicSrc={
                                    process.env.mock
                                      ? '/aichat/mp3/bluebird.mp3'
                                      : `${
                                          config.basePath
                                        }/robot/sound/mergeSound?soundStr=${encodeURIComponent(
                                          JSON.stringify({
                                            robotId: info.id ?? '',
                                            voiceList: item?.actionTextSplitList ?? [],
                                          }),
                                        )}`
                                  }
                                  cref={audioPlayRef}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {info?.robotType == 0 &&
                        item.recommendQuestion &&
                        item.recommendQuestion.length > 0 && (
                          <div className={styles['robot-part']}>
                            <img className={styles['head-robot']} alt="robot" src={robotPhoto} />
                            <div className={styles['wordsbox-robot']}>
                              <div className={styles['words']}>
                                {/* {item.message === '' && ( */}
                                {!item.isClear && (
                                  <div style={{ fontWeight: 'bold' }}>{item?.recommendText}</div>
                                )}
                                {item.isClear && (
                                  <div style={{ fontWeight: 'bold' }}>{item?.message}</div>
                                )}
                                {/* )} */}
                                {item.recommendQuestion.map((el: any) => {
                                  return (
                                    <Fragment key={el.number}>
                                      <div
                                        style={{ color: '#1890ff', cursor: 'pointer' }}
                                        onClick={() => {
                                          setTextMessage(el.askText);
                                          timeFn.current.inputVal = el.askText;
                                          setAssociationList([]);
                                          let newDay = new Date().toLocaleDateString();
                                          let occurDay = newDay.replace(/\//g, '-');
                                          let newTime = new Date().toLocaleTimeString('en-GB');
                                          let params = {
                                            requestId: modalData?.requestId,
                                            occurTime: occurDay + ' ' + newTime,
                                            systemCode: 'test',
                                            sessionId: modalData?.sessionId,
                                            number: el.number,
                                            question: el.askText,
                                          };

                                          sendMessage(el.askText, true, params);
                                        }}
                                      >
                                        {el.number + ':' + el.askText}
                                      </div>
                                    </Fragment>
                                  );
                                })}
                              </div>
                              {/* {info?.robotType == 0 && (
                              <div className={styles['words-type-audio']}>
                                <AudioPlay musicSrc={'/aichat/mp3/bluebird.mp3'} />
                              </div>
                            )} */}
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
              <div className={styles['hide-box']} />
            </Popover>
            <TextArea
              value={textMessage}
              className={styles['text-area']}
              autoSize={{ minRows: 6, maxRows: 6 }}
              onPressEnter={onKeyDown}
              // handleKeyDown={()=>{}}
              // onKeyDown={onKeyDown}
              onChange={inputChange}
              maxLength={200}
              placeholder={'请输入文本，按回车键发送'}
              // showCount
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                // setTimeout(() => {
                // setFocus(false);
                // setAssociationList([]);
                // }, 300);
              }}
            />
            {info?.robotType == 1 && (
              <Fragment>
                <Dropdown.Button
                  overlay={menu}
                  placement="topRight"
                  key="Dropdown"
                  className={styles['send-btn-dropdown']}
                  onClick={() => sendMessage()}
                >
                  发送
                </Dropdown.Button>
                {/* <Button onClick={test}>测试语音</Button> */}
              </Fragment>
            )}

            {info?.robotType == 0 && (
              <Button className={styles['send-btn']} type="primary" onClick={() => sendMessage()}>
                发送
              </Button>
            )}
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
