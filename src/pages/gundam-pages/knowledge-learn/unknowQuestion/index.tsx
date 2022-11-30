import Tip from '@/components/Tip';
import config from '@/config';
import { useTableModel } from '@/pages/gundam-pages/FAQ-module/clearlist/model';
import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { DownOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Dropdown, Menu, message, Popconfirm, Space, Tooltip } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import SessionRecord from './../component/sessionRecord';
import styles from './index.less';
import { useUnknownQuestion } from './model';

const { RangePicker } = DatePicker;

export default () => {
  const actionRef = useRef<any>();
  const selectFaqModalRef = useRef<any>();

  const {
    getList,
    addBlack,
    addBlackBatch,
    intentAddBatch,
    faqAddBatch,
    delUnknownquestion,
    tableLoading: batchLoading,
  } = useUnknownQuestion();
  // const { intentAdd } = useSampleModel();
  // const { addSimilar } = useSimilarModel();
  const { addClearItem, opLoading: addClearLoading } = useTableModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [learnNum, setLearnNum] = useState<number>(0);
  const [standardNum, setStandardNum] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);
  const [menulabel, setMenuLabel] = useState<string>('批量处理');

  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});
  // const [disaAbledData, setDisAbledData] = useState<any>();
  const [datasource, setDataSource] = useState<any>([]);
  const [operation, setOperation] = useState<string>('');
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '2', orderType: '2' });

  const getHide = () => {
    if (
      datasource.length &&
      datasource.length > 0 &&
      datasource.every((el: any) => el.recommendType == datasource[0].status)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);

      // if (selectedRowKeys.length && selectedRowKeys.length > 0) {
      //   setSelectedRowKeys(selectedRowKeys);
      //   setSelectRow(selectedRows);
      //   setDisAbledData(selectedRows[0].recommendType);
      // } else {
      //   setSelectedRowKeys(selectedRowKeys);
      //   setSelectRow(selectedRows);
      //   setDisAbledData(null);
      // }
    },
    // hideSelectAll: getHide(),
    getCheckboxProps: (record: any) => {
      return {
        // disabled: disaAbledData && record.recommendType !== disaAbledData,
      };
    },
  };

  const filtersSelection = (id: any) => {
    let arr: any = selectedRowKeys.filter((item: any) => item != id);
    setSelectedRowKeys([...arr]);
  };

  const getInitTable = async (payload: any) => {
    let start = payload?.rangeTime?.[0];
    let end = payload?.rangeTime?.[1];
    let params = {
      page: payload.current,
      pageSize: payload.pageSize,
      question: payload.question,
      robotId: info.id,
      orderType: payload.orderType,
      orderCode: payload.orderCode,
      startTime: start,
      endTime: end,
    };
    if (payload.source) {
      params.source = payload.source;
    }
    let res = await getList(params);
    setLearnNum(res?.data?.unknownQuestionCount);
    setStandardNum(res?.data?.faqCount);
    setDataSource(res?.data?.list);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const toStandard = (r: any) => {
    history.push({
      pathname: '/gundamPages/knowledgeLearn/standardQuestionLearn',
      state: {
        rowInfo: r,
      },
    });
  };

  const handleMenuClick = async (item: any) => {
    if (selectRow.length > 0) {
      if (item.key == '2') {
        setMenuLabel('批量添加');
        setOperation('addBatch');
        (selectFaqModalRef.current as any)?.open({
          selectList: [], //被选中列表
          selectedQuestionKeys: [], // 已选问题
          selectedWishKeys: [], // 已选意图
          question: '批量添加',
          operation: 'batch',
          questionList: selectRow,
        });
      }
    } else {
      message.warning('至少选择一个问题');
    }
  };

  const onConfirm = async () => {
    setMenuLabel('批量加入黑名单');
    let temp: any = [];
    selectRow.map((item: any) => {
      temp.push({
        question: item.question,
        unknownId: item.id,
      });
    });
    let params = {
      robotId: info.id,
      blacklistQuestionList: temp,
    };
    let res = await addBlackBatch(params);
    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const openSession = (r: any) => {
    setModalData(r);
    setVisibleSession(true);
  };

  const addStandard = (r: any) => {
    history.push({
      pathname: '/gundamPages/faq/board',
      state: {
        pageUrl: 'unknownQuestion',
        payload: r,
      },
    });
  };

  const addFAQOrSample = (r: any) => {
    // 意图
    if (r.recommendType == 2 && r.recommendName) {
      history.push({
        pathname: '/gundamPages/sample',
        state: {
          id: r.id,
          pageType: 'wish',
          info: r,
          pageUrl: 'unknownQustion',
          searchText: r.question,
        },
      });
    } else if (r.recommendType == 1 && r.recommendName) {
      //相似问
      history.push({
        pathname: '/gundamPages/sample',
        state: {
          id: r.id,
          pageType: 'FAQ',
          info: r,
          pageUrl: 'unknownQustion',
          searchText: r.question,
        },
      });
    } else if (!r.recommendType || !r.recommendName) {
      //为空-既没有标准问也没有意图
      (selectFaqModalRef.current as any)?.open({
        selectList: [], //被选中列表
        selectedQuestionKeys: [], // 已选问题
        selectedWishKeys: [], // 已选意图
        question: r.question,
      });
      setOperation('');
      setModalData(r);
    }
  };

  const addBlackList = async (r: any) => {
    let params = {
      robotId: info.id,
      question: r.question,
      unknownId: r.id,
    };

    let res = await addBlack(params);
    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      filtersSelection(r.id);
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const cancelSession = () => {
    setVisibleSession(false);
  };

  const clarify = (r: any) => {
    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      selectedWishKeys: [], // 已选意图
      question: r.question,
    });
    setOperation('clarify');
    setModalData(r);
  };

  const confirmUpdateSelect = async (val: any, inputValue: any) => {
    if (!val.length) {
      message.warning('请选择FAQ/意图');
      return false;
    }
    if (!inputValue) {
      message.warning('请输入相似语料或者相似问');
      return false;
    }
    if (operation == 'addBatch' && inputValue.some((item: any) => item.question == '')) {
      message.warning('请输入相似语料或者相似问');
      return false;
    }
    let resAdd: any = {};
    // 澄清
    if (operation == 'clarify') {
      let addParams = {
        robotId: info.id,
        questionList: [inputValue],
        unknownId: modalData.id,
        clarifyDetailList: val,
      };
      resAdd = await addClearItem(addParams);
      if (resAdd) {
        filtersSelection(modalData?.id);
        actionRef.current.reload();
        return true;
      } else {
        return false;
      }
    } else if (operation == 'addBatch' || operation == '') {
      let params;
      if (operation == 'addBatch') {
        //批量添加
        let temp: any = [];
        inputValue.map((item: any) => {
          temp.push({
            question: item.question,
            unknownId: item.id,
          });
        });
        if (val?.[0]?.recommendType == 2) {
          // 意图
          params = {
            robotId: info.id,
            intentId: val?.[0]?.recommendId,
            corpusTextList: temp,
          };
          resAdd = await intentAddBatch(params);
          // faq
        } else if (val?.[0]?.recommendType == 1) {
          params = {
            robotId: info.id,
            faqId: val?.[0]?.recommendId,
            similarList: temp,
          };
          resAdd = await faqAddBatch(params);
        }
      }
      if (operation == '') {
        //非意图非标准问
        if (val?.[0]?.recommendType == 2) {
          // 意图
          params = {
            robotId: info.id,
            intentId: val?.[0]?.recommendId,
            corpusTextList: [
              {
                question: inputValue,
                unknownId: modalData.id,
              },
            ],
          };
          resAdd = await intentAddBatch(params);
          // faq
        } else if (val?.[0]?.recommendType == 1) {
          params = {
            robotId: info.id,
            faqId: val?.[0]?.recommendId,
            similarList: [
              {
                question: inputValue,
                unknownId: modalData.id,
              },
            ],
          };
          resAdd = await faqAddBatch(params);
        }
      }
      if (resAdd?.resultCode === config.successCode) {
        message.success(resAdd?.resultDesc || '添加成功');
        if (!operation) {
          filtersSelection(modalData.id);
        }
        if (operation) {
          actionRef?.current?.reloadAndRest();
        } else {
          actionRef.current.reload();
        }

        return true;
      } else {
        message.error(resAdd?.resultDesc || '添加失败');
        return false;
      }
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Popconfirm
        title="确认要批量加入黑名单吗？"
        onConfirm={onConfirm}
        onCancel={() => {}}
        okText="确定"
        cancelText="取消"
      >
        <Menu.Item key={'1'}>批量加入黑名单</Menu.Item>
      </Popconfirm>
      <Menu.Item key={'2'}>批量添加</Menu.Item>
    </Menu>
  );

  // orderCode  '1'-分类  '2'-时间
  //  orderType   '1'-升序 '2'-降序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '2', orderType: '2' };
    if (sorter.columnKey === 'faqTypeName' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'faqTypeName' && sorter.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }
    if (sorter.columnKey === 'updateTime' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'updateTime' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  const disabledDate = (current: any) => {
    return current && current > moment().subtract(0, 'days').endOf('day');
  };

  const delQustiopn = async (r: any) => {
    let res = await delUnknownquestion({ id: r.id });
    if (res.resultCode === config.successCode) {
      filtersSelection(r.id);
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const columns: any = [
    {
      dataIndex: 'question',
      title: '客户问题',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'rangeTime',
      title: '选择时间',
      hideInTable: true,
      valueType: 'dateRange',
      search: true,
      width: 200,
      fieldProps: {
        placeholder: ['开始时间', '结束时间'],
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return <RangePicker disabledDate={disabledDate} />;
      },
    },
    {
      dataIndex: 'source',
      title: () => (
        <>
          {'问题来源'}
          <Tip title={'来源可以时“拒识”或“澄清”，表明这条未知问题发生时机器人的回复类型。'} />
        </>
      ),
      ellipsis: true,
      valueType: 'select',
      initialValue: '',
      width: 100,
      valueEnum: {
        1: '澄清',
        2: '拒识',
        '': '全部',
      },
    },
    {
      dataIndex: 'askNum',
      title: '咨询次数',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'faqTypeName',
      title: '分类',
      search: false,
      ellipsis: true,
      width: 100,
      sorter: true,
    },
    {
      dataIndex: 'recommendName',
      title: () => (
        <>
          {'标准问/意图'}
          <Tip title={'由NLU对未知问题进行识别推荐的一条标准问或意图，可供参考'} />
        </>
      ),
      width: 200,
      search: false,
      render: (t: any, r: any, i: any) => {
        return (
          <Fragment>
            <Tooltip title={r.recommendName}>
              <div className={styles.nameBox}>
                <a className={styles.wrapStyle} onClick={() => toStandard(r)}>
                  {r.recommendName}
                </a>
              </div>
            </Tooltip>
          </Fragment>
        );
      },
    },
    {
      dataIndex: 'learnNum',
      title: () => (
        <>
          {'数量'} <Tip title={'标准问/意图”下未知问题的数量'} />
        </>
      ),
      width: 100,
      search: false,
    },
    {
      dataIndex: 'updateTime',
      title: '日期时间',
      search: false,
      ellipsis: true,
      width: 200,
      sorter: true,
    },
    {
      title: () => (
        <>
          {'操作'}
          <Tip
            title={
              <div>
                1.会话记录：可以查看未知问题发生时的上下文，判断具体问题
                <br />
                2.新增标准问：将当前未知问题作为标准问，加入到FAQ，会跳转至新增标准问页面
                <br />
                3.添加：将当前未知问题添加到“标准问/意图”下，作为相似问或意图的语料
                <br />
                4.澄清：将当前未知问题添加到FAQ-澄清
                <br />
                5.黑名单：将当前未知问题添加到FAQ-黑名单
                <br />
                6.删除：删除词条未知问题
              </div>
            }
          />
        </>
      ),
      key: 'option',
      width: 250,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="record" style={{ color: '#52C41A' }} onClick={() => openSession(record)}>
              会话记录
            </a>
            <a key="addStandar" onClick={() => addStandard(record)}>
              新增标准问
            </a>
            <a key="add" onClick={() => addFAQOrSample(record)}>
              添加
            </a>
            <a key="clarify" onClick={() => clarify(record)}>
              澄清
            </a>
            <Popconfirm
              title="点击【确定】将该问题加入黑名单。"
              onConfirm={() => addBlackList(record)}
              onCancel={() => {}}
              okText="确定"
              cancelText="取消"
            >
              <a key="black" style={{ color: '#FF4D4F' }}>
                黑名单
              </a>
            </Popconfirm>
            <Popconfirm
              title="确认删除该未知问题？"
              onConfirm={() => delQustiopn(record)}
              onCancel={() => {}}
              okText="确定"
              cancelText="取消"
            >
              <a key="black" style={{ color: '#FF4D4F' }}>
                删除
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <Fragment>
      <div className={styles.unknowPage}>
        <ProTable
          headerTitle={
            <Fragment>
              <span className={styles.topTitle}>
                未知问题待学习<span className={styles.titleNum}>{learnNum}</span>条, 涉及标准问
                <span className={styles.titleNum}>{standardNum}</span>条
                <Tip
                  title={
                    '当客户进行询问，机器人回复澄清或者拒识，且这条文本在所有的意图语料、标准问、相似问、FAQ-澄清、FAQ-黑名单页面中均不存在时，这条文本被认定为未知问题，进入此列表。'
                  }
                />
              </span>
            </Fragment>
          }
          rowKey={'id'}
          actionRef={actionRef}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          pagination={{
            pageSize: 10,
          }}
          params={paramsObj}
          onChange={tableChange}
          rowSelection={rowSelection}
          // tableAlertOptionRender={false}
          // tableAlertRender={false}
          toolBarRender={() => [
            <Dropdown overlay={menu} key="Dropdown" disabled={selectRow?.length < 1}>
              <Button type="primary">
                <Space>
                  批量操作
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={async (params) => {
            return getInitTable(params);
          }}
        />
      </div>
      <SessionRecord visible={visibleSession} onCancel={cancelSession} modalData={modalData} />
      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        type={operation == 'clarify' ? 'checkbox' : 'radio'}
        min={operation == 'clarify' ? 2 : 1}
        max={operation == 'clarify' ? (info.robotType == 1 ? 2 : 5) : 1}
        readOnly={false}
        tableLoading={addClearLoading || batchLoading}
      />
    </Fragment>
  );
};
