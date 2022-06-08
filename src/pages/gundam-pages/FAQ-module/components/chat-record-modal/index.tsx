import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Drawer, Button, Table, Tooltip, Tabs, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import style from './style.less';
import Condition from '@/components/Condition';
import { useSessionModel } from '../detail-modal/model';

import robotAvator from './img/robot.png';

const { Search } = Input;

const RecordModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const { recordLoading, recordList, getSessionRecordList } = useSessionModel();

  const [visible, setVisible] = useState<boolean>(false);

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (obj.id) {
        getSessionRecordList({ id: obj.id });
        // 显示
        setVisible(true);
      } else {
        message.warning('获取不到当前会话记录');
      }
    },
    close,
  }));

  const submit = () => {
    setVisible(false);
  };

  return (
    <Drawer
      className={style['drawer']}
      width={850}
      title={'会话记录'}
      visible={visible}
      onClose={close}
      maskClosable={false}
    >
      {/* <div className={style['my-row']}>
        <div>访客信息:</div>
        <div>访客信息:</div> 
      </div> */}
      <div className={style['record-bg']}>
        {recordList.map((item: any, index: number) => {
          let content: any = '';
          if (item.userName === 'left') {
            content = (
              <div className={style['my-row_start']}>
                <img className={style['avator']} src={robotAvator} alt="机器人头像"></img>
                <div
                  className={style['content']}
                  dangerouslySetInnerHTML={{ __html: item.msg }}
                ></div>
              </div>
            );
          } else {
            content = (
              <div className={style['my-row_end']}>
                <div
                  className={style['content']}
                  dangerouslySetInnerHTML={{ __html: item.msg }}
                ></div>
                <img className={style['avator']} src={robotAvator} alt="机器人头像"></img>
              </div>
            );
          }

          return (
            <div key={index}>
              <div className={style['record-time']}>{item.recordTime}</div>

              <div className={style['record-box']}>{content}</div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default RecordModal;
