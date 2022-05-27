import { Input, Button, Row, Col, Space, Popconfirm, message } from 'antd';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { useModel, history } from 'umi';
import { useSampleModel, useSimilarModel } from './model';
import SimilarCom from './components/similarCom';
import RemoveCom from './components/removeCom';
import SameModal from './components/sameModal';
import styles from './index.less';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import config from '@/config';
import RemoveSimilar from './components/removeSimilar';

const { Search } = Input;

export default () => {
  const actionRef = useRef<any>();
  const input = useRef<any>();
  const RemoveSRef = useRef<any>();

  const [similar, setSimmilar] = useState<boolean>(false);
  const [similarVisible, setSimilarVisible] = useState<boolean>(false);
  const [columns, setcolumns] = useState<any>([]);
  const [getViewNum, setGetViewNum] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

  const [pageType, setPageType] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<any>();

  const [inputValue, setInputValue] = useState<string>('');

  const [corpusText, setCorpusText] = useState<string>('');

  const [similarTableData, setSimilarTableData] = useState<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getList, intentEdit, deleteIntentFeature, checkIntent, intentAdd, loadingAdd } =
    useSampleModel();

  const { getSimilarList, checkSimilar, editSimilar, deleteSimilar, addSimilar, addLoading } =
    useSimilarModel();

  useEffect(() => {
    let historyData = history?.location || {};
    let pageType = historyData?.state?.pageType || '';
    console.log(history);
    setPageType(pageType);
    setTableInfo(historyData?.state?.info);

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

  const getInitTable = async (payload: any) => {
    let res: any;
    if (pageType === 'wish') {
      let params: any = {
        page: payload.current,
        pageSize: payload.pageSize,
        intentId: tableInfo.id || tableInfo.intentId,
        corpusText: payload.corpusText,
      };
      res = await getList(params);
    }

    if (pageType === 'FAQ') {
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        similarText: payload?.corpusText || '',
        faqId: tableInfo?.id,
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
          intentId: tableInfo.id,
          intentName: tableInfo.intentName,
        };
        res = await checkIntent(params);
      }
      if (pageType === 'FAQ') {
        let params = {
          robotId: tableInfo.robotId,
          similarText: inputValue || '',
          faqId: tableInfo?.id,
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
      intentId: tableInfo.id,
      corpusText: inputValue,
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
      faqId: tableInfo?.id,
      similarText: inputValue,
      robotId: info.id,
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
      // let reqData: any = {
      //   faqId: tableInfo.id,
      //   similarText: inputValue,
      //   robotId: info.id,
      // };
      // await addSimilar(reqData).then((res) => {
      //   if (res.resultCode == config.successCode) {
      //     message.success(res.resultDesc);
      //     actionRef.current.reload();
      //   } else {
      //     message.error(res.resultDesc);
      //   }
      // });
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

  const saveRow = async (record: any) => {
    if (record.similarText?.length > 200) {
      record.similarText = record.similarText?.slice(0, 200);
    }
    if (record.corpusText?.length > 200) {
      record.corpusText = record.corpusText?.slice(0, 200);
    }
    if (pageType === 'FAQ') {
      let reqData: any = {
        id: record.id,
        similarText: record.similarText,
        viewNum: record.viewNum,
        faqId: tableInfo?.id,
      };
      await editSimilar(reqData).then((res) => {
        if (res.resultCode == config.successCode) {
          message.success(res?.resultDesc || '成功');
          actionRef.current.reload();
        } else {
          message.error(res?.resultDesc);
          // setTimeout(() => {
          //   actionRef?.current?.startEditable?.(record.id);
          // }, 1);
        }
      });
    }
    if (pageType === 'wish') {
      let params: any = {
        id: record.id,
        intentId: record.intentId,
        corpusText: record.corpusText,
        robotId: info.id,
      };
      let res = await intentEdit(params);
      if (res.resultCode == config.successCode) {
        message.success(res?.resultDesc || '成功');
        actionRef.current.reload();
      } else {
        message.error(res?.resultDesc);
        // setTimeout(() => {
        //   actionRef?.current?.startEditable?.(record.id);
        // }, 1);
      }
    }
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
            <a key="editable" onClick={() => removeWish(record)}>
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
              <a key="editable">转移</a>

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
                key="editable"
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
                  } else {
                    history?.goBack();
                  }
                }}
              />
              {pageType === 'wish'
                ? tableInfo?.intentName
                : pageType === 'FAQ'
                ? tableInfo?.question
                : '问题名称'}
            </div>
            {pageType == 'FAQ' && (
              <div style={{ fontSize: '14px' }}>
                <EyeOutlined /> {tableInfo?.viewNum ?? '-'}
              </div>
            )}
          </div>
          <Row className={styles.search_box}>
            <Col span={14}>
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
            </Col>
            <Col span={3}>
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
                {/* {similar && (
                  <Button type="primary" onClick={stillAdd}>
                    仍然添加
                  </Button>
                )}
                {similar && <Button onClick={cancelAdd}>取消</Button>} */}
              </Space>
            </Col>
            <Col span={6}>
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
            </Col>
          </Row>
          <ProTable
            rowKey={(record) => record?.id}
            scroll={{ x: columns.length * 200 }}
            actionRef={actionRef}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            options={false}
            editable={{
              type: 'single',
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
              onSave: (key: any, row: any, originRow: any, newLine?: any) => {
                // if (row.similarText && row.similarText == originRow.similarText) {
                //   console.log(row, originRow);
                //   return;
                // }
                // if (row.corpusText && row.corpusText == originRow.corpusText) {
                //   return;
                // }
                return saveRow(row);
              },
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
      <RemoveSimilar cref={RemoveSRef} onSubmit={editRemove} />
    </Fragment>
  );
};
