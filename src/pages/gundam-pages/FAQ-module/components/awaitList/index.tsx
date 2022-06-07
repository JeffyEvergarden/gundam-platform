import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Select, message, Button, Form, Pagination, Input, Space } from 'antd';
import style from './style.less';
import ProList from '@ant-design/pro-list';
import { useModel, history } from 'umi';
import config from '@/config';
import Condition from '@/pages/gundam-pages/main-draw/flow/common/Condition';
import KeepAlive, { useActivate, useUnactivate } from 'react-activation';
import { useFaqModal } from '@/pages/gundam-pages/FAQ/FAQ-manage/model';
import { deleteQuestion, editQuestion } from '@/pages/gundam-pages/FAQ/FAQ-manage/model/api';
import { HIGH_CONFIG_SELECT } from '@/pages/gundam-pages/FAQ/FAQ-manage/const';
import History from '../history-modal';
import AnswerView from '../answerView-modal';
import { approvalType } from './count';
import ReasonModal from '../reason-modal';

const { Option } = Select;

const AwaitList: React.FC<any> = (props: any) => {
  const { cref, pageType, list, loading, totalPage = 0 } = props;
  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));
  const { getCreateUser } = useModel('drawer' as any, (model: any) => ({
    getCreateUser: model.getCreateUser,
  }));
  const [current, setCurrent] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);

  const listRef = useRef<any>({});
  const historyRef = useRef<any>(null);
  const answerViewRef = useRef<any>(null);
  const ReasonModalRef = useRef<any>(null);

  useImperativeHandle(cref, () => ({
    CurrentPage,
  }));

  //获取问题列表
  const CurrentPage = async (obj?: any) => {
    // let selectTree = sessionStorage.getItem('selectTree');
    // console.log(obj);
    let params = {
      page: 1,
      pageSize: 10,
      robotId: info.id,
      // ...heightSelect,
      ...obj,
    };
    console.log(params);
    // let res: any = await getFaqList(params);
    // console.log(res);
    // getCreateUser(info.id, isRecycle);

    // setTotal(res?.total || 0);
    // return res;
  };
  const pageChange = (page: any, size: any) => {
    // console.log(page, size);
    setCurrent(page);
    setPageSize(size);
    CurrentPage({ page, pageSize: size, robotId: info.id });
  };

  return (
    <div className={style['FAQ-page']}>
      <div className={style['box']}>
        <div className={style['page_top']}>
          <div>{pageType == 'pending' ? `待处理${totalPage}条` : `待审核${totalPage}条`}</div>
          <div className={style['page_top__right']}>
            <Space>
              <Input.Group compact>
                <Select
                  // size="small"
                  defaultValue={0}
                  // onChange={changeQueryType}
                  style={{ backgroundColor: '#fff' }}
                  bordered={false}
                >
                  <Option value={0}>问题</Option>
                  <Option value={1}>答案</Option>
                  {/* <Option value={2}>标签</Option> */}
                </Select>
                <Input.Search
                  bordered={false}
                  style={{ width: '280px', backgroundColor: '#fff', borderColor: '#fff' }}
                  onChange={(e: any) => {
                    // setSearchText(e.target.value);
                  }}
                  // onSearch={onEnter}
                  onPressEnter={() => {
                    // QuestionRef?.current?.CurrentPage();
                  }}
                  placeholder={'请输入'}
                  allowClear
                />
              </Input.Group>
            </Space>
          </div>
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
                    <div key={index}>
                      <div className={style['list-item']}>
                        <div className={style['box-top']}>
                          <div className={style['title']}>
                            {/* 问题名字 */}
                            {item.question}
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

                          <div className={style['box-answer']}>
                            <div
                              className={style['box-content']}
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            ></div>
                            <div className={style['box-footer']}>
                              <div>
                                <span>
                                  生效渠道：
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      // _editAnswer(item, v);
                                    }}
                                  >
                                    {item?.channelList &&
                                      item?.channelList
                                        ?.map((cl: any) => {
                                          return HIGH_CONFIG_SELECT?.[0]?.children?.find(
                                            (c: any) => c.name == cl,
                                          )?.label;
                                        })
                                        ?.join(' , ')}
                                  </Button>
                                </span>
                              </div>
                              <div>日期：{`${item.enableStartTime}~${item.enableEndTime}`}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Condition r-if={pageType == 'reviewed'}>
                          <div>
                            <span>申请人：{item.creator}</span>
                            <span style={{ marginLeft: '16px' }}>
                              申请类型：{approvalType[item.operationStatus]}
                            </span>
                            <span style={{ marginLeft: '16px' }}>申请时间：{item.createTime}</span>
                          </div>
                        </Condition>
                        <Condition r-if={pageType == 'pending'}>
                          <div>
                            <span>审批经办：{item.creator}</span>
                            <span style={{ marginLeft: '16px' }}>
                              审批结果：{approvalType[item.operationStatus]}
                            </span>
                            <span style={{ marginLeft: '16px' }}>审批时间：{item.createTime}</span>
                          </div>
                        </Condition>
                        <div
                          style={{ margin: '16px 0', border: '1px solid #000', padding: '0 6px ' }}
                        >
                          {item.reason}
                        </div>
                        <Condition r-if={pageType == 'reviewed'}>
                          <div>
                            <Button type="primary" size="small">
                              通过
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                ReasonModalRef?.current?.open('退回');
                              }}
                            >
                              退回
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                answerViewRef?.current?.open();
                              }}
                            >
                              查看现有答案
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                historyRef?.current?.open();
                              }}
                            >
                              历史申请记录
                            </Button>
                          </div>
                        </Condition>
                        <Condition r-if={pageType == 'pending'}>
                          <div>
                            <Button type="primary" size="small">
                              编辑
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                answerViewRef?.current?.open();
                              }}
                            >
                              查看现有答案
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                historyRef?.current?.open();
                              }}
                            >
                              历史申请记录
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                ReasonModalRef?.current?.open('删除');
                              }}
                            >
                              删除
                            </Button>
                          </div>
                        </Condition>
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
            total={totalPage || 0}
            current={current}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
            defaultPageSize={10}
            defaultCurrent={1}
            onChange={pageChange}
          />
        </div>
      </div>
      <History cref={historyRef} />
      <AnswerView cref={answerViewRef} />
      <ReasonModal cref={ReasonModalRef}></ReasonModal>
    </div>
  );
};

export default AwaitList;
