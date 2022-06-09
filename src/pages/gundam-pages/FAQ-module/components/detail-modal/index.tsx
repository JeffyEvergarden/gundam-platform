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

  const [clarifyId, setClarifyId] = useState<any>('');

  const { tableLoading, tableList, getTableList, tableTotal } = useSessionModel();

  const [visible, setVisible] = useState<boolean>(false);

  const sessionTableList: any[] = useMemo(() => {
    return tableList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [tableList]);

  const [current, setCurrent] = useState<number>(1);

  // 切换分页
  const onChange = (val: any) => {
    if (tableLoading) {
      return;
    }
    setCurrent(val);
    getTableList({
      id: clarifyId,
      clarifyId: clarifyId,
      robotId: info.id,
      page: val,
      pageSize: 10,
    });
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      if (obj.id) {
        setClarifyId(obj.id);
        setCurrent(1);
        getTableList({
          id: obj.id,
          clarifyId: obj.id,
          robotId: info.id,
          page: 1,
          pageSize: 10,
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
      dataIndex: 'sessionId',
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
      dataIndex: 'channelCode',
      ellipsis: {
        showTitle: false,
      },
      render: (val: any) => {
        return formatChannel(val);
      },
    },
    {
      title: '对话轮次',
      dataIndex: 'dialogueTurn',
    },
    {
      title: '访问时间',
      dataIndex: 'createTime',
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
      footer={
        <div className={style['zy-row_center']}>
          <Button onClick={submit}>关闭</Button>
        </div>
      }
    >
      <div className={style['page_content']}>
        <div className={style['zy-row_end']}></div>

        <div className={style['table-box']}>
          <Table
            loading={tableLoading}
            size="small"
            pagination={{ current, onChange, total: tableTotal }}
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
