import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Modal, Button, Table, Tooltip, Tabs, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import style from './style.less';
import Condition from '@/components/Condition';
import ChatRecordModal from '../chat-record-modal';
import { useSessionModel } from './model';
import { formatChannel } from '../../model/util';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const chatRecordModalRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const { tableLoading, tableList, getTableList } = useSessionModel();

  const [visible, setVisible] = useState<boolean>(false);

  const sessionTableList: any[] = useMemo(() => {
    return tableList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [tableList]);

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (obj.id) {
        getTableList({
          id: obj.id,
          robotId: info.id,
        });
        // 显示
        setVisible(true);
      } else {
        message.warning('获取不到当前明细');
      }
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    setVisible(false);
  };

  const columns: any[] = [
    // 业务流程列表-列
    {
      title: '会话ID',
      dataIndex: 'id',
      ellipsis: {
        showTitle: false,
      },
      render: (val: any, row: any) => {
        return (
          <a
            onClick={() => {
              chatRecordModalRef.current?.open?.(row);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      ellipsis: {
        showTitle: false,
      },
      render: (val: any) => {
        return formatChannel(val);
      },
    },
    {
      title: '对话轮次',
      dataIndex: 'recordNum',
    },
    {
      title: '访问时间',
      dataIndex: 'recordTime',
    },
  ];

  return (
    <Modal
      className={style['modal-bg']}
      width={850}
      title={'查看明细'}
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['page_content']}>
        <div className={style['zy-row_end']}></div>

        <div className={style['table-box']}>
          <Table
            loading={tableLoading}
            size="small"
            pagination={false}
            dataSource={sessionTableList}
            columns={columns}
            rowKey="index"
          />
        </div>
      </div>

      <ChatRecordModal cref={chatRecordModalRef} />
    </Modal>
  );
};

export default SelectorModal;
