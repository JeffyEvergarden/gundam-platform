import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MyTree from '../../../FAQ-manage/components/my-tree';
import { useModel } from 'umi';
import { useFaqModal } from '../../../FAQ-manage/model';
import style from './style.less';
import Condition from '@/components/Condition';

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

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, confirm, type = 'radio', showFlow = true } = props;

  const [showFlowKey, setShowFlowKey] = useState<boolean>(true);
  // tabs 操作
  const [activeKey, setActivekey] = useState<string>('1');

  const [disabledQuestionKeys, setDisabledQuestionKeys] = useState<any[]>([]);
  const [disabledFlowKeys, setDisabledFlowKeys] = useState<any[]>([]);

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
  const { flowList, treeData } = useModel('drawer' as any, (model: any) => {
    return {
      flowList: model?._originFlowList || [],
      treeData: model?.treeData || [],
    };
  });

  const [classType, setClassType] = useState<string>('');
  const { loading, faqList, getFaqList, totalSize, setFaqList } = useFaqModal();

  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);
  const [current2, setCurrent2] = useState<number>(1);

  const onChange1 = (val: any) => {
    if (loading) {
      return;
    }
    setCurrent1(val);
    if (classType) {
      getFaqList({ page: val, pageSize: 10, robotId: info.id, type: classType });
    } else {
      setFaqList([]);
    }
  };
  const onChange2 = (val: any) => {
    setCurrent2(val);
  };

  // 选中key值
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);
  const [selectedFlowKeys, setSelectedFlowKeys] = useState<any[]>([]);

  // 选中
  const onSelect = (val: any) => {
    setClassType(val[0]);
    setCurrent1(1);
    getFaqList({ page: 1, pageSize: 10, robotId: info.id, type: val[0] });
  };

  const tableFlowList: any[] = useMemo(() => {
    return flowList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [flowList]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedQuestionKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: disabledQuestionKeys.includes(record.name),
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

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      console.log(obj);
      setDisabledFlowKeys(obj?.disabledFlowKeys || []);
      setDisabledQuestionKeys(obj?.disabledQuestionKeys || []);
      // 设置默认选中
      setSelectedQuestionKeys(obj?.selectedQuestionKeys || []);
      setSelectedFlowKeys(obj?.selectedFlowKeys || []);

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

      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    let list: any = [];
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
          ecommendId: selectedQuestionKeys[0],
          recommend: list[0],
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
              <MyTree draggable={false} onChange={onSelect} data={treeData} edit={false} />
            </div>

            <div className={style['page_content']}>
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
          <div className={style['table-box']}>
            <Table
              rowSelection={{
                type: type === 'radio' ? 'radio' : 'checkbox',
                ...rowFlowSelection,
                selectedRowKeys: selectedFlowKeys,
              }}
              size="small"
              pagination={{ current: current2, onChange: onChange2 }}
              dataSource={tableFlowList}
              columns={columns2}
              rowKey="id"
              // loading={tableLoading}
            />
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SelectorModal;
