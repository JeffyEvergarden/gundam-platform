import AudioPlay from '@/components/AudioPlay';
import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { AudioFilled, UserOutlined } from '@ant-design/icons';
import { Drawer, Input, message } from 'antd';
import { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { useSessionModel } from '../detail-modal/model';
import clickIcon from './img/click.svg';
import robotAvator from './img/robot.png';
import style from './style.less';

const { Search } = Input;

const pageSize = 10;

const RecordModal: React.FC<any> = (props: any) => {
  const { cref, confirm, pageType } = props;

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const { recordLoading, recordList, recordTotal, getSessionRecordList, callId, systemCode } =
    useSessionModel();

  const [visible, setVisible] = useState<boolean>(false);
  const [heightLihgt, setHeightLihgt] = useState<any>({});

  const close = () => {
    setHeightLihgt({});
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      setHeightLihgt(obj);
      if (obj.id || obj.sessionId) {
        getSessionRecordList({
          sessionId: obj.sessionId || obj.id,
        });
        // 显示
        setVisible(true);
      } else {
        message.warning('获取不到当前会话记录');
      }
    },
    close,
  }));

  const hLihgt = (item: any) => {
    if (pageType == 'unknownQuestion') {
      if (heightLihgt.dialogueId) {
        if (heightLihgt?.dialogueId == item.id) {
          return 'red';
        }
      }
    } else {
      if (heightLihgt.id) {
        if (heightLihgt?.id == item.id) {
          return 'red';
        }
      } else {
        if (heightLihgt?.message == item.message) {
          return 'red';
        }
      }
    }
    return '';
  };

  return (
    <Drawer
      className={style['drawer']}
      width={850}
      title={
        <>
          {`会话记录（${heightLihgt?.sessionId || heightLihgt?.id}）${
            systemCode == 'test' ? '-机器人测试' : systemCode
          }`}
          <Tip
            title={
              '括号内表示会话记录id，括号后方为调用方系统id。会话记录中，表示此文本为按键输入，表示此文本为语音输入。'
            }
          />
        </>
      }
      visible={visible}
      onClose={close}
      destroyOnClose={true}
      // maskClosable={false}
      footer={
        pageType == 'visitorsSession' && info?.robotType == 1 && systemCode !== 'test' ? (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div style={{ width: '100px' }}>全程会话录音</div>
            <Condition r-if={callId}>
              <AudioPlay
                musicSrc={
                  process.env.mock
                    ? '/aichat/mp3/bluebird.mp3'
                    : `${config.basePath}/robot/sound/getRecord?callId=${callId}`
                }
              />
            </Condition>

            {/* <AudioPlay musicSrc={soundInfo} /> */}
          </div>
        ) : null
      }
    >
      <div id="scrollableDiv" className={style['record-bg']}>
        {recordList.map((item: any, index: number) => {
          let content: any = '';
          if (item.role === '客户') {
            content = (
              <div className={style['my-row_start']}>
                <div className={style['avator_column']}>
                  <div className={style['avator_customer']}>
                    <UserOutlined className={style['avator-icon']} />
                  </div>
                  {item.buttonText ? (
                    // <div className={style['content_type']}>1</div>
                    <img
                      src={clickIcon}
                      alt="按键"
                      className={style['content_type']}
                      style={{ padding: '9px' }}
                    />
                  ) : (
                    <AudioFilled className={style['content_type']} style={{ paddingTop: '9px' }} />
                  )}
                </div>

                <div className={style['content-box']}>
                  <div className={style['user-info']}>
                    <Condition r-if={item.userName}>
                      <div className={style['record-name']}>{item.userName}</div>
                    </Condition>
                    <div className={style['record-time']}>{item.recordTime}</div>
                  </div>
                  <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
                    <div
                      className={style['content']}
                      style={{ color: hLihgt(item) }}
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    ></div>
                  </Condition>
                  <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                    <div className={style['content']} style={{ color: hLihgt(item) }}>
                      {item.message}
                    </div>
                  </Condition>
                </div>
              </div>
            );
          } else {
            content = (
              <div className={style['my-row_end']}>
                <div className={style['content-box']}>
                  <div className={style['user-info']} style={{ justifyContent: 'flex-end' }}>
                    <div className={style['record-time']}>{item.recordTime}</div>
                  </div>
                  <div className={style['content']}>
                    <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
                      <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
                    </Condition>
                    <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                      <div>{item.message}</div>
                    </Condition>
                    <div>
                      {item?.recommendQuestion ? item?.recommendQuestion : item?.recommendText}
                    </div>
                    {item.labels.map((item: any, i: number) => {
                      return (
                        <div className={style['content-item']}>
                          {item.orderNumber}.{item.recommendText}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <img className={style['avator']} src={robotAvator} alt="机器人头像" />
              </div>
            );
          }

          return (
            <div key={index}>
              <div className={style['record-box']}>{content}</div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default RecordModal;
