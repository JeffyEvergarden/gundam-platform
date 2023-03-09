import config from '@/config';
import Condition from '@/pages/gundam-pages/main-draw/flow/common/Condition';
import { ObjToSearch } from '@/utils';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DislikeOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  QuestionCircleFilled,
  UpOutlined,
} from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Pagination,
  Popconfirm,
  Select,
  Switch,
} from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import { history, useModel } from 'umi';
import { useFaqModal } from '../../FAQ-manage/model';
import { deleteQuestion } from '../../FAQ-manage/model/api';
import { deleteAnswer, editQuestion, isAdd } from '../../question-board/model/api';
import style from './style.less';

const { Option } = Select;

const QuestionList: React.FC<any> = (props: any) => {
  const {
    cref,
    hasCheckbox,
    openClassify,
    openChannel,
    childList,
    queryType = 0,
    searchText = '',
    heightSelect,
    isRecycle,
    deleteRecycle,
    selectTree,
    getTreeData,
  } = props;
  const { loading, resData, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();
  const [form] = Form.useForm();
  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { highChannelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    highChannelList: model.highChannelList,
    getChannelList: model.getChannelList,
  }));
  const robotTypeMap = config.robotTypeMap;
  const robotType: any = robotTypeMap[info.robotType] || '语音';
  useEffect(() => {
    getChannelList(info.id);
  }, []);

  const { getCreateUser, getShowBadgeTotal } = useModel('drawer' as any, (model: any) => ({
    getCreateUser: model.getCreateUser,
    getShowBadgeTotal: model.getShowBadgeTotal,
  }));
  const [total, setTotal] = useState<any>(0);
  const [current, setCurrent] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);
  const [more, setMore] = useState<any>([]); //更多答案
  const [edit, setEdit] = useState<any>([]); //编辑名字
  const [editQLoading, setEditQLoading] = useState<any>(false); //编辑是否联想
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const listRef = useRef<any>({});

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
    CurrentPage,
    editQ,
    deleteRecycle() {
      // console.log(selectedRowKeys);
      return selectedRowKeys;
    },
    resData,
    faqExport,
  }));

  const faqExport = () => {
    let params = {
      robotId: info.id,
      queryType: queryType,
      searchText: searchText,
      recycle: isRecycle,
      faqTypeId: selectTree == '0' ? null : selectTree,
      ...heightSelect,
    };
    window.open(`${config.basePath}/robot/faq/robotFaqExport?${ObjToSearch(params)}`);
  };

  const rowSelection = () => {
    // if (!hasCheckbox) {
    //   return false;
    // }
    return {
      selectedRowKeys,
      onChange: (keys: any[]) => {
        return setSelectedRowKeys(keys);
      },
    };
  };

  const deleteList = async (val: any) => {
    if (isRecycle == 1) {
      await deleteRecycle({ faqIds: [val.id] }).then((res: any) => {
        if (res.resultCode == config.successCode) {
          message.success(res.resultDesc);
        } else {
          message.error(res.resultDesc);
        }
        CurrentPage({ page: current, pageSize });
      });
    } else if (isRecycle == 0) {
      setEditQLoading(true);
      await isAdd({ faqId: val.id, robotId: info.id }).then(async (res) => {
        if (res.resultCode == config.successCode) {
          if (res.data.editFlag) {
            await deleteQuestion({ id: val?.id }).then((res) => {
              setEditQLoading(false);
              if (res.resultCode == config.successCode) {
                message.success(res?.resultDesc || '');
                getTreeData();
              } else {
                message.error(res?.resultDesc || '');
              }
              CurrentPage({ page: current, pageSize });
            });
          } else {
            setEditQLoading(false);
            message.warning('已有在途待处理的答案，不可编辑/新增/删除');
          }
        } else {
          setEditQLoading(false);
          message.error(res.resultDesc);
        }
      });
      setEditQLoading(false);
    }
  };

  const toSample = (item: any) => {
    history.push({
      pathname: '/gundamPages/faq/similar',
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

  const changeEdit = (item: any, index: any) => {
    if (edit[index]) {
      // console.log(form.getFieldsValue());
      editQ({ id: item.id, ...form.getFieldsValue() });
      let arr: any = JSON.parse(JSON.stringify(edit));
      arr[index] = !arr[index];
      setEdit(arr);
    } else {
      form.setFieldsValue({ question: item.question });
      let arr: any = [];
      arr[index] = !arr[index];
      setEdit(arr);
    }
  };

  const addAnswer = async (item: any) => {
    await isAdd({ faqId: item.id, robotId: info.id }).then((res) => {
      if (res.resultCode == config.successCode) {
        if (res.data.editFlag) {
          history.push(`/gundamPages/faq/answer?faqId=${item.id}`);
        } else {
          message.warning('已有在途待处理的答案，不可编辑/新增/删除');
        }
      } else {
        message.error(res.resultDesc);
      }
    });

    // console.log(item);
  };

  const _editAnswer = async (Q: any, A: any) => {
    // console.log(Q);
    // console.log(A);
    if (Q.recycle == 0) {
      await isAdd({ faqId: Q.id, robotId: info.id }).then((res) => {
        if (res.resultCode == config.successCode) {
          if (res.data.editFlag) {
            history.push(
              `/gundamPages/faq/answer?faqId=${Q.id}&answerId=${A.answerId}&recycle=${Q.recycle}`,
            );
          } else {
            message.warning('已有在途待处理的答案，不可编辑/新增/删除');
          }
        } else {
          message.error(res.resultDesc);
        }
      });
    }
  };

  const _deleteAnswer = async (Q: any, A: any) => {
    // console.log(A);
    //检测是否有待审批待处理
    await isAdd({ faqId: Q.id, robotId: info.id }).then(async (res) => {
      if (res.resultCode == config.successCode) {
        if (res.data.editFlag) {
          //删除答案
          await deleteAnswer({ id: A.answerId, robotId: info.id }).then((res) => {
            if (res.resultCode == config.successCode) {
              message.success(res.resultDesc);
            } else {
              message.error(res.resultDesc);
            }
            CurrentPage({ page: current, pageSize });
          });
        } else {
          message.warning('已有在途待处理的答案，不可编辑/新增/删除');
        }
      } else {
        message.error(res.resultDesc);
      }
    });
  };

  //获取问题列表
  const CurrentPage = async (obj?: any) => {
    // let selectTree = sessionStorage.getItem('selectTree');
    // console.log(obj);
    if (!obj?.page) {
      setCurrent(1);
    }
    // if (!obj?.pageSize) {
    //   setPageSize(10);
    // }
    let params = {
      page: 1,
      pageSize: pageSize,
      robotId: info.id,
      queryType: queryType,
      searchText: searchText,
      recycle: isRecycle,
      faqTypeId: selectTree == '0' ? null : selectTree,
      ...heightSelect,
      ...obj,
    };
    // console.log(selectTree);

    console.log(params);
    // if (isRecycle == 0 && !params.faqTypeId) {
    //   return;
    // }

    setEdit([]);

    let res: any = await getFaqList(params);
    if (res) {
      //分页大于2时删除当前页最后一条数据返回前一页
      if (res.total > 0) {
        if (params?.page > Math.ceil(res?.total / params?.pageSize)) {
          let num: number = current - 1 <= 1 ? 1 : current - 1;
          setCurrent(num);
          CurrentPage({ page: num, pageSize });
        }
      }
    }

    // console.log(res);
    getCreateUser(info.id, isRecycle);
    getShowBadgeTotal(info.id);

    setTotal(res?.total || 0);
    return res;
  };
  const pageChange = (page: any, size: any) => {
    // console.log(page, size);
    setCurrent(page);
    setPageSize(size);
    CurrentPage({ page, pageSize: size, robotId: info.id });
  };

  //编辑问题
  const editQ = async (params: any) => {
    let reqData = {
      robotId: info.id,
      ...params,
    };
    setEditQLoading(true);
    await editQuestion(reqData).then((res) => {
      setEditQLoading(false);
      if (res.resultCode == config.successCode) {
        message.success(res.resultDesc);
        getTreeData();
        CurrentPage({ page: current, pageSize });
        return true;
      } else {
        message.error(res.resultDesc);
        CurrentPage({ page: current, pageSize });
        return false;
      }
    });
  };

  useActivate(() => {
    CurrentPage({ page: current, pageSize });
  });
  useEffect(() => {
    CurrentPage();
  }, [selectTree]);

  return (
    <div className={style['box']}>
      <div id="scrollContent" className={style['content-list']}>
        <ProList
          loading={loading || editQLoading}
          actionRef={listRef}
          dataSource={faqList}
          request={async (params = {}, sort, filter) => {
            return {};
            // return CurrentPage({ page: current, pageSize, robotId: info.id });
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
                        <div className={style['title']}>
                          {/* 问题名字编辑 */}
                          {!hasCheckbox && (
                            <QuestionCircleFilled
                              className={style['blue']}
                              style={{ marginRight: '8px' }}
                            />
                          )}
                          {!edit[index] && item.question}
                          {edit[index] && (
                            <Form form={form}>
                              <Form.Item name="question">
                                <Input
                                  maxLength={200}
                                  size="small"
                                  onPressEnter={() => {
                                    changeEdit(item, index);
                                  }}
                                ></Input>
                              </Form.Item>
                            </Form>
                          )}
                          {/* 不在回收站 */}
                          {!hasCheckbox && !edit[index] && (
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => {
                                changeEdit(item, index);
                              }}
                            ></Button>
                          )}
                          {!hasCheckbox && edit[index] && (
                            <>
                              <Button
                                type="link"
                                icon={<CheckOutlined />}
                                onClick={() => {
                                  changeEdit(item, index);
                                }}
                              ></Button>
                              <Button
                                type="link"
                                icon={<CloseOutlined />}
                                onClick={() => {
                                  let arr: any = JSON.parse(JSON.stringify(edit));
                                  arr[index] = !arr[index];
                                  setEdit(arr);
                                }}
                              ></Button>
                            </>
                          )}
                        </div>
                        {/* 问题删除 */}
                        <div className={style['box-top-del']}>
                          <Condition r-if={robotType == '文本'}>
                            <div className={style['box-top-del']}>
                              是否联想：
                              <Switch
                                size="small"
                                checkedChildren="开启"
                                unCheckedChildren="关闭"
                                onChange={(val) => {
                                  console.log(val);
                                  editQ({ id: item?.id, suggest: val ? 1 : 0 });
                                }}
                                checked={item?.suggest == 1 ? true : false}
                                disabled={isRecycle == 1 || item?.faqType == 2}
                                // loading={editQLoading}
                              ></Switch>
                            </div>
                            <Divider type="vertical" />
                          </Condition>

                          <Popconfirm
                            title={() => {
                              return (
                                <div style={{ maxWidth: '180px' }}>
                                  {!isRecycle
                                    ? '删除问题将会一并删除与之相关的答案、相似问法，确认删除问题？（删除的问题可在回收站中找回）'
                                    : '从问题回收站删除问题将彻底清除该问题所有相关记录，是否确认删除？'}
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
                      {/* 作者... */}
                      <div className={style['box-desc']}>
                        <div style={{ marginRight: '12px' }}>
                          <span>作者：{item.updateBy || item.creator}</span>
                          <Divider type="vertical" />
                          <span>
                            分类：
                            <Button
                              type="link"
                              onClick={() => {
                                openClassify?.(item);
                              }}
                            >
                              {childList?.find((c: any) => c.key == item.faqTypeId)?.classify ||
                                '-'}
                              {/* {item.faqTypeId} */}
                            </Button>
                          </span>
                          <Divider type="vertical" />
                          <Button
                            type="link"
                            onClick={() => {
                              toSample(item);
                            }}
                          >
                            {item?.similarNum || 0}个相似问法
                          </Button>
                          <Condition r-if={robotTypeMap[info.robotType] == '文本'}>
                            <Divider type="vertical" />
                            <Button
                              type="link"
                              onClick={() => {
                                history.push(
                                  `/gundamPages/faq/recommend?faqId=${item.id}&question=${
                                    item.question
                                  }&treeId=${selectTree == '0' ? '' : selectTree}&recommend=${
                                    item.questionRecommend
                                  }&recycle=${item.recycle}`,
                                );
                              }}
                            >
                              推荐问设置
                            </Button>
                          </Condition>
                        </div>

                        <div
                          style={{
                            lineHeight: '30px',
                            flexShrink: 0,
                          }}
                        >
                          <span>
                            <EyeOutlined /> {item.sumViewNum}
                          </span>
                          <Divider type="vertical" />
                          <span>
                            <LikeOutlined /> {item.likeNum}
                          </span>

                          <Divider type="vertical" />
                          <span>
                            <DislikeOutlined /> {item.unlikeNum}
                          </span>
                        </div>
                      </div>
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
                            <Condition r-if={more[index] || idx == 0} key={idx}>
                              <div className={style['box-answer']}>
                                <div className={style['box-top']}>
                                  <span>
                                    生效渠道：
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        _editAnswer(item, v);
                                      }}
                                    >
                                      {v?.channelList &&
                                        v?.channelList
                                          ?.map((cl: any) => {
                                            return highChannelList?.find((c: any) => c.name == cl)
                                              ?.label;
                                          })
                                          ?.join(' , ')}
                                    </Button>
                                  </span>

                                  <div></div>

                                  <div>
                                    {!hasCheckbox && (
                                      <Button
                                        icon={<EditOutlined />}
                                        type="link"
                                        style={{ marginRight: '10px', color: 'rgba(0,0,0,0.45)' }}
                                        onClick={() => {
                                          _editAnswer(item, v);
                                        }}
                                      ></Button>
                                    )}

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
                                          _deleteAnswer(item, v);
                                        }}
                                      >
                                        <DeleteOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                                      </Popconfirm>
                                    )}
                                  </div>
                                </div>
                                <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
                                  <div
                                    className={style['box-content']}
                                    dangerouslySetInnerHTML={{ __html: v.answer }}
                                  ></div>
                                </Condition>
                                <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                                  <div className={style['box-content']}>{v.answer}</div>
                                </Condition>
                                <div className={style['box-footer']}>
                                  <div>
                                    <span>作者：{v.updateBy || v.creator}</span>
                                    {/* <Divider type="vertical" /> */}
                                  </div>
                                  <div>
                                    <span>
                                      <EyeOutlined /> {v.answerViewNum}
                                    </span>
                                    <Divider type="vertical" />
                                    <span>
                                      <LikeOutlined /> {v.answerLikeNum}
                                    </span>

                                    <Divider type="vertical" />
                                    <span>
                                      <DislikeOutlined /> {v.answerUnlikeNum}
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
                            disabled={item?.answerList?.length <= 1}
                          >
                            更多答案{more[index] ? <UpOutlined /> : <DownOutlined />}
                          </Button>
                          {!hasCheckbox && <Divider type="vertical"></Divider>}
                          {!hasCheckbox && (
                            <Button
                              type="link"
                              onClick={() => {
                                addAnswer(item);
                              }}
                            >
                              新增答案
                            </Button>
                          )}
                        </div>

                        <div style={{ display: 'flex', color: 'rgba(0,0,0,0.45)' }}>
                          {hasCheckbox && (
                            <div className={style['extra']}>删除操作人：{item.updateBy}</div>
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
          pageSize={pageSize}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
          defaultPageSize={10}
          defaultCurrent={1}
          onChange={pageChange}
        />
      </div>
    </div>
  );
};

export default QuestionList;
