import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Collapse, Divider, Skeleton } from 'antd';
import { ArrowLeftOutlined, DownOutlined, LeftOutlined, SettingOutlined } from '@ant-design/icons';
import HighConfigSelect from '../FAQ-manage/components/high-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import style from './style.less';
import { useFaqModal } from '../FAQ-manage/model';
import ProList from '@ant-design/pro-list';
import QuestionList from '../components/question-list';

const { Panel } = Collapse;
const { Option } = Select;

const RecyclePage: React.FC<any> = (props: any) => {
  const [value, setValue] = useState<any>({
    channel: 0,
    status: 0,
    sort: 0,
    creator: [0],
  });

  const changeHighConfig = (val: any) => {
    setValue(val);
  };
  const [pageNo, setPageNo] = useState<number>(1);

  const { loading, faqList, totalSize, getFaqList, getMoreFaqList } = useFaqModal();

  useEffect(() => {
    // getFaqList({ pageNo: 1 });
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => {
      console.log(keys);
      return setSelectedRowKeys(keys);
    },
  };

  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.back();
            }}
          />
          问题回收站
        </div>

        <div className={style['page_top__right']}>
          <Input.Search style={{ marginRight: '16px', width: '280px' }}></Input.Search>
          <Button>批量删除</Button>
        </div>
      </div>

      <div className={style['page_content']}>
        <div className={style['main-content']}>
          <div className={style['high-config-select']}>
            <Collapse>
              <Panel header="问答列表" key="1" extra={<SettingOutlined />}>
                <HighConfigSelect value={value} onChange={changeHighConfig} />
              </Panel>
            </Collapse>
          </div>
          <QuestionList hasCheckbox={true}></QuestionList>
        </div>
      </div>
    </div>
  );
};

export default RecyclePage;
