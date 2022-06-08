import { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { Modal, Input, message, Pagination, Button } from 'antd';
import { useModel } from 'umi';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { HIGH_CONFIG_SELECT } from '@/pages/gundam-pages/FAQ/FAQ-manage/const';
import { useHistoryModel } from './model';
import { approvalResult, approvalType } from '../awaitList/count';
import Condition from '@/components/Condition';

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

  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      // 显示
      setQuestionInfo(row);
      CurrentPage({ faqId: row.id });
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
    <Modal
      className={style['modal-bg']}
      width={850}
      bodyStyle={{ maxHeight: '600px' }}
      title={'历史申请记录--还会自动提额吗'}
      visible={visible}
      onCancel={onClose}
      okText={'确定'}
      onOk={submit}
      destroyOnClose={true}
    >
      <div className={style['FAQ-page']}>
        <div className={style['box']}>
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
                      <div key={index}>
                        {item.historyList.map((v: any, idx: any) => {
                          return (
                            <div key={v.id}>
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
                                      <div>
                                        生效时间：{`${v.enableStartTime}~${v.enableEndTime}`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <span>操作经办：{v.creator}</span>
                                  <span style={{ marginLeft: '16px' }}>
                                    操作类型：{approvalType[v.operationStatus]}
                                  </span>
                                  <span style={{ marginLeft: '16px' }}>
                                    操作时间：{v.createTime}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    margin: '16px 0',
                                    border: '1px solid #000',
                                    padding: '0 6px ',
                                  }}
                                >
                                  {v.reason}
                                </div>
                              </div>
                              <div>
                                <div>
                                  <span>审批经办：{v.updateBy}</span>
                                  <span style={{ marginLeft: '16px' }}>
                                    审批结果：{approvalResult[v.approvalStatus]}
                                  </span>
                                  <span style={{ marginLeft: '16px' }}>
                                    审批时间：{v.updateTime}
                                  </span>
                                </div>
                                <Condition r-if={v.approvalStatus != 0}>
                                  <div
                                    style={{
                                      margin: '16px 0',
                                      border: '1px solid #000',
                                      padding: '0 6px ',
                                    }}
                                  >
                                    {v.approvalReason}
                                  </div>
                                </Condition>
                              </div>
                            </div>
                          );
                        })}
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
    </Modal>
  );
};

export default SelectorModal;
