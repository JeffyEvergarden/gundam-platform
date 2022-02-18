import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Tag, Image, Row, Col, message } from 'antd';
import styles from './style.less';
import { QqOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default (props: any) => {
  const { visible, modalData } = props;
  const [dialogList, setDialogList] = useState<any>([]); // 对话内容
  const [textMessage, setTextMessage] = useState<string>(''); // 输入的信息

  // 保存输入的文字内容
  const saveInputValue = (data: any) => {
    console.log('saveValue', data.target.value);
  };

  const inputChange = (data: any) => {
    setTextMessage(data.target.value);
  };

  // 发送按钮
  const sendMessage = () => {
    if (textMessage?.length == 0 || textMessage.trim().length == 0) {
      message.info('不能发送空白字符');
      return;
    }
    let data = [...dialogList];
    data.push({
      type: 'customer',
      message: textMessage,
    });
    setDialogList(data);
    robotResponse(data);
  };

  const robotResponse = (data: any) => {
    setTextMessage('');
    new Promise((resolve: any, reject: any) => {
      let newData = [...data];
      newData.push({
        type: 'robot',
        message: 'I am a robot',
      });
      setDialogList(newData);
      resolve();
    });
  };

  return (
    <React.Fragment>
      {visible && (
        <React.Fragment>
          <div className={styles['chat-dialog']}>
            {dialogList?.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {item.type == 'customer' && (
                    <div className={styles['customer-part']}>
                      {/* <Image width={30} height={30} src="@/asset/image/headWoman.png" /> */}
                      <QqOutlined className={styles['head-customer']} />
                      <span className={styles['words']}>{item.message}</span>
                    </div>
                  )}
                  {item.type == 'robot' && (
                    <div className={styles['robot-part']}>
                      <QqOutlined className={styles['head-robot']} />
                      <span className={styles['words']}>{item?.message}</span>

                      {/* <Image
                        className={styles['head-customer']}
                        src="@/asset/image/headMan.png"
                      /> */}
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
              onPressEnter={saveInputValue}
              onChange={inputChange}
            />
            <Button className={styles['send-btn']} onClick={sendMessage}>
              发送
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
