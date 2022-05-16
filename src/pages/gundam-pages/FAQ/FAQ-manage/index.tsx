import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Space, Tree, Collapse, List, Divider, Skeleton } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import HighConfigSelect from './components/high-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import MyTree from './components/my-tree';
import TypeModal from './components/type-modal';
import { useFaqModal, useTreeModal } from './model';
import QuestionList from '../components/question-list';
import style from './style.less';
import { treeData } from './test';

const { Panel } = Collapse;
const { Option } = Select;

const FAQPage: React.FC<any> = (props: any) => {
  const onSelect = (val: any, opt: any) => {
    console.log('选择树形组件:' + val);
  };

  const [value, setValue] = useState<any>({
    channel: 0,
    status: 0,
    sort: 0,
    creator: [0],
  });

  const changeHighConfig = (val: any) => {
    setValue(val);
    //重新获取列表
  };
  const [pageNo, setPageNo] = useState<number>(1);

  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  const { treeData, getTreeData } = useTreeModal();

  const typeModalRef = useRef<any>({});

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

  useEffect(() => {
    getTreeData();
    getFaqList({ pageNo: 1 });
  }, []);

  const _getMoreFaqList = async () => {
    console.log(faqList.length, totalSize, faqList.length < totalSize);
    if (loading) {
      return;
    }
    let res = await getMoreFaqList({ pageNo: pageNo + 1 });
    if (res) {
      setPageNo(pageNo + 1);
    }
  };

  const extraBtnHtml = <SettingOutlined />;

  const goToAddQuestion = () => {
    history.push('/gundamPages/faq/board');
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
              type="primary"
              onClick={() => {
                history.push('/gundamPages/faq/recycle');
              }}
            >
              问题回收站
            </Button>

            <Button
              type="primary"
              onClick={() => {
                history.push('/gundamPages/faq/import');
              }}
            >
              批量导入
            </Button>
          </Space>
        </div>

        <div className={style['page_top__right']}>
          <Space>
            <Input.Group compact>
              <Input style={{ width: '280px' }} defaultValue="钢铁是怎么炼成的" />
              <Select defaultValue={1}>
                <Option value={1}>问题</Option>
                <Option value={2}>答案</Option>
                <Option value={3}>标签</Option>
              </Select>
            </Input.Group>
          </Space>
        </div>
      </div>

      <div className={style['page_content']}>
        <div className={style['main-content_left']}>
          <MyTree
            draggable={false}
            onChange={onSelect}
            data={treeData}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
          ></MyTree>

          <TypeModal cref={typeModalRef}></TypeModal>
        </div>
        <div className={style['main-content']}>
          <div className={style['high-config-select']}>
            <Collapse expandIconPosition="right">
              <Panel
                header={<div className={style['title_sp']}>问答列表</div>}
                key="1"
                extra={'高级筛选'}
              >
                <HighConfigSelect value={value} onChange={changeHighConfig} />
              </Panel>
            </Collapse>
          </div>

          <QuestionList hasCheckbox={false}></QuestionList>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
