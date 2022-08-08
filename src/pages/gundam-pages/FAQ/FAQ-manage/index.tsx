import { SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Input, Popconfirm, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import ChannelModal from '../components/channel-modal';
import ClassifyModal from '../components/classify-modal';
import QuestionList from '../components/question-list';
import HighConfigSelect from './components/high-select';
import MyTree from './components/my-tree';
import TypeModal from './components/type-modal';
import { useTreeModal } from './model';
import style from './style.less';

const { Panel } = Collapse;
const { Option } = Select;

const FAQPage: React.FC<any> = (props: any) => {
  const { info, setInfo, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
    getGlobalValConfig: model.getGlobalValConfig,
  }));

  const { userList, getCreateUser, _getTreeData, getShowBadgeTotal } = useModel(
    'drawer' as any,
    (model: any) => ({
      userList: model.userList,
      getCreateUser: model.getCreateUser,
      _getTreeData: model.getTreeData,
      getShowBadgeTotal: model.getShowBadgeTotal,
    }),
  );

  const [value, setValue] = useState<any>({
    channelList: ['all'],
    orderType: 1,
    creatorList: null,
  });
  const [queryType, setQueryType] = useState<any>(0);
  const [searchText, setSearchText] = useState<any>('');
  const [selectTree, setSelectTree] = useState<any>('0');

  const onSelect = (val: any, opt: any) => {
    console.log('选择树形组件:' + val);
    if (val[0]) {
      setSelectTree(val[0]);
      // sessionStorage.setItem('selectTree', val[0]);
    }
    // QuestionRef?.current?.CurrentPage({ faqTypeId: val });
  };

  const changeHighConfig = (val: any) => {
    // console.log(val);

    setValue(val);
    //重新获取列表
    setTimeout(() => {
      QuestionRef?.current?.CurrentPage({});
    }, 1);
  };
  const [pageNo, setPageNo] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const { treeData, childList, getTreeData } = useTreeModal();

  const typeModalRef = useRef<any>({});
  const classifyRef = useRef<any>({});
  const channelRef = useRef<any>({});
  const QuestionRef = useRef<any>(null);

  // 打开新增弹窗
  const openAddModal = (obj: any, callback: any) => {
    (typeModalRef.current as any).openModal({
      type: 'create',
      node: obj,
      callback,
    });
  };

  // 打开编辑弹窗
  const openEditModal = (obj: any, callback: any) => {
    (typeModalRef.current as any).openModal({
      type: 'edit',
      node: obj,
      callback,
    });
  };

  //全选
  const checkboxChange = (val: any) => {
    let flag = val.target.checked;
    setSelectAll(flag);
    (QuestionRef?.current as any)?.selectAll(flag);
  };

  const getTree = () => {
    getTreeData({ robotId: info.id });
  };

  useEffect(() => {
    _getTreeData(info.id);
    getTree();
    getCreateUser(info.id, 0);
    getGlobalValConfig(info.id);
    getShowBadgeTotal(info.id);
  }, []);

  // const _getMoreFaqList = async () => {
  //   console.log(faqList.length, totalSize, faqList.length < totalSize);
  //   if (loading) {
  //     return;
  //   }
  //   let res = await getMoreFaqList({ pageNo: pageNo + 1 });
  //   if (res) {
  //     setPageNo(pageNo + 1);
  //   }
  // };

  const extraBtnHtml = <SettingOutlined />;

  const goToAddQuestion = () => {
    history.push('/gundamPages/faq/board');
  };

  const openClassify = (item: any) => {
    classifyRef.current?.open(item);
  };
  const openChannel = () => {
    channelRef.current?.open();
  };

  const onEnter = (text: any) => {
    console.log(text);

    QuestionRef?.current?.CurrentPage({ searchText: text, queryType: queryType });
  };

  const changeClassify = (params: any) => {
    QuestionRef?.current?.editQ(params);
  };

  const changeQueryType = (val: any) => {
    console.log(val);
    setQueryType(val);
  };

  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <Space>
            <Button type="primary" onClick={goToAddQuestion}>
              添加问题
            </Button>

            <Button
              // type="primary"
              style={{ border: 0 }}
              onClick={() => {
                history.push('/gundamPages/faq/import');
              }}
            >
              批量导入
            </Button>
            <Button
              // type="primary"
              style={{ border: 0 }}
              onClick={() => {
                QuestionRef?.current?.faqExport();
              }}
            >
              批量导出
            </Button>
            <Button
              // type="primary"
              style={{ border: 0 }}
              onClick={() => {
                history.push('/gundamPages/faq/recycle');
              }}
            >
              问题回收站
            </Button>
          </Space>
        </div>

        <div className={style['page_top__right']}>
          <Space>
            <Input.Group compact>
              <Select
                // size="small"
                defaultValue={0}
                onChange={changeQueryType}
                style={{ backgroundColor: '#fff' }}
                bordered={false}
              >
                <Option value={0}>问题</Option>
                <Option value={1}>答案</Option>
                {/* <Option value={2}>标签</Option> */}
              </Select>
              <Input.Search
                bordered={false}
                style={{ width: '280px', backgroundColor: '#fff', borderColor: '#fff' }}
                onChange={(e: any) => {
                  setSearchText(e.target.value);
                }}
                onSearch={onEnter}
                onPressEnter={() => {
                  QuestionRef?.current?.CurrentPage();
                }}
                placeholder={'请输入'}
                allowClear
              />
            </Input.Group>
          </Space>
        </div>
      </div>

      <div className={style['page_content']}>
        <div className={style['main-content_left']}>
          <div
            className={style['tree_title']}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            问答列表
          </div>
          <MyTree
            draggable={false}
            onChange={onSelect}
            data={treeData}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
            getTree={getTree}
          ></MyTree>

          <TypeModal cref={typeModalRef} getTree={getTree}></TypeModal>
        </div>
        <div className={style['main-content']}>
          <div className={style['high-config-select']}>
            <Collapse expandIconPosition="right">
              <Panel
                header={
                  <div>
                    问答列表
                    <span style={{ marginLeft: '16px' }}>
                      {QuestionRef?.current?.resData?.totalPage || 0}个标准问，
                      {QuestionRef?.current?.resData?.similarNum || 0}个相似问
                    </span>
                  </div>
                }
                key="1"
                extra={'高级筛选'}
                style={{ border: 0 }}
              >
                <HighConfigSelect value={value} onChange={changeHighConfig} isRecycle={0} />
              </Panel>
            </Collapse>
          </div>

          {/* 全选 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'initial' }}>
            <div style={{ paddingTop: '4px' }}>
              <Checkbox
                onChange={checkboxChange}
                style={{ marginBottom: '24px' }}
                checked={selectAll}
              ></Checkbox>
              <span style={{ marginLeft: '8px' }}>全选</span>
            </div>
            <div className={style['box-top-del']}>
              <Popconfirm
                title={() => {
                  return (
                    <div style={{ maxWidth: '180px' }}>
                      从问题回收站删除问题将彻底清除该问题所有相关记录，是否确认删除？
                    </div>
                  );
                }}
                getPopupContainer={(trigger: any) => trigger.parentElement}
                okText="确定"
                placement="topRight"
                cancelText="取消"
                onConfirm={() => {
                  // _deleteRecycle();
                }}
              >
                <Button>批量删除</Button>
              </Popconfirm>
            </div>
          </div>

          <QuestionList
            cref={QuestionRef}
            hasCheckbox={false}
            openClassify={openClassify}
            openChannel={openChannel}
            childList={childList}
            searchText={searchText}
            queryType={queryType}
            heightSelect={value}
            isRecycle={0}
            selectTree={selectTree}
          ></QuestionList>
        </div>
      </div>

      <ClassifyModal cref={classifyRef} treeData={treeData} editQ={changeClassify}></ClassifyModal>
      <ChannelModal cref={channelRef}></ChannelModal>
    </div>
  );
};

export default FAQPage;
