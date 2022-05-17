import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  List,
  Divider,
  Skeleton,
  Select,
  message,
  Popconfirm,
  Button,
  Badge,
  Checkbox,
} from 'antd';
import { useFaqModal } from '../../FAQ-manage/model';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import {
  DeleteOutlined,
  DislikeOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useModel, history } from 'umi';
import { deleteQuestion } from '../../FAQ-manage/model/api';
import config from '@/config';
import Condition from '@/pages/gundam-pages/main-draw/flow/common/Condition';
import ClassifyModal from '../classify-modal';

const { Option } = Select;

const QuestionList: React.FC<any> = (props: any) => {
  const { cref, hasCheckbox, openClassify } = props;
  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));
  const [pageNo, setPageNo] = useState<number>(1);
  const [more, setMore] = useState<any>([]);
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

  useImperativeHandle(cref, () => ({
    selectAll(flag: any) {
      console.log(flag);
      let all = faqList?.map((item) => item.id);
      if (flag) {
        setSelectedRowKeys(all);
      } else {
        setSelectedRowKeys([]);
      }
    },
  }));

  useEffect(() => {
    // getFaqList({ pageNo: 1 });
    listRef.current.reload();
    console.log(listRef);
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

  const checkboxChange = (val: any) => {
    let flag = val.target.checked;

    let all = faqList?.map((item) => item.id);
    if (flag) {
      setSelectedRowKeys(all);
    } else {
      setSelectedRowKeys([]);
    }
  };

  return (
    <div id="scrollContent" className={style['content-list']}>
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
                          <Button type="link" onClick={openClassify}>
                            {item.faqTypeId}
                          </Button>
                        </span>
                        {/* <Divider type="vertical" />
                        <span>浏览次数：{item.viewNum}</span> */}
                        {!hasCheckbox && <Divider type="vertical" />}
                        {!hasCheckbox && (
                          <Badge
                            status={status[item.approvalStatus]}
                            text={
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
                            }
                          />
                        )}
                        <Divider type="vertical" />
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
                      <div>
                        <span>
                          <EyeOutlined /> {item.viewNum}
                        </span>
                        <Divider type="vertical" />
                        <span>
                          <LikeOutlined />
                          {item.likeNum}
                        </span>

                        <Divider type="vertical" />
                        <span>
                          <DislikeOutlined /> {item.unlikeNum}
                        </span>
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
                          <Condition r-if={more[index] || idx == 0} key={idx}>
                            <div className={style['box-answer']}>
                              <div className={style['box-top']}>
                                {!hasCheckbox && (
                                  <Badge
                                    status={status[item.approvalStatus]}
                                    text={
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
                                    }
                                  />
                                )}
                                <div></div>

                                <div>
                                  <EditOutlined
                                    style={{ marginRight: '18px', color: 'rgba(0,0,0,0.45)' }}
                                  />
                                  {!hasCheckbox && (
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
                                  )}
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
                          </Condition>
                        );
                      })}
                    </div>

                    <div className={style['box-footer']}>
                      <div>
                        <Button
                          key={index}
                          type="link"
                          onClick={() => {
                            let arr: any = JSON.parse(JSON.stringify(more));
                            arr[index] = !arr[index];
                            setMore(arr);
                          }}
                        >
                          更多答案{more[index] ? <UpOutlined /> : <DownOutlined />}
                        </Button>
                        <Divider type="vertical"></Divider>
                        <Button type="link" onClick={() => {}}>
                          新增答案
                        </Button>
                      </div>

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
    </div>
  );
};

export default QuestionList;
