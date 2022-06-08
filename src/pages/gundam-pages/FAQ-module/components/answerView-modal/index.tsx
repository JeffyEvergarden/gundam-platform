import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Modal, Input, message, Pagination, Button } from 'antd';
import { useModel } from 'umi';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { HIGH_CONFIG_SELECT } from '@/pages/gundam-pages/FAQ/FAQ-manage/const';
import { useAnswerListModel } from './model';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;
  const [total, setTotal] = useState<any>(0);
  const [current, setCurrent] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);

  const { list, getList, loading } = useAnswerListModel();

  const listRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      // 显示
      CurrentPage({ faqId: row.id });
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    setVisible(false);
  };

  //获取问题列表
  const CurrentPage = async (obj?: any) => {
    let params = {
      ...obj,
    };

    let res: any = await getList(params);

    setTotal(res?.total || 0);
    return res;
  };

  return (
    <Modal
      className={style['modal-bg']}
      width={850}
      bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
      title={'查看现有答案--还会自动提额吗'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      {list?.map((item: any) => {
        return (
          <div className={style['box']}>
            <div>{item?.answer}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                生效渠道：
                {item?.channelList &&
                  item?.channelList
                    ?.map((cl: any) => {
                      return HIGH_CONFIG_SELECT?.[0]?.children?.find((c: any) => c.name == cl)
                        ?.label;
                    })
                    ?.join(' , ')}
              </div>
              <div>生效时间：{`${item.enableStartTime}~${item.enableEndTime}`}</div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
};

export default SelectorModal;
