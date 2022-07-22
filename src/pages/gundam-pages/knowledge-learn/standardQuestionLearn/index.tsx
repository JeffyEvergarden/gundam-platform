import config from '@/config';
import { useTableModel } from '@/pages/gundam-pages/FAQ-module/clearlist/model';
import AnswerView from '@/pages/gundam-pages/FAQ-module/components/answerView-modal';
import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { useSampleModel, useSimilarModel } from '@/pages/gundam-pages/sample/model';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, message, Modal, Popconfirm, Space } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import EditPass from './../component/editPass';
import SessionRecord from './../component/sessionRecord';
import { useUnknownQuestion } from './../unknowQuestion/model';
import styles from './index.less';
import { useStandard } from './model';

export default () => {
  const actionRef = useRef<any>();
  const answerViewRef = useRef<any>(null);
  const selectFaqModalRef = useRef<any>();

  const { getListUnknown } = useStandard();
  const { getSimilarList, addSimilar } = useSimilarModel();
  const { getList, intentAdd } = useSampleModel();
  const { intentAddBatch, faqAddBatch, addBlack } = useUnknownQuestion();
  const { addClearItem } = useTableModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);
  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});
  const [menulabel, setMenuLabel] = useState<string>('批量处理');
  const [rowInfo, setRowInfo] = useState<any>({});
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '1', orderType: '2' });

  const [visible, setVisible] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<any>({});

  const [editVisible, setVisibleEdit] = useState<boolean>(false);

  const [operation, setOperation] = useState<string>('');

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  useEffect(() => {
    let historyData = history?.location || {};
    let rowInfo = historyData?.state?.rowInfo || {};
    setRowInfo(rowInfo);
  }, [history]);

  const getInitTable = async (payload: any) => {
    let params = {
      page: payload.current,
      pageSize: payload.pageSize,
      robotId: info.id,
      recommendId: rowInfo.recommendId,
      recommendType: rowInfo.recommendType,
      orderType: payload.orderType,
      orderCode: payload.orderCode,
    };
    let res = await getListUnknown(params);
    setPageInfo(res?.data);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const handleMenuClick = (item: any) => {
    if (item.key == '1') {
      if (selectRow?.length > 0) {
        setMenuLabel('批量转移');
        setOperation('addBatch');
        (selectFaqModalRef.current as any)?.open({
          selectList: [], //被选中列表
          selectedQuestionKeys: [], // 已选问题
          selectedWishKeys: [], // 已选意图
          question: '批量转移',
          operation: 'batch',
          questionList: selectRow,
        });
      } else {
        message.warning('请至少选择一条数据');
      }
    }
  };

  const openSession = (r: any) => {
    setVisibleSession(true);
    setModalData(r);
  };

  const cancelSession = () => {
    setVisibleSession(false);
  };

  const onConfirm = async () => {
    if (selectRow?.length > 0) {
      setMenuLabel('批量通过');
      let res;
      let temp: any = [];
      selectRow.map((item: any) => {
        temp.push({
          question: item.question,
          unknownId: item?.id,
        });
      });
      if (rowInfo.recommendType == '1') {
        //标准问
        let params = {
          robotId: info.id,
          faqId: rowInfo?.recommendId,
          corpusTextList: temp,
        };
        res = await faqAddBatch(params);
      }
      if (rowInfo.recommendType == '2') {
        //意图
        let params = {
          robotId: info.id,
          intentId: rowInfo?.recommendId,
          corpusTextList: temp,
        };
        res = await intentAddBatch(params);
      }
      if (res.resultCode === config.successCode) {
        message.success(res?.resultDesc || '成功');
        actionRef?.current?.reloadAndRest();
      } else {
        message.error(res?.resultDesc || '失败');
      }
    } else {
      message.warning('请至少选择一条数据');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={'1'}>批量转移</Menu.Item>
      <Popconfirm
        title="确认要批量通过吗？"
        onConfirm={onConfirm}
        onCancel={() => {}}
        okText="通过"
        cancelText="取消"
      >
        <Menu.Item key={'2'}>批量通过</Menu.Item>
      </Popconfirm>
    </Menu>
  );

  // orderCode  '1'-分类  '2'-时间
  //  orderType   '1'-升序 '2'-降序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '1', orderType: '2' };
    if (sorter.columnKey === 'createTime' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'createTime' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  const viewAnswer = () => {
    answerViewRef?.current?.open(rowInfo);
  };

  const viewFAQOrIntent = async () => {
    setVisible(true);
  };

  const getListFAQOrIntent = async (payload: any) => {
    let res;
    if (rowInfo.recommendType == '1') {
      //相似问
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        faqId: rowInfo?.recommendId,
        robotId: info.id,
      };
      res = await getSimilarList(params);
    } else if (rowInfo.recommendType == '2') {
      // 意图
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        intentId: rowInfo?.recommendId,
      };
      res = await getList(params);
    }
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const editPass = (r: any) => {
    setVisibleEdit(true);
    setModalData(r);
  };

  const cancelEdit = () => {
    setVisibleEdit(false);
  };

  const save = async (val: any) => {
    let res;
    if (modalData.recommendType == '1') {
      //标准问
      let params = {
        robotId: info.id,
        faqId: modalData?.recommendId,
        similarList: [
          {
            question: val.nowquestion,
            unknownId: modalData?.id,
          },
        ],
      };
      res = await faqAddBatch(params);
    }
    if (modalData.recommendType == '2') {
      //意图
      let params = {
        robotId: info.id,
        intentId: modalData?.recommendId,
        corpusTextList: [
          {
            question: val.nowquestion,
            unknownId: modalData?.id,
          },
        ],
      };
      res = await intentAddBatch(params);
    }
    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      setVisibleEdit(false);
      actionRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const remove = async (r: any) => {
    setModalData(r);
    setOperation('remove');
    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      selectedWishKeys: [], // 已选意图
      question: r.question,
      operation: 'single',
      questionList: [],
    });
  };

  const clarify = (r: any) => {
    setOperation('clarify');
    setModalData(r);
    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      selectedWishKeys: [], // 已选意图
      question: r.question,
      operation: 'single',
      questionList: [],
    });
  };

  const confirmUpdateSelect = async (val: any, inputValue: any) => {
    if (!val.length) {
      message.warning('请选择FAQ/意图');
      return;
    }
    if (!inputValue) {
      message.warning('请输入相似语料或者相似问');
      return;
    }
    let resAdd: any;
    // 转移
    if (operation == 'remove') {
      if (val?.[0]?.recommendType == 2) {
        //意图
        let addParams = {
          robotId: info.id,
          intentId: val?.[0]?.recommendId,
          corpusText: inputValue,
          unknownId: modalData.id,
        };
        resAdd = await intentAdd(addParams);
      } else if (val?.[0]?.recommendType == 1) {
        //faq
        let addParams = {
          faqId: val?.[0]?.recommendId,
          similarText: inputValue,
          robotId: info.id,
          unknownId: modalData.id,
        };
        resAdd = await addSimilar(addParams);
      }
      if (resAdd?.resultCode === config.successCode) {
        message.success(resAdd?.resultDesc || '成功');
        actionRef.current.reloadAndRest();
      } else {
        message.error(resAdd?.resultDesc || '失败');
      }
      //批量转移
    } else if (operation == 'addBatch') {
      let temp: any = [];
      inputValue.map((item: any) => {
        temp.push({
          question: item.question,
          unknownId: item.id,
        });
      });

      if (val?.[0]?.recommendType == 2) {
        // 意图
        let params = {
          robotId: info.id,
          intentId: val?.[0]?.recommendId,
          corpusTextList: temp,
        };
        resAdd = await intentAddBatch(params);
        // faq
      } else if (val?.[0]?.recommendType == 1) {
        let params = {
          robotId: info.id,
          faqId: val?.[0]?.recommendId,
          similarList: temp,
        };
        resAdd = await faqAddBatch(params);
      }
      if (resAdd?.resultCode === config.successCode) {
        message.success(resAdd?.resultDesc || '成功');
        actionRef.current.reloadAndRest();
      } else {
        message.error(resAdd?.resultDesc || '失败');
      }
    } else if (operation == 'clarify') {
      // 澄清
      let addParams = {
        robotId: info.id,
        question: modalData.question,
        unknownId: modalData.id,
        clarifyDetailList: val,
      };
      resAdd = await addClearItem(addParams);
      resAdd && actionRef.current.reloadAndRest();
    }
  };

  const addStandard = (r: any) => {
    history.push({
      pathname: '/gundamPages/faq/board',
      state: {
        pageUrl: 'standardQuestionLearn',
        payload: r,
      },
    });
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
      actionRef?.current?.reloadAndRest();
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
      dataIndex: 'askNum',
      title: '咨询次数',
      search: false,
      ellipsis: true,
      width: 100,
    },
    // {
    //   dataIndex: 'channelCode',
    //   title: '渠道',
    //   search: false,
    //   ellipsis: true,
    //   width: 100,
    // },
    {
      dataIndex: 'source',
      title: '问题来源',
      ellipsis: true,
      valueType: 'select',
      width: 100,
      valueEnum: {
        1: '澄清',
        2: '拒识',
      },
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
      title: '操作',
      key: 'option',
      width: 300,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="record" style={{ color: '#52C41A' }} onClick={() => openSession(record)}>
              会话记录
            </a>
            <a key="edit" onClick={() => editPass(record)}>
              编辑通过
            </a>
            <a key="remove" onClick={() => remove(record)}>
              转移
            </a>
            <a key="addStandar" onClick={() => addStandard(record)}>
              新增标准问
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
          </Space>
        );
      },
    },
  ];

  const columnsFAQOrIntent: any = [
    {
      dataIndex: 'question',
      title: '序号',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return (Number(pageInfo.page) - 1) * Number(pageInfo.pageSize) + Number(i) + 1;
      },
    },
    {
      dataIndex: 'Similar',
      title: '相似问',
      ellipsis: true,
      render: (t: any, r: any, i: any) => {
        return <span>{rowInfo.recommendType == '1' ? r.similarText : r.corpusText}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <div className={styles.stardard}>
        <div className={styles.topBox}>
          <div>
            <ArrowLeftOutlined
              style={{ marginRight: '6px', color: '#1890ff' }}
              onClick={() => {
                history.push('/gundamPages/knowledgeLearn/unknowQuestion');
              }}
            />
            问题: {rowInfo?.recommendName}
          </div>
          <div style={{ fontSize: '14px' }}>
            <Space>
              {rowInfo?.recommendType == '1' && (
                <Fragment>
                  <a onClick={viewAnswer}>查看答案</a>
                  <Divider type="vertical" />
                </Fragment>
              )}
              <a onClick={viewFAQOrIntent}>
                现有{rowInfo.recommendType == '1' ? '相似问' : '样本'}
              </a>
            </Space>
          </div>
        </div>
        <ProTable
          headerTitle={'未知问题列表'}
          rowKey={'id'}
          actionRef={actionRef}
          onChange={tableChange}
          params={paramsObj}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          search={false}
          pagination={{
            pageSize: 10,
          }}
          tableAlertRender={false}
          tableAlertOptionRender={false}
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
          rowSelection={rowSelection}
        />
      </div>{' '}
      <SessionRecord visible={visibleSession} onCancel={cancelSession} modalData={modalData} />
      <AnswerView cref={answerViewRef} pageType={'standardQuestionLearn'} />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
        title={rowInfo.recommendType == '1' ? '相似问' : '样本'}
        footer={null}
        width={600}
      >
        <ProTable
          rowKey={(record: any) => record.id}
          headerTitle={false}
          toolBarRender={false}
          bordered
          // actionRef={actionRefFAQOrIntent}
          pagination={{
            pageSize: 10,
          }}
          search={false}
          columns={columnsFAQOrIntent}
          request={async (params = {}) => {
            return getListFAQOrIntent(params);
          }}
        />
      </Modal>
      <EditPass visible={editVisible} onCancel={cancelEdit} modalData={modalData} save={save} />
      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        type={operation == 'clarify' ? 'checkbox' : 'radio'}
        min={operation == 'clarify' ? 2 : 1}
        max={operation == 'clarify' ? 5 : 1}
        readOnly={false}
      />
    </Fragment>
  );
};
