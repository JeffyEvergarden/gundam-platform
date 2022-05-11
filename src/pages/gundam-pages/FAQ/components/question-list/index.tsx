import React, { useState, useEffect, useRef } from 'react';
import { List, Divider, Skeleton, Select, message, Popconfirm } from 'antd';
import { useFaqModal } from '../../FAQ-manage/model';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { DeleteOutlined, DislikeOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
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
                      <div className={style['title']}>{item.name}</div>
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
                          <DeleteOutlined style={{ color: 'red' }} />
                        </Popconfirm>
                      </div>
                    </div>
                    <div className={style['box-desc']}>
                      <div>
                        <span>作者: {item.creator}</span>
                        <Divider type="vertical" />
                        <span>
                          分类: <span className={style['blue']}>{item.faqTypeId}</span>
                        </span>
                        <Divider type="vertical" />
                        <span>浏览次数: {item.viewNum}</span>
                        {!hasCheckbox && <Divider type="vertical" />}
                        {!hasCheckbox && (
                          <Select
                            size="small"
                            defaultValue={item.approvalStatus}
                            style={{ width: 100 }}
                          >
                            <Option value={1}>等待审批</Option>
                            <Option value={2}>被退回</Option>
                            <Option value={3}>过期</Option>
                            <Option value={4}>已发布</Option>
                          </Select>
                        )}
                      </div>
                      <div>
                        <span className={style['blue']}>2个相似问法</span>
                        <Divider type="vertical" />
                        <span className={style['blue']}>推荐问设置</span>
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
                      {item.answerList.map((v: any) => {
                        return (
                          <div className={style['box-answer']}>
                            <div
                              className={style['box-content']}
                              dangerouslySetInnerHTML={{ __html: v.answer }}
                            ></div>
                            <div className={style['box-footer']}>
                              <div>
                                <span>作者: {v.creator}</span>
                                <Divider type="vertical" />
                                <span>
                                  生效渠道:
                                  <span className={style['blue']}>{item.faqTypeId}</span>
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
      />
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default QuestionList;
