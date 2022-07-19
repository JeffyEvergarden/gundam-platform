import Condition from '@/components/Condition';
import { DeleteOutlined, MonitorOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Table, Tabs, Tooltip } from 'antd';
import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useModel } from 'umi';
import MyTree from '../../../FAQ/FAQ-manage/components/my-tree';
import { useFaqModal } from '../../../FAQ/FAQ-manage/model';
import style from './style.less';

const { TabPane } = Tabs;

const columns1: any[] = [
  // 问题列表-列
  {
    title: '问题名称',
    dataIndex: 'question',
    width: 300,
  },

  {
    title: '时间',
    dataIndex: 'updateTime',
    width: 180,
  },
];

const columns2: any[] = [
  // 业务流程列表-列
  {
    title: '意图名称',
    dataIndex: 'intentName',
    ellipsis: {
      showTitle: false,
    },
    width: 200,
    render: (val: any) => (
      <Tooltip placement="topLeft" title={val}>
        {val}
      </Tooltip>
    ),
  },
  {
    dataIndex: 'headIntent',
    title: '意图类型',
    search: true,
    ellipsis: true,
    width: 140,
    render: (val: any) => {
      return val === 0 ? '头部意图' : '辅助意图';
    },
  },
  {
    dataIndex: 'flowInfoName',
    title: '业务流程',
    search: false,
    ellipsis: true,
    width: 200,
  },
];

const { Search } = Input;

const expendRender = (row: any) => {
  const answerList: any[] = row.answerList || [];

  return (
    <>
      {answerList.map((item: any, index: number) => {
        return (
          <div className={style['answer-box']} key={index}>
            <div className={style['circle-num']}>{index + 1}</div>
            <div
              className={style['answer-content']}
              dangerouslySetInnerHTML={{ __html: item.answer || null }}
            />
          </div>
        );
      })}
    </>
  );
};

// selectlist  (recommendType、recommendId、recommend)
// disabledWishKeys    禁止选择的意图
// disabledQuestionKeys  禁止选择的问题
// selectedQuestionKeys  已选择的问题
// selectedWishKeys 已选择的意图

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm, type = 'checkbox', min = 2, max = 5, readOnly = true } = props;

  const [showWishKey, setShowWishKey] = useState<boolean>(true);
  // tabs 操作
  const [activeKey, setActivekey] = useState<string>('1');

  const [disabledQuestionKeys, setDisabledQuestionKeys] = useState<any[]>([]);
  const [disabledWishKeys, setDisabledWishKeys] = useState<any[]>([]);

  // title
  const [title, setTitle] = useState<any>('');

  // 对象
  const [selectList, setSelectList] = useState<any[]>([]);
  // const [selectWishList, setSelectWishList] = useState<any[]>([]);

  //  批量相关操作
  const [operation, setOperation] = useState<string>('');
  const [questionList, setQuestionList] = useState<any>([]);

  const changeActiveKey = (val: any) => {
    setActivekey(val);
    if (activeKey === '1') {
      onChange1(1);
    }
  };

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  // 业务流程列表
  const { wishList, treeData, getTreeData, getWishList } = useModel(
    'drawer' as any,
    (model: any) => {
      return {
        wishList: model?._wishList || [],
        treeData: model?.treeData || [],
        getTreeData: model?.getTreeData,
        getWishList: model?.getWishList,
      };
    },
  );

  const [classType, setClassType] = useState<string>('');
  const { loading, faqList, getFaqList, totalSize, setFaqList } = useFaqModal();

  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);
  const [current2, setCurrent2] = useState<number>(1);

  // 切换分页
  const onChange1 = (val: any) => {
    if (loading) {
      return;
    }
    setCurrent1(val);
    if (classType) {
      getFaqList({
        page: val,
        pageSize: 10,
        queryType: 0,
        robotId: info.id,
        faqTypeId: classType == '0' ? null : classType,
        searchText: searchText1,
      });
    } else {
      setFaqList([]);
    }
  };
  const onChange2 = (val: any) => {
    setCurrent2(val);
  };

  // 搜索文本
  const [searchText1, setSearchText1] = useState<any>('');
  const [searchText2, setSearchText2] = useState<any>('');

  // 查询意图列表
  const [searchWishList, setSearchWishList] = useState<any>([]);

  // 监听查询内容输出
  const onSearchChange1 = (e: any) => {
    setSearchText1(e.target.value);
  };

  const onSearchChange2 = (e: any) => {
    setSearchText2(e.target.value);
  };

  // faq列表触发查询
  const onSearch1 = () => {
    if (!classType) {
      return;
    }
    setCurrent1(1);
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
      queryType: 0,
      faqTypeId: classType == '0' ? null : classType,
      searchText: searchText1,
    });
  };

  // 意图触发查询
  const tableWishList: any[] = useMemo(() => {
    return wishList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [wishList]);

  useEffect(() => {
    setSearchWishList(tableWishList);
  }, [tableWishList]);

  // 意图触发查询
  const onSearch2 = () => {
    const list = tableWishList.filter((item: any) => {
      return item?.intentName?.includes?.(searchText2);
    });
    console.log(list);
    setSearchWishList([...list]);
  };

  // ------------------------

  // 选中key值
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);
  const [selectedWishKeys, setSelectedWishKeys] = useState<any[]>([]);

  // 选中
  const onSelect = (val: any) => {
    console.log(val[0]);
    if (!val[0]) {
      return;
    }
    setClassType(val[0]);
    setCurrent1(1);
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
      faqTypeId: val[0] == '0' ? null : val[0],
      queryType: 0,
      searchText: searchText1,
    });
  };

  // 勾选筛选设置
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // 如果是单选
      if (type === 'radio') {
        let lastInfo = selectedRows?.[0];
        setSelectList([
          {
            recommendType: 1,
            recommendId: lastInfo.id,
            recommendName: lastInfo.question,
          },
        ]);
        // 设置选中数组
        setSelectedWishKeys([]);
        setSelectedQuestionKeys(selectedRowKeys);
        setSelectedWishKeys([]);
        return;
      }

      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

      // console.log(selectedRowKeys, selectedQuestionKeys);
      // 如果是多选
      // 新增
      if (selectedRowKeys.length > selectedQuestionKeys.length) {
        // 获取
        let lastInfo = selectedRows?.[selectedRows.length - 1];
        if (lastInfo) {
          setSelectList([
            ...selectList,
            {
              recommendType: 1,
              recommendId: lastInfo.id,
              recommendName: lastInfo.question,
            },
          ]);
        }
        // 减小
      } else if (selectedRowKeys.length < selectedQuestionKeys.length) {
        // 找出少了那个
        let keys: any = selectedQuestionKeys.filter((_key: any) => {
          return !selectedRowKeys.includes(_key);
        });
        console.log('少了', keys);
        // 进行剔除  过滤出来
        let list: any[] = selectList?.filter((item: any) => {
          return !(item.recommendType === 1 && keys.includes(item.recommendId));
        });
        // console.log(selectedQuestionKeys, keys, list);
        setSelectList(list);
      }
      // 设置选中数组
      setSelectedQuestionKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: disabledQuestionKeys.includes(record.id),
        name: record.name,
      };
    },
  };

  const rowFlowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // 如果是单选
      if (type === 'radio') {
        let lastInfo = selectedRows?.[0];
        setSelectList([
          {
            recommendType: 2,
            recommendId: lastInfo.id,
            recommendName: lastInfo.label,
          },
        ]);
        // 设置选中数组
        setSelectedQuestionKeys([]);
        setSelectedWishKeys(selectedRowKeys);
        setSelectedQuestionKeys([]);
        return;
      }

      if (selectedRowKeys.length > selectedWishKeys.length) {
        // 获取
        let lastInfo = selectedRows?.[selectedRows.length - 1];
        if (lastInfo) {
          setSelectList([
            ...selectList,
            {
              recommendType: 2,
              recommendId: lastInfo.id,
              recommendName: lastInfo.label,
            },
          ]);
        }
        // 减小
      } else if (selectedRowKeys.length < selectedWishKeys.length) {
        // 找出少了那个
        let keys: any = selectedWishKeys.filter((_key: any) => {
          return !selectedRowKeys.includes(_key);
        });
        // 进行剔除  过滤出来
        let list: any[] = selectList?.filter((item: any) => {
          return !(item.recommendType === 2 && keys.includes(item.recommendId));
        });
        setSelectList(list);
      }
      setSelectedWishKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: disabledWishKeys.includes(record.name),
        name: record.name,
      };
    },
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      getWishList(info.id); // 获取意图列表
      getTreeData(info.id); // 获取faq列表
      console.log(obj);
      if (obj.operation === 'batch') {
        setOperation('batch');
        setQuestionList(obj.questionList);
      } else {
        setOperation('');
        setQuestionList([]);
      }
      setTitle(obj.question || '');
      // 设置不能选的
      setDisabledWishKeys(obj?.disabledWishKeys || []);
      setDisabledQuestionKeys(obj?.disabledQuestionKeys || []);
      // 设置默认选中
      setSelectedQuestionKeys(obj?.selectedQuestionKeys || []);
      setSelectedWishKeys(obj?.selectedWishKeys || []);
      setSelectList(obj?.selectList || []);

      if (obj?.showFlow === false) {
        setShowWishKey(false);
        setActivekey('1');
        onChange1(1);
      } else {
        if (activeKey === '1') {
          onChange1(1);
        }
        setShowWishKey(true);
      }
      setCurrent2(1);

      onSelect(['0']);

      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  // 提交
  const submit = () => {
    if (!Array.isArray(selectList)) {
      message.warning('请选择有效的标准问/意图');
      return;
    }
    // ------------------
    if (type === 'checkbox') {
      if (selectList.length < min || selectList.length > max) {
        message.warning('请选择2-5项FAQ或意图用于澄清推荐问题');
        return;
      }
    }
    if (operation == 'batch') {
      confirm(selectList || [], questionList);
    } else {
      confirm(selectList || [], title);
    }

    setVisible(false);
  };

  // 删除某个选项
  const deleteItem = (item: any, index: number) => {
    selectList.splice(index, 1);
    if (item.recommendType === 1) {
      let _selectedQuestionKeys = selectedQuestionKeys.filter((_item: any) => {
        return _item !== item.recommendId;
      });
      setSelectedQuestionKeys(_selectedQuestionKeys);
    } else {
      let _selectedWishKeys = selectedWishKeys.filter((_item: any) => {
        return _item !== item.recommendId;
      });
      setSelectedWishKeys(_selectedWishKeys);
    }
  };

  const editList = (val: any, item: any) => {
    let temp: any = [...questionList];
    questionList.map((el: any, index: any) => {
      if (item.id === el.id) {
        el.question = val;
      }
    });
    setQuestionList(temp);
  };

  const delFaqOrSample = (item: any, index: any) => {
    if (questionList?.length < 2) {
      message.warning('至少保留一条');
    } else {
      let temp: any = [];
      questionList.map((el: any, index: any) => {
        if (item.id !== el.id) {
          temp.push(el);
        }
      });
      setQuestionList(temp);
    }
  };

  return (
    <Modal
      className={style['modal-bg']}
      width={950}
      title={'选择标准问/意图'}
      visible={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['modal-bg_default']}>
        {/* <Condition r-if={title}> */}
        {operation == 'batch' ? (
          <div className={style.batch_box}>
            {questionList.map((item: any, index: any) => {
              return (
                <div key={item.id} className={style['title_top_batch']}>
                  <div className={style['label']}> 问题样本{index + 1}:</div>
                  <Input
                    value={item.question}
                    onChange={(e) => {
                      editList(e.target.value, item);
                    }}
                    readOnly={readOnly}
                  />
                  <div style={{ padding: '10px' }}>
                    <DeleteOutlined
                      style={{ color: '#00000060', fontSize: '20px', cursor: 'pointer' }}
                      onClick={() => delFaqOrSample(item, index)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={style['title_top']}>
            <div className={style['label']}> 问题样本:</div>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              readOnly={readOnly}
            />
          </div>
        )}

        {/* </Condition> */}

        <div className={style['select-box']}>
          <Condition r-if={selectList.length > 0}>
            <div className={style['title']}>已选择标准问/意图</div>

            <div className={style['select-content']}>
              {selectList.map((item: any, index: number) => {
                return (
                  <div className={style['select-item']} key={index}>
                    <Tooltip placement="topLeft" title={item.recommendName}>
                      <div className={style['label']}>
                        <span className={style['num']}>{index + 1}.</span>
                        {item.recommendType == '1' ? (
                          <QuestionCircleOutlined className={style['icon']} />
                        ) : (
                          <MonitorOutlined className={style['icon']} />
                        )}
                        {item.recommendName}
                      </div>
                    </Tooltip>
                    <Button
                      type="text"
                      onClick={() => {
                        deleteItem(item, index);
                      }}
                    >
                      <DeleteOutlined style={{ color: '#00000060' }} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Condition>
        </div>

        <Tabs activeKey={activeKey} onChange={changeActiveKey}>
          <TabPane tab="FAQ" key="1">
            <div className={style['zy-row']}>
              <div className={style['page_left']}>
                <MyTree
                  draggable={false}
                  onChange={onSelect}
                  data={treeData}
                  edit={false}
                  size="sm"
                />
              </div>

              <div className={style['page_content']}>
                <div className={style['zy-row_end']}>
                  <Search
                    placeholder="输入标准问进行搜索"
                    value={searchText1}
                    onSearch={onSearch1}
                    onPressEnter={onSearch1}
                    onChange={onSearchChange1}
                    allowClear
                    style={{ width: '300px' }}
                  />
                </div>

                <div className={style['table-box']}>
                  <Table
                    rowSelection={{
                      type: type === 'radio' ? 'radio' : 'checkbox',
                      ...rowSelection,
                      selectedRowKeys: selectedQuestionKeys,
                      hideSelectAll: true,
                    }}
                    expandable={{
                      expandedRowRender: expendRender,
                      // 可扩展
                      rowExpandable: (record: any) => record?.answerList?.length > 0,
                    }}
                    size="small"
                    pagination={{
                      current: current1,
                      onChange: onChange1,
                      total: totalSize,
                      showSizeChanger: false,
                    }}
                    dataSource={faqList}
                    columns={columns1}
                    rowKey="id"
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tab="意图" key="2" disabled={!showWishKey}>
            <div className={style['page_content']}>
              <div className={style['zy-row_end']}>
                <Search
                  placeholder="输入意图名称进行搜索"
                  value={searchText2}
                  onSearch={onSearch2}
                  onPressEnter={onSearch2}
                  onChange={onSearchChange2}
                  allowClear
                  style={{ width: '300px' }}
                />
              </div>

              <div className={style['table-box']}>
                <Table
                  rowSelection={{
                    type: type === 'radio' ? 'radio' : 'checkbox',
                    ...rowFlowSelection,
                    selectedRowKeys: selectedWishKeys,
                    hideSelectAll: true,
                  }}
                  size="small"
                  pagination={{ current: current2, onChange: onChange2 }}
                  dataSource={
                    readOnly
                      ? searchWishList.filter((item: any) => item.headIntent == 0)
                      : searchWishList
                  }
                  columns={columns2}
                  rowKey="id"
                  // loading={tableLoading}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default SelectorModal;
