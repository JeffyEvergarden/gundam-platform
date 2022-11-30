import { Divider, Input, message, Modal, Table } from 'antd';
import { useEffect, useImperativeHandle, useState } from 'react';

import { useModel } from 'umi';

import MyTree from '@/pages/gundam-pages/FAQ/FAQ-manage/components/my-tree';
import { useFaqModal } from '@/pages/gundam-pages/FAQ/FAQ-manage/model';
import { DeleteOutlined } from '@ant-design/icons';
import style from './style.less';
const columns1: any[] = [
  // 问题列表-列
  {
    title: '问题名称',
    dataIndex: 'question',
  },
];

const { Search } = Input;
const SelectorModal: React.FC<any> = (props: any) => {
  const { cref, onSubmit, onBatchSubmit, loading: btnLoading } = props;
  const [disabledQuestionKeys, setDisabledQuestionKeys] = useState<any[]>([]);

  const { info } = useModel('gundam' as any, (model: any) => {
    return {
      info: model.info,
    };
  });
  // 业务流程列表
  const { getTreeData, treeData } = useModel('drawer' as any, (model: any) => {
    return {
      treeData: model?.treeDataOther || [],
      getTreeData: model?.getTreeDataOther || [],
    };
  });
  const { loading, faqList, getFaqList, totalSize, setFaqList } = useFaqModal();
  const [classType, setClassType] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  // 页码, 分页相关
  const [current1, setCurrent1] = useState<number>(1);

  const onChange1 = (val: any) => {
    if (loading) {
      return;
    }
    setCurrent1(val);
    getFaqList({
      page: val,
      pageSize: 10,
      robotId: info.id,
      faqTypeId: classType == '0' ? null : classType,
      searchText: searchText1,
    });
  };

  const [searchText1, setSearchText1] = useState<any>('');
  const [pageType, setPageType] = useState<any>('');
  const [similarInfo, setSimilarInfo] = useState<any>([]);

  // 选中key值
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);

  // 选中
  const onSelect = (val: any) => {
    setClassType(val[0]);
    setCurrent1(1);
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
      faqTypeId: val[0] == '0' ? null : val[0],
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedQuestionKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: disabledQuestionKeys?.includes?.(record?.id),
        name: record.name,
      };
    },
  };

  useImperativeHandle(cref, () => ({
    open: (obj: any, type?: any) => {
      setDisabledQuestionKeys(obj?.faqId || []);
      console.log(obj);
      getTreeData(info.id);
      setSimilarInfo(obj);
      setPageType('');
      if (type) {
        setPageType(type);
        setDisabledQuestionKeys(obj?.[0]?.faqId || []);
      }
      // 显示
      setVisible(true);
    },
    close: () => {
      setVisible(false);
      setSelectedQuestionKeys([]);
    },
  }));

  const submit = () => {
    console.log(selectedQuestionKeys);
    if (pageType == 'batch') {
      onBatchSubmit(
        similarInfo.map((i: any) => i.id),
        selectedQuestionKeys?.[0],
        similarInfo?.[0]?.faqId,
      );
      return;
    }
    onSubmit(similarInfo?.id, selectedQuestionKeys?.[0]);
    // setVisible(false);
  };

  const onSearchChange1 = (e: any) => {
    setSearchText1(e.target.value);
  };

  const onSearch1 = () => {
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
      faqTypeId: classType == '0' ? null : classType,
      searchText: searchText1,
      faqType: 1,
    });
  };

  useEffect(() => {
    getFaqList({
      page: 1,
      pageSize: 10,
      robotId: info.id,
    });
  }, []);

  return (
    <Modal
      className={style['modal-bg']}
      width={850}
      title={'转移到其他标准问'}
      visible={visible}
      confirmLoading={btnLoading}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={style['zy-row']}>
        <div style={{ marginBottom: '8px', display: 'flex' }}>
          <div style={{ whiteSpace: 'nowrap' }}>样本内容：</div>

          {pageType == 'batch' ? (
            <div className={style['spamleText']}>
              {similarInfo.map((item: any, index: any) => {
                return (
                  <span key={index}>
                    <span style={{ marginRight: '6px' }}>{item?.similarText}</span>
                    <DeleteOutlined
                      style={{ cursor: 'pointer', color: '#00000060' }}
                      onClick={() => {
                        if (similarInfo.length < 2) {
                          message.warning('至少保留一个相似问');
                          return;
                        }
                        let obj = similarInfo?.filter((i: any, idx: any) => idx != index);
                        setSimilarInfo(obj);
                      }}
                    />
                    <Divider type="vertical"></Divider>
                  </span>
                );
              })}
            </div>
          ) : (
            similarInfo?.similarText
          )}
        </div>
        <span style={{ marginBottom: '8px' }}>
          <span style={{ width: '100px' }}>原标准问：</span>
          {pageType == 'batch' ? similarInfo?.[0]?.question : similarInfo?.question}
        </span>
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
