import config from '@/config';
import SoundVarModal from '@/pages/gundam-pages/main-draw/drawerV2/components/sound-var-modal';
import Condition from '@/pages/gundam-pages/main-draw/flow/common/Condition';
import ProList from '@ant-design/pro-list';
import { Button, Checkbox, Divider, Input, message, Pagination, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import AnswerView from '../answerView-modal';
import History from '../history-modal';
import ReasonModal from '../reason-modal';
import { approvalResult, approvalType } from './count';
import { useApprovalModel } from './model';
import style from './style.less';

const { Option } = Select;
//test
const AwaitList: React.FC<any> = (props: any) => {
  const { cref, pageType } = props;
  const { list, getList, getPList, approvalPass, allApprovalPass, loading, totalPage } =
    useApprovalModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { highChannelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    highChannelList: model.highChannelList,
    getChannelList: model.getChannelList,
  }));

  const { getShowBadgeTotal } = useModel('drawer' as any, (model: any) => ({
    getShowBadgeTotal: model.getShowBadgeTotal,
  }));
  const [current, setCurrent] = useState<any>(1);
  const [total, setTotal] = useState<any>(0);
  const [pageSize, setPageSize] = useState<any>(10);
  const [searchText, setSearchText] = useState<any>('');
  const [queryType, setQueryType] = useState<any>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const listRef = useRef<any>({});
  const historyRef = useRef<any>(null);
  const answerViewRef = useRef<any>(null);
  const ReasonModalRef = useRef<any>(null);
  const auditionRef = useRef<any>(null);

  //获取列表
  const CurrentPage = async (obj?: any) => {
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
      approvalStatus: pageType == 'pending' ? 2 : 1, //判断待审批 待处理
      searchText: searchText,
      queryType: queryType,
      ...obj,
    };
    console.log(params);

    let res: any = pageType == 'reviewed' ? await getList(params) : await getPList(params);
    console.log(res);
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
    getShowBadgeTotal(info.id);

    setTotal(res?.total || 0);
    return res;
  };
  const pageChange = (page: any, size: any) => {
    setCurrent(page);
    setPageSize(size);
    CurrentPage({ page, pageSize: size, robotId: info.id });
  };

  const passBtn = async (row: any) => {
    let res: any = await approvalPass({ id: row.id });
    if (res) {
      CurrentPage({ page: current, pageSize });
    }
  };

  const allPass = async () => {
    console.log(selectedRowKeys);
    if (!selectedRowKeys?.length) {
      message.warning('请选择待审核问题');
      return;
    }
    let res: any = await allApprovalPass({ idList: selectedRowKeys, robotId: info.id });

    if (res) {
      setSelectAll(false);
      setSelectedRowKeys([]);
      CurrentPage({ page: current, pageSize });
    }
  };

  const refreshList = () => {
    CurrentPage({ page: current, pageSize });
  };

  useEffect(() => {
    CurrentPage();
  }, []);

  const checkboxChange = (val: any) => {
    let flag = val.target.checked;
    setSelectAll(flag);
    handleAll(flag);
  };

  const handleAll = (flag: any) => {
    console.log(flag);
    let all = list?.map((item: any) => item.id);
    if (flag) {
      setSelectedRowKeys(all);
    } else {
      setSelectedRowKeys([]);
    }
  };

  const rowSelection = () => {
    if (pageType != 'reviewed') {
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
    <div className={style['FAQ-page']}>
      <div className={style['box']}>
        <div className={style['page_top']}>
          <div style={{ fontSize: '20px', fontWeight: 400 }}>
            {pageType == 'pending' ? `待处理${total}条` : `待审核${total}条`}
          </div>
          <div className={style['page_top__right']}>
            <Space>
              <Input.Group compact>
                <Select
                  // size="small"
                  defaultValue={0}
                  onChange={setQueryType}
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
                    setSearchText(e.target.value);
                  }}
                  onSearch={(text: any) => {
                    CurrentPage({ searchText: text });
                  }}
                  onPressEnter={() => {
                    CurrentPage();
                  }}
                  placeholder={'请输入'}
                  allowClear
                />
              </Input.Group>
            </Space>
          </div>
        </div>
        <Condition r-if={pageType == 'reviewed'}>
          <div className={style['batch_pass']} style={{ marginBottom: '16px' }}>
            <div className={style['batch_pass']} style={{ paddingTop: '4px' }}>
              <Checkbox onChange={checkboxChange} checked={selectAll}></Checkbox>
              <span style={{ marginLeft: '8px' }}>全选</span>
            </div>
            <Button type="primary" onClick={allPass} loading={loading}>
              批量审核通过
            </Button>
          </div>
        </Condition>

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
            rowSelection={rowSelection()}
            metas={{
              title: {
                render: (title: any, item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className={style['list-item']}>
                        <div className={style['box-top']}>
                          {/* 问题名 label */}
                          <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            {/* 问题名字 */}
                            <Condition r-if={pageType == 'reviewed'}>
                              <Condition r-if={item.operationStatus == 3}>
                                <div className={style['edit']}>
                                  {approvalType[item.operationStatus]}
                                </div>
                              </Condition>
                              <Condition r-if={item.operationStatus == 2}>
                                <div className={style['addA']}>
                                  {approvalType[item.operationStatus]}
                                </div>
                              </Condition>
                              <Condition r-if={item.operationStatus == 1}>
                                <div className={style['addQ']}>
                                  {approvalType[item.operationStatus]}
                                </div>
                              </Condition>
                            </Condition>
                            <Condition r-if={pageType == 'pending'}>
                              <div className={style['danger']}>
                                {approvalResult[item.approvalStatus]}
                              </div>
                            </Condition>

                            <div className={style['title']}>{item.question}</div>
                          </div>
                          {/* 申请人 时间 */}
                          <div className={style['Info']}>
                            <Condition r-if={pageType == 'reviewed'}>
                              <div>
                                <span>申请人：{item.creator}</span>
                                <Divider type="vertical"></Divider>
                                <span>申请时间：{item.createTime}</span>
                              </div>
                            </Condition>
                            <Condition r-if={pageType == 'pending'}>
                              <div>
                                <span>审批经办：{item.creator}</span>
                                <Divider type="vertical"></Divider>

                                <span>审批时间：{item.createTime}</span>
                              </div>
                            </Condition>
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
                            {/* 内容 */}
                            <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
                              <div
                                className={style['box-content']}
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                              ></div>
                            </Condition>
                            <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                              <div className={style['box-content']}>{item.answer}</div>
                            </Condition>
                            {/* 生效渠道 */}
                            <div className={style['box-footer']}>
                              <div>
                                <span>
                                  生效渠道：
                                  <span>
                                    {item?.channelList &&
                                      item?.channelList
                                        ?.map((cl: any) => {
                                          return highChannelList?.find((c: any) => c.name == cl)
                                            ?.label;
                                        })
                                        ?.join(' , ')}
                                  </span>
                                </span>
                              </div>
                              {item.enableStartTime && item.enableEndTime && (
                                <Divider type="vertical"></Divider>
                              )}
                              {item.enableStartTime && item.enableEndTime && (
                                <div>日期：{`${item.enableStartTime} ~ ${item.enableEndTime}`}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {/* 备注  原因 */}
                        <div className={style['reason']}>备注：{item.reason}</div>
                        <Condition r-if={pageType == 'reviewed'}>
                          <div className={style['btnGroup']}>
                            <Condition r-if={config.robotTypeMap[info?.robotType] === '语音'}>
                              <Button
                                style={{ marginLeft: '16px' }}
                                type="primary"
                                onClick={() => {
                                  auditionRef?.current?.open(item);
                                }}
                              >
                                试听
                              </Button>
                            </Condition>
                            <Button
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                historyRef?.current?.open(item);
                              }}
                            >
                              历史申请记录
                            </Button>
                            <Button
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                answerViewRef?.current?.open(item);
                              }}
                            >
                              查看现有答案
                            </Button>
                            <Button
                              danger
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                ReasonModalRef?.current?.open(item, '退回');
                              }}
                            >
                              退回
                            </Button>

                            <Button
                              type="primary"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                passBtn(item);
                              }}
                            >
                              通过
                            </Button>
                          </div>
                        </Condition>
                        <Condition r-if={pageType == 'pending'}>
                          <div className={style['btnGroup']}>
                            <Button
                              onClick={() => {
                                historyRef?.current?.open(item);
                              }}
                            >
                              历史申请记录
                            </Button>
                            <Button
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                answerViewRef?.current?.open(item);
                              }}
                            >
                              查看现有答案
                            </Button>

                            <Button
                              danger
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                ReasonModalRef?.current?.open(item, '删除');
                              }}
                            >
                              删除
                            </Button>
                            <Button
                              type="primary"
                              style={{ marginLeft: '16px' }}
                              onClick={() => {
                                history.push(
                                  `/gundamPages/faq/answer?faqId=${item.faqId}&answerId=${item.answerId}&pageFrom=pendingList&id=${item.id}&batchNumber=${item.batchNumber}`,
                                );
                              }}
                            >
                              编辑
                            </Button>
                          </div>
                        </Condition>
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
      <History cref={historyRef} />
      <AnswerView cref={answerViewRef} />
      <ReasonModal cref={ReasonModalRef} refresh={refreshList} />
      <SoundVarModal cref={auditionRef}></SoundVarModal>
    </div>
  );
};

export default AwaitList;
