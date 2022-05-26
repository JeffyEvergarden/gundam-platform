import { useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { Modal, Button, Table, Tooltip, Tabs, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useModel } from 'umi';

import style from './style.less';
import Condition from '@/components/Condition';
import MyTree from '@/pages/gundam-pages/FAQ/FAQ-manage/components/my-tree';
import { useFaqModal } from '@/pages/gundam-pages/FAQ/FAQ-manage/model';
import { useSimilarModel } from '../../model';

const columns1: any[] = [
  // 问题列表-列
  {
    title: '问题名称',
    dataIndex: 'question',
  },
];

const { Search } = Input;

const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, onSubmit } = props;

  const [showFlowKey, setShowFlowKey] = useState<boolean>(true);
  // tabs 操作
  const [activeKey, setActivekey] = useState<string>('1');

  const [disabledQuestionKeys, setDisabledQuestionKeys] = useState<any[]>([]);

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });

  // 业务流程列表
  const { getTreeData, treeData } = useModel('drawer' as any, (model: any) => {
    return {
      treeData: model?.treeData || [],
      getTreeData: model?.getTreeData || [],
    };
  });

  const [classType, setClassType] = useState<string>('');
  const { loading, faqList, getFaqList, totalSize, setFaqList } = useFaqModal();

  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);

  const onChange1 = (val: any) => {
    if (loading) {
      return;
    }
    setCurrent1(val);
    if (classType) {
      getFaqList({
        page: val,
        pageSize: 10,
        robotId: info.id,
        faqTypeId: classType,
        searchText: searchText1,
      });
    } else {
      setFaqList([]);
    }
  };

  const [searchText1, setSearchText1] = useState<any>('');

  const [similarInfo, setSimilarInfo] = useState<any>([]);
  // 选中key值
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);

  // 选中
  const onSelect = (val: any) => {
    setClassType(val[0]);
    setCurrent1(1);
    getFaqList({ page: 1, pageSize: 10, robotId: info.id, faqTypeId: val[0] });
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

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      setSelectedQuestionKeys([]);
      console.log(obj);
      getTreeData(info.id);
      setSimilarInfo(obj);
      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    console.log(selectedQuestionKeys);
    onSubmit(similarInfo?.id, selectedQuestionKeys?.[0]);
    // setVisible(false);
  };

  return (
    <Modal
      className={style['modal-bg']}
      width={850}
      title={'转移到其他标准问'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['zy-row']}>
        <span style={{ marginBottom: '8px' }}>样本内容：{similarInfo?.similarText}</span>
        <span style={{ marginBottom: '8px' }}>原标准问：{similarInfo?.question}</span>
        转移到：
        <div style={{ display: 'flex' }}>
          <div className={style['page_left']}>
            <MyTree
              draggable={false}
              onChange={onSelect}
              data={treeData}
              edit={false}
              size="sm"
              selectTree={[]}
            />
          </div>
          <div className={style['page_content']}>
            {/* <div className={style['zy-row_end']}>
            <Search
              placeholder="输入标准问进行搜索"
              value={searchText1}
              onSearch={onSearch1}
              onPressEnter={onSearch1}
              onChange={onSearchChange1}
              allowClear
              style={{ width: 200 }}
            />
          </div> */}

            <div className={style['table-box']}>
              <Table
                rowSelection={{
                  type: 'radio',
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
      </div>
    </Modal>
  );
};

export default SelectorModal;
