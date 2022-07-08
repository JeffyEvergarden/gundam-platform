import { ArrowLeftOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailModel } from '../../model';
import style from './style.less';

const DetailList: React.FC = (props: any) => {
  const [detailInfo, setDetailInfo] = useState<any>();
  const { list, totalPage, getList, loading } = useDetailModel();
  const DetailTableRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const columns: any[] = [
    {
      title: '样本',
      dataIndex: 'textValue',
      // fixed: 'left',
      ellipsis: true,
      // width: 180,
      render: (val: any, row: any) => {
        return (
          <div>
            <div>{row.textOneValue}</div>
            <div>{row.textTwoValue}</div>
          </div>
        );
      },
    },
    {
      title: '所属标准问或意图',
      dataIndex: 'textType',
      search: false,
      // width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return (
          <div>
            <div>{row.textOneType}</div>
            <div>{row.textTwoType}</div>
          </div>
        );
      },
    },
    {
      title: '相似度',
      dataIndex: 'score',
      search: false,
      // width: 200,
    },
    {
      title: '样本对操作',
      dataIndex: 'creator',
      search: false,
      // width: 200,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            <div className={style['tb']}>
              <a>合并到本项</a>
              <a>合并到本项</a>
            </div>
            <a style={{ marginLeft: '16px' }}>白名单</a>
          </div>
        );
      },
    },
    {
      title: '单样本操作',
      dataIndex: 'creator',
      search: false,
      // width: 200,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            <div className={style['tb']}>
              <a>转移样本</a>
              <a>转移样本</a>
            </div>
          </div>
        );
      },
    },
    {
      title: '处理状态',
      dataIndex: 'handleStatus',
      search: false,
      valueEnum: {
        1: { text: '待处理' },
        2: { text: '已处理' },
      },
      // width: 200,
    },
  ];

  useEffect(() => {
    const query: any = history?.location?.state;
    console.log(query);
    setDetailInfo(query?.info);
  }, []);

  return (
    <div className={`${style['machine-page']} list-page`}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.push('/gundamPages/knowledgeLearn/batchTest');
            }}
          />
          推荐问设置
        </div>
      </div>
      <ProTable<any>
        columns={columns}
        actionRef={DetailTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return getList({
            robotId: info.id,
            page: params.current,
            // batchId: detailInfo.id,
            ...params,
          });
          // return {};
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={false}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          // 查询参数转化
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle={`本次检测样本总量${detailInfo?.sampleTotal},异常样本量${detailInfo?.abnormalSampleAmount},已复核${detailInfo?.reviewAmount}`}
        // toolBarRender={() => []}
      />
    </div>
  );
};

export default DetailList;
