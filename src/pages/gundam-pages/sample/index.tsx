import config from '@/config';
import { ArrowLeftOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Input, Menu, message, Popconfirm, Space } from 'antd';
import { Fragment, useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import SelectFaqModal from '../FAQ-module/components/select-faq-modal';
import RemoveCom from './components/removeCom';
import RemoveSimilar from './components/removeSimilar';
import SameModal from './components/sameModal';
import SimilarCom from './components/similarCom';
import styles from './index.less';
import { useSampleModel, useSimilarModel } from './model';

const { Search } = Input;

export default () => {
  const actionRef = useRef<any>();
  const input = useRef<any>();
  const RemoveSRef = useRef<any>();
  const selectFaqModalRef = useRef<any>();

  const [similar, setSimmilar] = useState<boolean>(false);
  const [similarVisible, setSimilarVisible] = useState<boolean>(false);
  const [columns, setcolumns] = useState<any>([]);
  const [getViewNum, setGetViewNum] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

  const [pageType, setPageType] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<any>();
  const [pageUrl, setPageUrl] = useState<string>('');

  const [inputValue, setInputValue] = useState<string>('');

  const [corpusText, setCorpusText] = useState<string>('');

  const [similarTableData, setSimilarTableData] = useState<any>({});

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getList, intentEdit, deleteIntentFeature, checkIntent, intentAdd, loadingAdd } =
    useSampleModel();

  const {
    getSimilarList,
    checkSimilar,
    editSimilar,
    deleteSimilar,
    addSimilar,
    batchDeleteSimilar,
    batchTransferSimilar,
    addLoading,
  } = useSimilarModel();

  useEffect(() => {
    let historyData = history?.location || {};
    let pageType = historyData?.state?.pageType || '';
    let searchText = historyData?.state?.searchText || '';
    let tableInfo = historyData?.state?.info;
    let pageUrl = historyData?.state?.pageUrl;
    setPageUrl(pageUrl);
    setInputValue(searchText);
    console.log(history);
    setPageType(pageType);
    setTableInfo(tableInfo);

    if (pageType === 'wish') {
      setcolumns(tableListWish);
    }
    if (pageType === 'FAQ') {
      setcolumns(tableListFAQ);
    }
  }, [history]);

  useEffect(() => {
    if (pageType === 'wish') {
      setcolumns(tableListWish);
    }
    if (pageType === 'FAQ') {
      setcolumns(tableListFAQ);
    }
    actionRef?.current?.reload();
    console.log(tableInfo, pageType);
  }, [tableInfo, pageType]);

  const handleMenuClick = async (item: any) => {
    if (selectRow.length > 0) {
      if (item.key == '1') {
        RemoveSRef?.current?.open(selectRow, 'batch');
      }
    } else {
      message.warning('至少选择一个问题');
    }
  };

  const onConfirm = async () => {
    await batchDeleteSimilar({
      ids: selectedRowKeys,
      faqId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
    }).then((res) => {
      if (res) {
        setSelectedRowKeys([]);
        setSelectRow([]);
        actionRef.current.reload();
      }
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={'1'}>批量转移</Menu.Item>
      <Popconfirm
        title="确认要批量删除选中的相似问吗？"
        onConfirm={onConfirm}
        okText="确定"
        cancelText="取消"
      >
        <Menu.Item key={'2'}>批量删除</Menu.Item>
      </Popconfirm>
    </Menu>
  );

  const getInitTable = async (payload: any) => {
    let res: any;
    if (pageType === 'wish') {
      let params: any = {
        page: payload.current,
        pageSize: payload.pageSize,
        intentId:
          pageUrl === 'unknownQustion'
            ? tableInfo.recommendId
            : tableInfo.id
            ? tableInfo.id
            : tableInfo.intentId,
        corpusText: payload.corpusText,
      };
      res = await getList(params);
    }

    if (pageType === 'FAQ') {
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        similarText: payload?.corpusText || '',
        faqId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
        robotId: info.id,
      };
      res = await getSimilarList(params);
    }

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const onSearch = (value: string) => {
    actionRef.current.reload();
  };

  const changeCorpusText = (e: any) => {
    setInputValue(e.target.value);
    setSimmilar(false);
  };

  const add = async () => {
    console.log(input?.current);
    input?.current?.input;
    // setInputValue(input?.current?.state?.value);
    if (inputValue) {
      let res: any;
      if (pageType === 'wish') {
        let params = {
          robotId: tableInfo?.robotId || info?.id,
          corpusText: inputValue,
          intentId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
          intentName: tableInfo.intentName || tableInfo.recommendName,
        };
        res = await checkIntent(params);
      }
      if (pageType === 'FAQ') {
        let params = {
          robotId: tableInfo.robotId,
          similarText: inputValue || '',
          faqId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
        };
        res = await checkSimilar(params);
      }

      if (res.resultCode === config.successCode) {
        //检测通过新增
        if (pageType === 'wish') {
          intentCorpusAdd();
        } else {
          similarAdd();
        }
      } else if (res.resultCode === '0001') {
        //不通过有相似
        setSimmilar(true);
        setSimilarVisible(true);
        setSimilarTableData(res?.data);
      } else {
        message.error(res.resultCode);
      }
    } else {
      message.warning('请先输入语料文本');
    }
  };

  const intentCorpusAdd = async () => {
    let addParams = {
      robotId: tableInfo.robotId || info.id,
      intentId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
      corpusText: inputValue,
      unknownId: history?.location?.state?.info?.id,
    };
    let resAdd = await intentAdd(addParams);
    if (resAdd.resultCode === config.successCode) {
      setSimmilar(false);
      setSimilarVisible(false);
      setInputValue('');

      message.success(resAdd.resultDesc || '添加成功');
      actionRef.current.reload();
    } else {
      message.error(resAdd.resultDesc || '添加失败');
    }
  };

  const similarAdd = async () => {
    let addParams = {
      faqId: pageUrl === 'unknownQustion' ? tableInfo.recommendId : tableInfo.id,
      similarText: inputValue,
      robotId: info.id,
      unknownId: history?.location?.state?.info?.id,
    };
    let resAdd = await addSimilar(addParams);
    if (resAdd.resultCode === config.successCode) {
      setSimmilar(false);
      setSimilarVisible(false);
      setInputValue('');
      message.success(resAdd.resultDesc || '添加成功');
      actionRef.current.reload();
    } else {
      message.error(resAdd.resultDesc || '添加失败');
    }
  };

  const edit = (action: any, record: any) => {
    action?.startEditable?.(record.id);
  };

  const removeWish = (record: any) => {
    setVisible(true);
    setModalData(record);
  };

  const close = () => {
    setVisible(false);
  };

  const closeSame = () => {
    setSimilarVisible(false);
  };

  const save = async (value: any) => {
    let params: any = {
      id: modalData.id,
      intentId: value.nextIntent,
      corpusText: value.corpusText,
      robotId: info.id,
    };
    let res = await intentEdit(params);
    if (res.resultCode == config.successCode) {
      message.success(res?.resultDesc || '成功');
      setVisible(false);
      actionRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc);
    }
  };

  const saveSame = async (record: any) => {
    if (pageType === 'FAQ') {
      similarAdd();
    }

    if (pageType === 'wish') {
      intentCorpusAdd();
    }
  };

  const removeFAQ = (record: any) => {
    RemoveSRef?.current?.open(record);
  };

  const deleteRow = async (record: any) => {
    console.log('pageType', pageType);
    if (pageType === 'FAQ' || history?.location?.state?.pageType === 'FAQ') {
      let reqData: any = {
        id: record.id,
      };
      await deleteSimilar(reqData).then((res) => {
        if (res.resultCode == config.successCode) {
          message.success(res.resultDesc);
          actionRef.current.reload();
        } else {
          message.error(res.resultDesc);
        }
      });
    }

    if (pageType === 'wish' || history?.location?.state?.pageType === 'wish') {
      let res = await deleteIntentFeature({ id: record.id });
      if (res.resultCode == config.successCode) {
        message.success(res.resultDesc);
        actionRef.current.reload();
      } else {
        message.error(res.resultDesc);
      }
    }
  };

  const saveRow = async (record: any, conf: any) => {
    let editValue = conf?.form?.getFieldsValue?.()?.[conf.recordKey];

    if (record.similarText?.length > 200) {
      record.similarText = record.similarText?.slice(0, 200);
    }
    if (record.corpusText?.length > 200) {
      record.corpusText = record.corpusText?.slice(0, 200);
    }
    if (pageType === 'FAQ') {
      let reqData: any = {
        id: record.id,
        similarText: editValue?.similarText,
        viewNum: record.viewNum,
        faqId: tableInfo?.id,
      };
      await editSimilar(reqData).then((res) => {
        console.log(res);
        console.log(config);

        if (res.resultCode == config.successCode) {
          message.success(res?.resultDesc || '成功');
          actionRef?.current?.cancelEditable?.(record.id);
          actionRef.current.reload();
        } else {
          message.error(res?.resultDesc);
        }
      });
    }
    if (pageType === 'wish') {
      let params: any = {
        id: record.id,
        intentId: record.intentId,
        corpusText: editValue?.corpusText,
        robotId: info.id,
      };
      let res = await intentEdit(params);
      if (res.resultCode == config.successCode) {
        message.success(res?.resultDesc || '成功');
        actionRef?.current?.cancelEditable?.(record.id);
        actionRef.current.reload();
      } else {
        message.error(res?.resultDesc);
      }
    }

    return true;
  };

  const onChange = (e: any) => {
    setCorpusText(e.target.value);
  };

  const refresh = (r: any, pageType: any) => {
    setTableInfo(r);
    setPageType(pageType);
    setSimmilar(false);
    actionRef?.current?.reload();
  };

  const editRemove = async (id: any, faqId: any) => {
    if (!faqId) {
      message.warning('请选择问题');
      return;
    }
    await editSimilar({ id, faqId }).then((res) => {
      if (res.resultCode == config.successCode) {
        message.success(res.resultDesc);
        RemoveSRef?.current?.close();
        actionRef?.current?.reload();
      } else {
        message.error(res.resultDesc);
      }
    });
  };

  const similarBatchRemove = async (id: any, faqId: any, oldFaqId: any) => {
    if (!faqId) {
      message.warning('请选择问题');
      return;
    }
    await batchTransferSimilar({ similarIds: id, faqId, oldFaqId, robotId: info.id }).then(
      (res) => {
        if (res) {
          setSelectedRowKeys([]);
          setSelectRow([]);
          RemoveSRef?.current?.close();
          actionRef?.current?.reload();
        }
      },
    );
  };

  //添加到其他意图/FAQ
  const confirmUpdateSelect = async (val: any, inputValue: any) => {
    console.log(val);
    if (!val.length) {
      message.warning('请选择FAQ/意图');
      return false;
    }
    if (!inputValue) {
      message.warning('请输入相似语料或者相似问');
      return false;
    }
    let resAdd: any;
    if (val?.[0]?.recommendType == 1) {
      let addParams = {
        faqId: val?.[0]?.recommendId,
        similarText: inputValue,
        robotId: info.id,
        unknownId: history?.location?.state?.info?.id,
      };
      //FAQ
      resAdd = await addSimilar(addParams);
    } else if (val?.[0]?.recommendType == 2) {
      let addParams = {
        robotId: info.id,
        intentId: val?.[0]?.recommendId,
        corpusText: inputValue,
        unknownId: history?.location?.state?.info?.id,
      };
      //意图
      resAdd = await intentAdd(addParams);
    }
    if (resAdd?.resultCode === config.successCode) {
      setSimmilar(false);
      setSimilarVisible(false);
      setInputValue('');
      message.success(resAdd?.resultDesc || '添加成功');
      actionRef.current.reload();
      return true;
    } else {
      message.error(resAdd?.resultDesc || '添加失败');
      return false;
    }
  };

  const getName = () => {
    let name: string = '';
    if (pageType === 'wish') {
      if (pageUrl === 'unknownQustion') {
        name = tableInfo?.recommendName;
      } else {
        name = tableInfo?.intentName;
      }
    } else if (pageType === 'FAQ') {
      if (pageUrl === 'unknownQustion') {
        name = tableInfo?.recommendName;
      } else {
        name = tableInfo?.question;
      }
    }
    return name;
  };

  const tableListWish: any = [
    {
      dataIndex: 'corpusText',
      title: '语料文本',
      ellipsis: true,
      fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'creator',
      title: '更新人',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      dataIndex: 'createTime',
      title: '添加时间',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="editable" onClick={() => edit(action, record)}>
              编辑
            </a>
            <a key="movetable" onClick={() => removeWish(record)}>
              转移
            </a>
            <Popconfirm
              title="确认删除该语料文本吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => {
                deleteRow(record);
              }}
            >
              <Button type="link" style={{ color: 'red' }}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //相似问
  const tableListFAQ: any = [
    {
      dataIndex: 'similarText',
      title: '相似问法',
      ellipsis: true,
      fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'viewNum',
      title: '浏览次数',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        console.log(tableInfo);

        if (history?.location?.state?.info?.recycle == 1) {
          return (
            <Space>
              <a key="editable">编辑</a>
              <a key="movetable">转移</a>

              <a style={{ color: 'red' }}>删除</a>
            </Space>
          );
        } else {
          return (
            <Space>
              <a key="editable" onClick={() => edit(action, record)}>
                编辑
              </a>
              <a
                key="moveable"
                onClick={() => {
                  removeFAQ(record);
                }}
              >
                转移
              </a>
              <Popconfirm
                title="确认删除该条相似问吗?"
                okText="是"
                cancelText="否"
                onCancel={() => {}}
                onConfirm={() => deleteRow(record)}
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </Space>
          );
        }
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  return (
    <Fragment>
      <div className={styles.sample}>
        {/* <div className={styles.sample_flex}> */}
        <div className={styles.left_box}>
          <div className={styles.title}>
            <div>
              <ArrowLeftOutlined
                style={{ marginRight: '6px', color: '#1890ff' }}
                onClick={() => {
                  if (pageType === 'FAQ') {
                    if (tableInfo?.recycle == 1) {
                      history.push('/gundamPages/faq/recycle');
                    } else {
                      history.push('/gundamPages/faq/main');
                    }
                    if (pageUrl === 'unknownQustion') {
                      history.push('/gundamPages/knowledgeLearn/unknowQuestion');
                    }
                  } else if (pageType === 'wish') {
                    if (pageUrl === 'unknownQustion') {
                      history.push('/gundamPages/knowledgeLearn/unknowQuestion');
                    } else {
                      history?.goBack();
                    }
                  } else {
                  }
                }}
              />
              {getName()}
            </div>
            {pageType == 'FAQ' && (
              <div style={{ fontSize: '14px' }}>
                <EyeOutlined /> {tableInfo?.viewNum ?? '-'}
              </div>
            )}
          </div>
          <div className={styles.search_box}>
            <div style={{ flex: 1 }}>
              {tableInfo?.recycle != 1 && (
                <Input
                  ref={input}
                  value={inputValue}
                  placeholder={
                    // "输入语料意图"
                    pageType === 'wish'
                      ? '输入语料意图'
                      : pageType === 'FAQ'
                      ? '输入相似问法'
                      : '请输入'
                  }
                  allowClear
                  maxLength={200}
                  onChange={changeCorpusText}
                />
              )}
            </div>
            <div style={{ margin: '0 16px' }}>
              <Space>
                {tableInfo?.recycle != 1 && (
                  <Button
                    type="primary"
                    onClick={add}
                    loading={pageType == 'wish' ? loadingAdd : addLoading}
                  >
                    添加
                  </Button>
                )}
                {tableInfo?.recycle != 1 && (
                  <Button
                    onClick={() => {
                      (selectFaqModalRef.current as any)?.open({
                        selectList: [], //被选中列表
                        selectedQuestionKeys: [], // 已选问题
                        selectedWishKeys: [], // 已选意图
                        question: inputValue,
                      });
                    }}
                    loading={pageType == 'wish' ? loadingAdd : addLoading}
                  >
                    其他意图/FAQ
                  </Button>
                )}
                {tableInfo?.recycle != 1 && pageType === 'FAQ' && (
                  <Dropdown overlay={menu} key="Dropdown" disabled={selectRow?.length < 1}>
                    <Button loading={addLoading}>
                      <Space>
                        批量操作
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                )}
              </Space>
            </div>
            <div>
              <Search
                placeholder={
                  pageType === 'wish'
                    ? '搜索语料意图'
                    : pageType === 'FAQ'
                    ? '搜索相似问法'
                    : '请输入'
                }
                onSearch={onSearch}
                onChange={onChange}
                allowClear
              />
            </div>
          </div>
          <ProTable
            rowKey={'id'}
            key={'id'}
            scroll={{ x: columns.length * 200 }}
            actionRef={actionRef}
            rowSelection={pageType == 'FAQ' ? rowSelection : false}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            options={false}
            editable={{
              type: 'single',
              actionRender: (row, config, dom) => [
                <a
                  onClick={() => {
                    saveRow(row, config);
                  }}
                >
                  保存
                </a>,
                // dom.save,
                dom.cancel,
              ],
              // onSave: (key: any, row: any, originRow: any, newLine?: any) => {
              //   // if (row.similarText && row.similarText == originRow.similarText) {
              //   //   console.log(row, originRow);
              //   //   return;
              //   // }
              //   // if (row.corpusText && row.corpusText == originRow.corpusText) {
              //   //   return;
              //   // }
              //   return saveRow(row);
              // },
            }}
            request={async (params) => {
              return getInitTable({ corpusText: corpusText, ...params });
            }}
          />
        </div>
        {similar && (
          <SimilarCom
            tableInfo={tableInfo}
            inputValue={inputValue}
            similarTableData={similarTableData}
            refresh={refresh}
            pageType={pageType}
          />
        )}
      </div>
      <RemoveCom visible={visible} modalData={modalData} close={close} save={save} />
      <SameModal
        visible={similarVisible}
        cancel={closeSame}
        saveSame={saveSame}
        pageType={pageType}
      />
      <RemoveSimilar
        cref={RemoveSRef}
        onSubmit={editRemove}
        onBatchSubmit={similarBatchRemove}
        loading={addLoading}
      />
      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        type={'radio'}
        min={1}
        max={1}
        readOnly={false}
        showOther={true}
      />
    </Fragment>
  );
};
