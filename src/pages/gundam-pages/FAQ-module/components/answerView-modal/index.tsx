import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Modal, Input, message, Pagination, Button } from 'antd';
import { useModel } from 'umi';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { HIGH_CONFIG_SELECT } from '@/pages/gundam-pages/FAQ/FAQ-manage/const';
import { useFaqModal } from '@/pages/gundam-pages/FAQ/FAQ-manage/model';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;
  const [total, setTotal] = useState<any>(0);
  const [current, setCurrent] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);

  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const listRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: () => {
      // 显示
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
    // let selectTree = sessionStorage.getItem('selectTree');
    // console.log(obj);
    let params = {
      page: 1,
      pageSize: 10,
      robotId: info.id,
    };

    let res: any = await getFaqList(params);

    setTotal(res?.total || 0);
    return res;
  };

  useEffect(() => {
    CurrentPage();
  }, []);

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
      {faqList?.[0]?.answerList.map((item: any) => {
        return (
          <div className={style['box']}>
            <div>{item?.answer}</div> <div>生效渠道：xxx 生效时间：000</div>
          </div>
        );
      })}
    </Modal>
  );
};

export default SelectorModal;
