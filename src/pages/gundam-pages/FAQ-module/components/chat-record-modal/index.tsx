import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Drawer, Button, Table, Tooltip, Spin, Input, message, Divider } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import style from './style.less';
import Condition from '@/components/Condition';
import { useSessionModel } from '../detail-modal/model';
import InfiniteScroll from 'react-infinite-scroll-component';

import robotAvator from './img/robot.png';
import userAvator from './img/user.png';

const { Search } = Input;

const pageSize = 10;

const RecordModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const { recordLoading, recordList, recordTotal, getSessionRecordList } = useSessionModel();

  const [visible, setVisible] = useState<boolean>(false);

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
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

  return (
    <Drawer
      className={style['drawer']}
      width={850}
      title={'会话记录'}
      visible={visible}
      onClose={close}
      destroyOnClose={true}
      maskClosable={false}
    >
      <div id="scrollableDiv" className={style['record-bg']}>
        {recordList.map((item: any, index: number) => {
          let content: any = '';
          if (item.role === '客户') {
            content = (
              <div className={style['my-row_start']}>
                <div className={style['avator_customer']}>
                  <UserOutlined className={style['avator-icon']} />
                </div>
                <div className={style['content-box']}>
                  <div className={style['user-info']}>
                    <Condition r-if={item.userName}>
                      <div className={style['record-name']}>{item.userName}</div>
                    </Condition>
                    <div className={style['record-time']}>{item.recordTime}</div>
                  </div>
                  <div
                    className={style['content']}
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  ></div>
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
                  <div
                    className={style['content']}
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  ></div>
                </div>
                <img className={style['avator']} src={robotAvator} alt="机器人头像"></img>
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
