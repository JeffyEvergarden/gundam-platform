import Condition from '@/components/Condition';
import config from '@/config';
import ProList from '@ant-design/pro-list';
import { Divider, Drawer, Input } from 'antd';
import { Fragment, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import { useAnswerListModel } from './model';
import style from './style.less';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm, pageType } = props;
  const [total, setTotal] = useState<any>(0);
  const [questionInfo, setQuestionInfo] = useState<any>();

  const { list, getList, loading } = useAnswerListModel();

  const listRef = useRef<any>({});

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  const { highChannelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    highChannelList: model.highChannelList,
    getChannelList: model.getChannelList,
  }));

  useEffect(() => {
    getChannelList(info.id);
  }, []);

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      // 显示
      setQuestionInfo(row);
      CurrentPage({ faqId: row.faqId ? row.faqId : row.recommendId });
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
      <div className={style['title']}>
        {pageType === 'standardQuestionLearn'
          ? questionInfo?.recommendName
          : questionInfo?.question}
      </div>
      <div id="scrollContent" className={style['content-list']}>
        <ProList
          // itemLayout="vertical"
          loading={loading}
          actionRef={listRef}
          dataSource={list}
          request={async (params = {}, sort, filter) => {
            // console.log(params);
            return {};
            // return CurrentPage({ page: current, pageSize, robotId: info.id });
          }}
          tableAlertRender={false}
          metas={{
            title: {
              render: (title: any, item: any, index: number) => {
                return (
                  <div className={style['box']} key={index}>
                    <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
                      <div
                        className={style['box-content']}
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      ></div>
                    </Condition>
                    <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                      <div className={style['box-content']}>{item.answer}</div>
                    </Condition>
                    <div className={style['box-footer']}>
                      {pageType === 'standardQuestionLearn' && (
                        <Fragment>
                          <div>
                            <span className={style['label_sty']}>创建者：</span>
                            {item?.creator}
                          </div>
                          <Divider type="vertical" />
                        </Fragment>
                      )}
                      {pageType === 'standardQuestionLearn' && (
                        <Fragment>
                          <div>
                            <span className={style['label_sty']}>分类：</span>
                            {item?.faqTypeName}
                          </div>
                          <Divider type="vertical" />
                        </Fragment>
                      )}
                      {pageType === 'standardQuestionLearn' && (
                        <Fragment>
                          <div>
                            <span className={style['label_sty']}>浏览次数：</span>
                            {item?.viewNum}
                          </div>
                          <Divider type="vertical" />
                        </Fragment>
                      )}
                      <div>
                        <span className={style['label_sty']}>生效渠道：</span>
                        {item?.channelList &&
                          item?.channelList
                            ?.map((cl: any) => {
                              return highChannelList?.find((c: any) => c.name == cl)?.label;
                            })
                            ?.join(' , ')}
                      </div>
                      <Divider type="vertical" />
                      <div>
                        <span className={style['label_sty']}>生效时间：</span>
                        {item.enable == 1
                          ? `${item.enableStartTime} ~ ${item.enableEndTime}`
                          : '未设置'}
                      </div>
                    </div>
                  </div>
                );
              },
            },
          }}
          rowKey={'id'}
          key={'id'}
        />
      </div>
    </Drawer>
  );
};

export default SelectorModal;
