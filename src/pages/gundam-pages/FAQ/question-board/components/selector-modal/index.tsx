import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MyTree from '../../../FAQ-manage/components/my-tree';
import { useModel } from 'umi';
import style from './style.less';
import Condition from '@/components/Condition';

const { TabPane } = Tabs;

const columns1: any[] = [
  // 问题列表-列
  {
    title: '问题名称',
    dataIndex: 'label',
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
  };

  // 业务流程列表
  const { flowList, treeData } = useModel('drawer' as any, (model: any) => {
    return {
      flowList: model?._originFlowList || [],
      treeData: model?.treeData || [],
    };
  });

  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);
  const [current2, setCurrent2] = useState<number>(1);

  const onChange1 = (val: any) => {
    setCurrent1(val);
  };
  const onChange2 = (val: any) => {
    setCurrent2(val);
  };

  // 选中key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  // 选中
  const onSelect = (val: any) => {
    console.log(val);
  };

  useEffect(() => {
    console.log('flowList');
    console.log(flowList);
  }, [flowList]);

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
      setSelectedRowKeys(selectedRowKeys);
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
      setSelectedRowKeys(selectedRowKeys);
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
      setDisabledFlowKeys(obj.disabledFlowKeys || []);
      setDisabledQuestionKeys(obj.disabledQuestionKeys || []);
      if (obj.showFlow === false) {
        setShowFlowKey(false);
        setActivekey('1');
      } else {
        setShowFlowKey(true);
      }
      setCurrent1(1);
      setCurrent2(1);
      setSelectedRowKeys([]);

      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    console.log(selectedRowKeys);
    let list: any = tableFlowList
      .filter((item: any) => {
        return selectedRowKeys.includes(item.name);
      })
      .map((item: any) => item.label);
    console.log(list);
    if (list.length > 0) {
      confirm?.({
        questionType: activeKey,
        questionId: selectedRowKeys[0],
        question: list[0],
      });
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
                    selectedRowKeys,
                  }}
                  size="small"
                  pagination={{ current: current1, onChange: onChange1 }}
                  dataSource={tableFlowList}
                  columns={columns1}
                  rowKey="id"
                  // loading={tableLoading}
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
                selectedRowKeys,
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
