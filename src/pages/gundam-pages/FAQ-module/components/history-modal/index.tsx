import Condition from '@/components/Condition';
import { Divider, Drawer, Input, Pagination, Timeline } from 'antd';
import { useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import { approvalResult, approvalType } from '../awaitList/count';
import { useHistoryModel } from './model';
import style from './style.less';

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;
  const [total, setTotal] = useState<any>(0);
  const [current, setCurrent] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);
  const [questionInfo, setQuestionInfo] = useState<any>();

  const { list, getList, loading, totalPage } = useHistoryModel();

  const listRef = useRef<any>(null);

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
      CurrentPage({ faqId: row.faqId });
      setVisible(true);
    },
    close: onClose,
  }));

  const submit = () => {
    onClose();
  };

  const pageChange = (page: any, size: any) => {
    // console.log(page, size);
    setCurrent(page);
    setPageSize(size);
    CurrentPage({ page, pageSize: size });
  };

  //获取问题列表
  const CurrentPage = async (obj?: any) => {
    let params = {
      page: 1,
      pageSize: 10,
      robotId: info.id,
      faqId: questionInfo?.id,
      ...obj,
    };

    let res: any = await getList(params);

    setTotal(res?.total || 0);
    return res;
  };

  const onClose = () => {
    setCurrent(1);
    setPageSize(10);
    setVisible(false);
  };

  return (
    <Drawer
      className={style['modal-bg']}
      width={'60%'}
      title={'历史申请记录'}
      visible={visible}
      onClose={onClose}
      destroyOnClose={true}
    >
      <div className={style['FAQ-page']}>
        <div className={style['box']}>
          <div className={style['title']}>{questionInfo?.question}</div>
          <div id="scrollContent" className={style['content-list']}>
            {list.map((item: any, index: number) => {
              return (
                <Timeline key={index} mode={'left'} className={style['timeline']}>
                  <div className={style['header']}>{item?.historyList?.[0]?.createTime}</div>
                  {item.historyList.map((v: any, idx: any) => {
                    return [1, 2].map((t: any) => {
                      if (t == 1) {
                        //申请
                        return (
                          <Timeline.Item label={v.createTime} color="#1890FF" position="left">
                            <div>
                              <div style={{ paddingBottom: '16px' }}>
                                <span>{v.creator}</span>
                                <span style={{ marginLeft: '16px' }}>
                                  申请{approvalType[v.operationStatus]}
                                </span>
                              </div>
                            </div>
                            <div className={style['list-item']}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                }}
                              >
                                <div className={style['box-answer']}>
                                  <div
                                    className={style['box-content']}
                                    dangerouslySetInnerHTML={{ __html: v.answer }}
                                  ></div>
                                  <div className={style['box-footer']}>
                                    <div>
                                      <span style={{ display: 'flex' }}>
                                        生效渠道：
                                        <div>
                                          {v?.channelList &&
                                            v?.channelList
                                              ?.map((cl: any) => {
                                                return highChannelList?.find(
                                                  (c: any) => c.name == cl,
                                                )?.label;
                                              })
                                              ?.join(' , ')}
                                        </div>
                                      </span>
                                    </div>
                                    {item.enableStartTime && item.enableEndTime && (
                                      <Divider type="vertical"></Divider>
                                    )}
                                    {item.enableStartTime && item.enableEndTime && (
                                      <div>
                                        生效时间：{`${v.enableStartTime} ~ ${v.enableEndTime}`}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={style['reason']}>备注：{v.reason}</div>
                          </Timeline.Item>
                        );
                      } else {
                        //结果
                        return (
                          <Timeline.Item
                            label={v.updateTime}
                            color={
                              v.approvalStatus == 0
                                ? 'green'
                                : v.approvalStatus == 2
                                ? 'red'
                                : '#1890FF'
                            }
                          >
                            <div>
                              <div>
                                <span>{v.updateBy}</span>
                                <span style={{ marginLeft: '16px' }}>
                                  {approvalResult[v.approvalStatus]}申请
                                </span>
                              </div>
                              <Condition r-if={v.approvalStatus == 2}>
                                <div className={style['reason']}>备注：{v.approvalReason}</div>
                              </Condition>
                            </div>
                          </Timeline.Item>
                        );
                      }
                    });
                  })}
                </Timeline>
              );
            })}
          </div>
          <div
            style={{
              position: 'relative',
              height: '60px',
            }}
          >
            <Pagination
              size="small"
              showSizeChanger
              className={style['Pagination']}
              total={totalPage || 0}
              current={current}
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
              defaultPageSize={10}
              defaultCurrent={1}
              onChange={pageChange}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default SelectorModal;
