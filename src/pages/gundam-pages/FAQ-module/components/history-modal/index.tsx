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

  const pageChange = (page: any, size: any) => {
    // console.log(page, size);
    setCurrent(page);
    setPageSize(size);
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
      bodyStyle={{ maxHeight: '600px' }}
      title={'历史申请记录--还会自动提额吗'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['FAQ-page']}>
        <div className={style['box']}>
          <div id="scrollContent" className={style['content-list']}>
            <ProList
              // itemLayout="vertical"
              loading={loading}
              actionRef={listRef}
              dataSource={faqList}
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
                      <div key={index}>
                        <div className={style['list-item']}>
                          {/* 答案 */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                            }}
                          >
                            {/* 答案列表 */}
                            {item.answerList.map((v: any, idx: any) => {
                              if (!v.answerId) {
                                return; // 一个答案都没有的时候才会没有answerId
                              }
                              return (
                                <div className={style['box-answer']}>
                                  <div
                                    className={style['box-content']}
                                    dangerouslySetInnerHTML={{ __html: v.answer }}
                                  ></div>
                                  <div className={style['box-footer']}>
                                    <div>
                                      <span>
                                        生效渠道：
                                        <Button type="link" onClick={() => {}}>
                                          {v?.channelList &&
                                            v?.channelList
                                              ?.map((cl: any) => {
                                                return HIGH_CONFIG_SELECT?.[0]?.children?.find(
                                                  (c: any) => c.name == cl,
                                                )?.label;
                                              })
                                              ?.join(' , ')}
                                          {/* {!v?.channelList && '全部'} */}
                                        </Button>
                                      </span>
                                    </div>
                                    <div>日期:123-123-123</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span>操作经办：张珊</span>
                            <span style={{ marginLeft: '16px' }}>操作类型：修改答案</span>
                            <span style={{ marginLeft: '16px' }}>操作时间：111-111-111</span>
                          </div>
                          <div
                            style={{
                              margin: '16px 0',
                              border: '1px solid #000',
                              padding: '0 6px ',
                            }}
                          >
                            原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因
                          </div>
                        </div>
                        <div>
                          <div>
                            <span>审批经办：张珊</span>
                            <span style={{ marginLeft: '16px' }}>审批结果：修改答案</span>
                            <span style={{ marginLeft: '16px' }}>审批时间：111-111-111</span>
                          </div>
                          <div
                            style={{
                              margin: '16px 0',
                              border: '1px solid #000',
                              padding: '0 6px ',
                            }}
                          >
                            原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因
                          </div>
                        </div>
                      </div>
                    );
                  },
                },
              }}
              // pagination={{
              //   pageSize: 10,
              //   // position: ['bottomRight'],
              // }}
              rowKey={'id'}
              key={'id'}
            />
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
              total={total || 0}
              current={current}
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
              defaultPageSize={10}
              defaultCurrent={1}
              onChange={pageChange}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectorModal;
