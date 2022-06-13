import { HIGH_CONFIG_SELECT } from '@/pages/gundam-pages/FAQ/FAQ-manage/const';
import { Divider, Drawer, Input } from 'antd';
import { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useAnswerListModel } from './model';
import style from './style.less';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;
  const [total, setTotal] = useState<any>(0);
  const [questionInfo, setQuestionInfo] = useState<any>();

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
      setQuestionInfo(row);
      CurrentPage({ faqId: row.faqId });
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
    <Drawer
      className={style['modal-bg']}
      width={'60%'}
      title={'查看现有答案'}
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <div className={style['title']}>{questionInfo?.question}</div>
      <div id="scrollContent" className={style['content-list']}>
        {list?.map((item: any, index: any) => {
          return (
            <div className={style['box']} key={index}>
              <div
                className={style['box-content']}
                dangerouslySetInnerHTML={{ __html: item.answer }}
              ></div>
              <div className={style['box-footer']}>
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
                {item.enableStartTime && item.enableEndTime && <Divider type="vertical"></Divider>}
                {item.enableStartTime && item.enableEndTime && (
                  <div>生效时间：{`${item.enableStartTime} ~ ${item.enableEndTime}`}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default SelectorModal;
