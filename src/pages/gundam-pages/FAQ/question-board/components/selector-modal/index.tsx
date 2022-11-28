import { Input, Modal, Table, Tabs, Tooltip } from 'antd';
import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useModel } from 'umi';
import MyTree from '../../../FAQ-manage/components/my-tree';
import { useFaqModal } from '../../../FAQ-manage/model';
import { useSelfModel } from '../../model';
import style from './style.less';

const { TabPane } = Tabs;

const columns1: any[] = [
  // 问题列表-列
  {
    title: '问题名称',
    dataIndex: 'question',
  },
];

const columns2: any[] = [
  // 业务流程列表-列
  {
    title: '业务流程名称',
    dataIndex: 'flowName',
    ellipsis: {
      showTitle: false,
    },
    render: (val: any) => (
      <Tooltip placement="topLeft" title={val}>
        {val}
      </Tooltip>
    ),
  },
];

const columns3: any[] = [
  {
    title: '自助服务名称',
    dataIndex: 'selfName',
  },
];

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm, type = 'radio', showFlow = true } = props;

  const [showFlowKey, setShowFlowKey] = useState<boolean>(true);
  // tabs 操作
  const [activeKey, setActivekey] = useState<string>('1');

  const [disabledQuestionKeys, setDisabledQuestionKeys] = useState<any[]>([]);
  const [disabledFlowKeys, setDisabledFlowKeys] = useState<any[]>([]);
  const [disabledSelfKeys, setDisabledSelfKeys] = useState<any[]>([]);

  const changeActiveKey = (val: any) => {
    setActivekey(val);
    if (val === '1') {
      onChange1(1);
    } else if (val === '3') {
      onChange3(1);
    }
  };

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  // 业务流程列表
  const { flowList, treeData, getTreeData } = useModel('drawer' as any, (model: any) => {
    return {
      flowList: model?._flowListWithHand || [],
      treeData: model?.treeData || [],
      getTreeData: model.getTreeData,
    };
  });

  const [classType, setClassType] = useState<string>('');
  const { loading, faqList, getFaqList, totalSize, setFaqList } = useFaqModal();
  const { getSelfList, loading: selfLoading, selfList, totalSize: selfTotalSize } = useSelfModel();

  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);
  const [current2, setCurrent2] = useState<number>(1);
  const [current3, setCurrent3] = useState<number>(1);

  const onChange1 = (val: any) => {
    if (loading) {
      return;
    }
    setCurrent1(val);
    // if (classType) {
    getFaqList({
      page: val,
      pageSize: 10,
      queryType: 0,
      robotId: info.id,
      faqTypeId: classType == '0' ? null : classType,
      searchText: searchText1,
      faqType: 1,
    });
    // } else {
    //   setFaqList([]);
    // }
  };
  const onChange2 = (val: any) => {
    setCurrent2(val);
  };

  const onChange3 = (val: any) => {
    if (selfLoading) {
      return;
    }
    setCurrent3(val);
    getSelfList({ page: val, pageSize: 10, searchText: searchText3 });
  };

  const [searchText1, setSearchText1] = useState<any>('');
  const [searchText2, setSearchText2] = useState<any>('');
  const [searchText3, setSearchText3] = useState<any>('');

  const [searchFlowList, setSearchFlowList] = useState<any>([]);

  const onSearchChange1 = (e: any) => {
    setSearchText1(e.target.value);
  };

  const onSearchChange2 = (e: any) => {
    setSearchText2(e.target.value);
  };

  const onSearchChange3 = (e: any) => {
    setSearchText3(e.target.value);
  };

  const onSearch1 = () => {
    // if (!classType) {
    //   return;
    // }
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
      queryType: 0,
      faqTypeId: classType == '0' ? null : classType,
      searchText: searchText1,
      faqType: 1,
    });
  };

  const tableFlowList: any[] = useMemo(() => {
    return flowList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [flowList]);

  useEffect(() => {
    setSearchFlowList(tableFlowList);
  }, [tableFlowList]);

  const onSearch2 = () => {
    const list = tableFlowList.filter((item: any) => {
      return item.flowName.includes(searchText2);
    });
    console.log(list);
    setSearchFlowList([...list]);
  };

  const onSearch3 = () => {
    getSelfList({ page: 1, pageSize: 10, searchText: searchText3 });
  };

  // 选中key值
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);
  const [selectedFlowKeys, setSelectedFlowKeys] = useState<any[]>([]);
  const [selectedSelfKeys, setSelectedSelfKeys] = useState<any[]>([]);

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
      queryType: 0,
      robotId: info.id,
      faqTypeId: val[0] == '0' ? null : val[0],
      faqType: 1,
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedFlowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: disabledFlowKeys.includes(record.name),
        name: record.name,
      };
    },
  };

  const rowSelfSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedSelfKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      console.log(record);

      return {
        disabled: disabledSelfKeys?.includes(record.selfId),
        name: record.selfName,
      };
    },
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      console.log(obj);
      setDisabledFlowKeys(obj?.disabledFlowKeys || []);
      setDisabledQuestionKeys(obj?.disabledQuestionKeys || []);
      setDisabledSelfKeys(obj?.disabledSelfKeys);
      // 设置默认选中
      setSelectedQuestionKeys(obj?.selectedQuestionKeys || []);
      setSelectedFlowKeys(obj?.selectedFlowKeys || []);
      setSelectedSelfKeys(obj?.selectedSelfKeys);

      if (obj?.showFlow === false) {
        setShowFlowKey(false);
        setActivekey('1');
        onChange1(1);
      } else {
        if (activeKey === '1') {
          onChange1(1);
        }
        setShowFlowKey(true);
      }
      setCurrent2(1);
      getFaqList({
        page: 1,
        pageSize: 10,
        queryType: 0,
        robotId: info.id,
        faqType: 1,
      });

      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  useEffect(() => {
    getTreeData(info.id);
  }, []);

  const submit = () => {
    let list: any = [];
    console.log(activeKey);

    if (activeKey === '2') {
      list = tableFlowList
        .filter((item: any) => {
          return selectedFlowKeys.includes(item.name);
        })
        .map((item: any) => item.label);
      if (list.length > 0) {
        confirm?.({
          recommendBizType: activeKey,
          recommendId: selectedFlowKeys[0],
          recommend: list[0],
          recommendType: 0,
        });
      }
    } else if (activeKey === '1') {
      list = faqList
        .filter((item: any) => {
          return selectedQuestionKeys.includes(item.id);
        })
        .map((item: any) => item.question);
      if (list.length > 0) {
        confirm?.({
          recommendBizType: activeKey,
          recommendId: selectedQuestionKeys[0],
          recommend: list[0],
          recommendType: 0,
        });
      }
    } else if (activeKey === '3') {
      list = selfList
        .filter((item: any) => {
          return selectedSelfKeys.includes(item.selfId);
        })
        .map((item: any) => item.selfName);
      console.log(list);

      if (list.length > 0) {
        confirm?.({
          recommendBizType: activeKey,
          recommendId: selectedSelfKeys[0],
          recommend: list[0],
          recommendType: 0,
        });
      }
    }
    setVisible(false);
  };

  return (
    <Modal
      className={style['modal-bg']}
      width={850}
      title={'手动推荐'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <Tabs activeKey={activeKey} onChange={changeActiveKey}>
        <TabPane tab="问题" key="1">
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
                  style={{ width: 200 }}
                />
              </div>

              <div className={style['table-box']}>
                <Table
                  rowSelection={{
                    type: type === 'radio' ? 'radio' : 'checkbox',
                    ...rowSelection,
                    selectedRowKeys: selectedQuestionKeys,
                  }}
                  size="small"
                  pagination={{ current: current1, onChange: onChange1, total: totalSize }}
                  dataSource={faqList}
                  columns={columns1}
                  rowKey="id"
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="业务流程" key="2" disabled={!showFlowKey}>
          <div className={style['page_content']}>
            <div className={style['zy-row_end']}>
              <Search
                placeholder="输入业务流程进行搜索"
                value={searchText2}
                onSearch={onSearch2}
                onPressEnter={onSearch2}
                onChange={onSearchChange2}
                allowClear
                style={{ width: 300 }}
              />
            </div>

            <div className={style['table-box']}>
              <Table
                rowSelection={{
                  type: type === 'radio' ? 'radio' : 'checkbox',
                  ...rowFlowSelection,
                  selectedRowKeys: selectedFlowKeys,
                }}
                size="small"
                pagination={{ current: current2, onChange: onChange2 }}
                dataSource={searchFlowList}
                columns={columns2}
                rowKey="id"
                // loading={tableLoading}
              />
            </div>
          </div>
        </TabPane>

        <TabPane tab="自助服务" key="3">
          <div className={style['page_content']}>
            <div className={style['zy-row_end']}>
              <Search
                placeholder="请输入"
                value={searchText3}
                onSearch={onSearch3}
                onPressEnter={onSearch3}
                onChange={onSearchChange3}
                allowClear
                style={{ width: 300 }}
              />
            </div>

            <div className={style['table-box']}>
              <Table
                rowSelection={{
                  type: type === 'radio' ? 'radio' : 'checkbox',
                  ...rowSelfSelection,
                  selectedRowKeys: selectedSelfKeys,
                }}
                size="small"
                pagination={{ current: current3, onChange: onChange3, total: selfTotalSize }}
                dataSource={selfList}
                columns={columns3}
                rowKey="selfId"
                // loading={tableLoading}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SelectorModal;
