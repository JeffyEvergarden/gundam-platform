import React, { useState, useEffect, useRef } from 'react';
import { List, Divider, Skeleton, Select, message, Popconfirm, Button, Badge } from 'antd';
import { useFaqModal } from '../../FAQ-manage/model';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import {
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { useModel, history } from 'umi';
import { deleteQuestion } from '../../FAQ-manage/model/api';
import config from '@/config';

const { Option } = Select;

const QuestionList: React.FC<any> = (props: any) => {
  const { hasCheckbox } = props;
  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));
  const [pageNo, setPageNo] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const listRef = useRef<any>({});

  const _getMoreFaqList = async () => {
    // console.log(faqList.length, totalSize, faqList.length < totalSize);
    // if (loading) {
    //   return;
    // }
    // let res = await getMoreFaqList({ pageNo: pageNo + 1 });
    // if (res) {
    //   setPageNo(pageNo + 1);
    // }
    return true;
  };

  useEffect(() => {
    // getFaqList({ pageNo: 1 });
    listRef.current.reload();
  }, []);

  const rowSelection = () => {
    if (!hasCheckbox) {
      return false;
    }
    return {
      selectedRowKeys,
      onChange: (keys: any[]) => {
        console.log(keys);
        return setSelectedRowKeys(keys);
      },
    };
  };

  const deleteList = async (val: any) => {
    console.log(val);
    await deleteQuestion({ id: val?.id }).then((res) => {
      console.log(res, config);

      if (res.resultCode == config.successCode) {
        message.success(res?.resultDesc || '');
      }
    });
  };

  const toSample = (item: any) => {
    history.push({
      pathname: '/gundamPages/sample',
      state: {
        info: item,
        pageType: 'FAQ',
      },
    });
  };

  const status = {
    1: 'processing',
    2: 'warning',
    3: 'error',
    4: 'success',
  };

  const statusList = [
    {
      name: '等待审批',
      value: 1,
    },
    {
      name: '被退回',
      value: 2,
    },
    {
      name: '已过期',
      value: 3,
    },
    {
      name: '已发布',
      value: 4,
    },
  ];

  return (
    <div id="scrollContent" className={style['content']}>
      {/* <InfiniteScroll
        dataLength={faqList.length}
        hasMore={faqList.length < totalSize}
        next={_getMoreFaqList}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollContent"
      > */}
      <ProList
        // itemLayout="vertical"
        actionRef={listRef}
        dataSource={faqList}
        request={async (params = {}, sort, filter) => {
          return getFaqList({ page: params.current, ...params, robotId: info.id });
        }}
        rowSelection={rowSelection()}
        tableAlertRender={false}
        metas={{
          title: {
            render: (title: any, item: any, index: number) => {
              console.log(item, index);
              const channel: any = item.channel || [];
              return (
                <div key={index}>
                  <div className={style['list-item']}>
                    <div className={style['box-top']}>
                      <div className={style['title']}>{item.question}</div>
                      <div className={style['box-top']}>
                        <Popconfirm
                          title={() => {
                            return (
                              <div style={{ maxWidth: '180px' }}>
                                删除问题将会一并删除与之相关的答案、相似问法，确认删除问题？（删除的问题可在知识库回收站中找回
                              </div>
                            );
                          }}
                          getPopupContainer={(trigger: any) => trigger.parentElement}
                          okText="确定"
                          placement="topRight"
                          cancelText="取消"
                          onConfirm={() => {
                            deleteList(item);
                          }}
                        >
                          <DeleteOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                        </Popconfirm>
                      </div>
                    </div>
                    <div className={style['box-desc']}>
                      <div>
                        <span>作者：{item.creator}</span>
                        <Divider type="vertical" />
                        <span>
                          分类：
                          <Button type="link">{item.faqTypeId}</Button>
                        </span>
                        <Divider type="vertical" />
                        <span>浏览次数：{item.viewNum}</span>
                        <Divider type="vertical" />
                        <Badge
                          status={status[item.approvalStatus]}
                          text={
                            hasCheckbox ? (
                              statusList?.find((val: any) => val.value == item.approvalStatus)?.name
                            ) : (
                              <Select
                                size="small"
                                defaultValue={item.approvalStatus}
                                style={{ width: 100, padding: 0 }}
                                bordered={false}
                              >
                                {statusList.map((val: any) => {
                                  return (
                                    <Option value={val.value} key={val.value}>
                                      {val.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            )
                          }
                        />
                      </div>
                      <div>
                        <Button
                          type="link"
                          onClick={() => {
                            toSample(item);
                          }}
                        >
                          2个相似问法
                        </Button>
                        <Divider type="vertical" />
                        <Button
                          type="link"
                          onClick={() => {
                            history.push('/gundamPages/faq/recommend');
                          }}
                        >
                          推荐问设置
                        </Button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      {/* 答案列表 */}
                      {item.answerList.map((v: any, idx: any) => {
                        return (
                          <div className={style['box-answer']} key={idx}>
                            <div className={style['box-top']}>
                              <Badge
                                status={status[item.approvalStatus]}
                                text={
                                  hasCheckbox ? (
                                    statusList?.find((val: any) => val.value == item.approvalStatus)
                                      ?.name
                                  ) : (
                                    <Select
                                      size="small"
                                      defaultValue={item.approvalStatus}
                                      style={{ width: 100, padding: 0 }}
                                      bordered={false}
                                    >
                                      {statusList.map((val: any) => {
                                        return (
                                          <Option value={val.value} key={val.value}>
                                            {val.name}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  )
                                }
                              />
                              <div>
                                <EditOutlined
                                  style={{ marginRight: '18px', color: 'rgba(0,0,0,0.45)' }}
                                />
                                <Popconfirm
                                  title={() => {
                                    return (
                                      <div style={{ maxWidth: '180px' }}>
                                        删除答案将会一并删除与之相关的浏览数据、渠道配置等，且无法找回，点击确认将删除该答案
                                      </div>
                                    );
                                  }}
                                  getPopupContainer={(trigger: any) => trigger.parentElement}
                                  okText="确定"
                                  placement="topRight"
                                  cancelText="取消"
                                  onConfirm={() => {
                                    // deleteList(item);
                                  }}
                                >
                                  <DeleteOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                                </Popconfirm>
                              </div>
                            </div>
                            <div
                              className={style['box-content']}
                              dangerouslySetInnerHTML={{ __html: v.answer }}
                            ></div>
                            <div className={style['box-footer']}>
                              <div>
                                <span>作者：{v.creator}</span>
                                <Divider type="vertical" />
                                <span>
                                  生效渠道：
                                  <Button type="link">{item.faqTypeId}</Button>
                                </span>
                              </div>
                              <div>
                                <span>
                                  <EyeOutlined /> {v.viewNum}
                                </span>
                                <Divider type="vertical" />
                                <span>
                                  <LikeOutlined />
                                  {item.times}
                                </span>

                                <Divider type="vertical" />
                                <span>
                                  <DislikeOutlined /> {item.times}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={style['box-footer']}>
                      <div className={style['blue']}>更多答案</div>
                      <div style={{ display: 'flex', color: 'rgba(0,0,0,0.45)' }}>
                        {hasCheckbox && (
                          <div className={style['extra']}>删除操作人：{item.name}</div>
                        )}
                        <div className={style['extra']}>
                          {hasCheckbox ? '删除' : '更新'}时间：{item.updateTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        rowKey={'id'}
        key={'id'}
      />
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default QuestionList;
