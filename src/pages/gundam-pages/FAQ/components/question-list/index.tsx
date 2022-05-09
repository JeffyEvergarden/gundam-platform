import React, { useState, useEffect } from 'react';
import { List, Divider, Skeleton, Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFaqModal } from '../../FAQ-manage/model';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { DeleteOutlined, DislikeOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';

const QuestionList: React.FC<any> = (props: any) => {
  const { hasCheckbox } = props;
  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const [pageNo, setPageNo] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const _getMoreFaqList = async () => {
    console.log(faqList.length, totalSize, faqList.length < totalSize);
    if (loading) {
      return;
    }
    let res = await getMoreFaqList({ pageNo: pageNo + 1 });
    if (res) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    getFaqList({ pageNo: 1 });
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

  return (
    <div id="scrollContent" className={style['content']}>
      <InfiniteScroll
        dataLength={faqList.length}
        hasMore={faqList.length < totalSize}
        next={_getMoreFaqList}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollContent"
      >
        <ProList
          // itemLayout="vertical"
          dataSource={faqList}
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
                          <DeleteOutlined />
                        </div>
                      </div>
                      <div className={style['box-desc']}>
                        <div>
                          <span>作者: {item.creator}</span>
                          <Divider type="vertical" />
                          <span>
                            分类: <span className={style['blue']}>{channel.join(',')}</span>
                          </span>
                          <Divider type="vertical" />
                          <span>浏览次数: {item.times}</span>
                          {!hasCheckbox && <Divider type="vertical" />}
                          {!hasCheckbox && <Select size="small"></Select>}
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
                        <div className={style['box-answer']}>
                          <div
                            className={style['box-content']}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          ></div>
                          <div className={style['box-footer']}>
                            <div>
                              <span>作者: {item.creator}</span>
                              <Divider type="vertical" />
                              <span>
                                生效渠道: <span className={style['blue']}>{channel.join(',')}</span>
                              </span>
                            </div>
                            <div>
                              <span>
                                <EyeOutlined /> {item.times}
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
                      </div>

                      <div className={style['box-footer']}>
                        <div className={style['blue']}>更多答案</div>
                        <div style={{ display: 'flex', color: 'rgba(0,0,0,0.45)' }}>
                          {hasCheckbox && (
                            <div className={style['extra']}>删除操作人：{item.name}</div>
                          )}
                          <div className={style['extra']}>
                            {hasCheckbox ? '删除' : '更新'}时间：{item.time}
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
            defaultPageSize: 5,
            showSizeChanger: true,
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default QuestionList;
