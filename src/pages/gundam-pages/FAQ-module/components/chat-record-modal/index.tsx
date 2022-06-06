import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Tabs, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import style from './style.less';
import Condition from '@/components/Condition';
import { useSessionModel } from '../detail-modal/model';

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
    <Modal
      className={style['modal-bg']}
      width={850}
      title={'查看聊天记录'}
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      okText={'确定'}
      onOk={submit}
      footer={
        <div className={style['my-row_center']}>
          <Button onClick={close}>关闭</Button>
        </div>
      }
    >
      <div className={style['my-row']}>
        <div>访客信息:</div>
        {/* <div>访客信息:</div> */}
      </div>
      <div className={style['record-bg']}>
        {recordList.map((item: any, index: number) => {
          let content: any = '';
          if (item.userName === 'left') {
            content = (
              <div className={style['my-row_start']}>
                <div className={style['avator']}></div>
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
                <div className={style['avator']}></div>
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
    </Modal>
  );
};

export default RecordModal;
