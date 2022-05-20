import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Collapse, Divider, Skeleton, Checkbox } from 'antd';
import { ArrowLeftOutlined, DownOutlined, LeftOutlined, SettingOutlined } from '@ant-design/icons';
import HighConfigSelect from '../FAQ-manage/components/high-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import style from './style.less';
import { useFaqModal, useTreeModal } from '../FAQ-manage/model';
import ProList from '@ant-design/pro-list';
import QuestionList from '../components/question-list';
import { history, useModel } from 'umi';

const { Panel } = Collapse;
const { Option } = Select;

const RecyclePage: React.FC<any> = (props: any) => {
  const QuestionRef = useRef(null);

  const [value, setValue] = useState<any>({
    channelList: ['all'],
    approvalStatusList: null,
    orderType: 0,
    creatorList: null,
  });

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const changeHighConfig = (val: any) => {
    setValue(val);
    QuestionRef?.current?.CurrentPage({});
  };
  const [pageNo, setPageNo] = useState<number>(1);
  const [searchText, setSearchText] = useState<any>('');

  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();
  const { treeData, childList, getTreeData } = useTreeModal();

  useEffect(() => {
    // getFaqList({ pageNo: 1 });
    getTreeData({ robotId: info.id });
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

  const checkboxChange = (val: any) => {
    let flag = val.target.checked;
    (QuestionRef?.current as any)?.selectAll(flag);
  };

  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.goBack();
            }}
          />
          问题回收站
        </div>

        <div className={style['page_top__right']}>
          <Input.Search
            style={{ marginRight: '16px', width: '280px' }}
            onChange={(e: any) => {
              setSearchText(e.target.value);
            }}
          ></Input.Search>
        </div>
      </div>

      <div className={style['page_content']}>
        <div className={style['main-content']}>
          <div className={style['high-config-select']}>
            <Collapse expandIconPosition="right">
              <Panel
                style={{ alignItems: 'center' }}
                header={<div className={style['title_sp']}>问答列表</div>}
                key="1"
                extra={<div>高级筛选</div>}
              >
                <HighConfigSelect value={value} onChange={changeHighConfig} />
              </Panel>
            </Collapse>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'initial' }}>
            <div style={{ paddingTop: '4px' }}>
              <Checkbox onChange={checkboxChange} style={{ marginBottom: '24px' }}></Checkbox>
              <span style={{ marginLeft: '8px' }}>全选</span>
            </div>
            <Button>批量删除</Button>
          </div>
          <QuestionList
            cref={QuestionRef}
            hasCheckbox={true}
            childList={childList}
            searchText={searchText}
            heightSelect={value}
            isRecycle={1}
          ></QuestionList>
        </div>
      </div>
    </div>
  );
};

export default RecyclePage;
