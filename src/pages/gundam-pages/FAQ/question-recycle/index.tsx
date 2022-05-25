import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Select,
  Collapse,
  Divider,
  Skeleton,
  Checkbox,
  message,
  Popconfirm,
} from 'antd';
import { ArrowLeftOutlined, DownOutlined, LeftOutlined, SettingOutlined } from '@ant-design/icons';
import HighConfigSelect from '../FAQ-manage/components/high-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import style from './style.less';
import { useFaqModal, useTreeModal } from '../FAQ-manage/model';
import ProList from '@ant-design/pro-list';
import QuestionList from '../components/question-list';
import { history, useModel } from 'umi';
import { deleteRecycle } from '../FAQ-manage/model/api';
import config from '@/config';
import ClassifyModal from '../components/classify-modal';

const { Panel } = Collapse;
const { Option } = Select;

const RecyclePage: React.FC<any> = (props: any) => {
  const QuestionRef = useRef(null);
  const classifyRef = useRef<any>({});

  const [value, setValue] = useState<any>({
    channelList: ['all'],
    orderType: 1,
    creatorList: null,
  });

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { getCreateUser } = useModel('drawer' as any, (model: any) => ({
    getCreateUser: model.getCreateUser,
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
    getCreateUser(info.id, 0);
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

  const _deleteRecycle = async () => {
    let data = (QuestionRef?.current as any)?.deleteRecycle();
    console.log(data);
    if (!data.length) {
      message.warning('请选择问题');
      return;
    }

    await deleteRecycle({ faqIds: data }).then((res) => {
      if (res.resultCode == config.successCode) {
        message.success(res.resultDesc);
      } else {
        message.error(res.resultDesc);
      }
      (QuestionRef?.current as any)?.CurrentPage();
    });
  };
  const openClassify = (item: any) => {
    classifyRef.current?.open(item);
  };

  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.push('/gundamPages/faq/main');
            }}
          />
          问题回收站
        </div>

        <div className={style['page_top__right']}>
          <Input.Search
            allowClear
            style={{ marginRight: '16px', width: '280px' }}
            onChange={(e: any) => {
              setSearchText(e.target.value);
            }}
            onSearch={(text: any) => {
              (QuestionRef?.current as any)?.CurrentPage({ searchText: text });
            }}
            onPressEnter={() => {
              (QuestionRef?.current as any)?.CurrentPage();
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
                <HighConfigSelect value={value} onChange={changeHighConfig} isRecycle={1} />
              </Panel>
            </Collapse>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'initial' }}>
            <div style={{ paddingTop: '4px' }}>
              <Checkbox onChange={checkboxChange} style={{ marginBottom: '24px' }}></Checkbox>
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
                  _deleteRecycle();
                }}
              >
                <Button>批量删除</Button>
              </Popconfirm>
            </div>
          </div>
          <QuestionList
            cref={QuestionRef}
            hasCheckbox={true}
            openClassify={openClassify}
            childList={childList}
            searchText={searchText}
            heightSelect={value}
            isRecycle={1}
            deleteRecycle={deleteRecycle}
          ></QuestionList>
        </div>
      </div>

      <ClassifyModal cref={classifyRef} treeData={treeData}></ClassifyModal>
    </div>
  );
};

export default RecyclePage;
