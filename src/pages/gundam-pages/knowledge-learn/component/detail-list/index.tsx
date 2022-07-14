import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailModel } from '../../model';
import style from './style.less';

const DetailList: React.FC = (props: any) => {
  const [detailInfo, setDetailInfo] = useState<any>();
  const { list, totalPage, getList, loading } = useDetailModel();
  const DetailTableRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const columns: any[] = [
    {
      title: '样本',
      dataIndex: 'textValue',
      fixed: 'left',
      ellipsis: true,
      // width: 180,
      render: (val: any, row: any) => {
        return (
          <div>
            <Tooltip placement="topLeft" title={row.textOneValue}>
              <div className={style['btn']}>{row.textOneValue}</div>
            </Tooltip>
            <Tooltip placement="topLeft" title={row.textTwoValue}>
              <div className={style['btn']}>{row.textTwoValue}</div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '所属标准问或意图',
      dataIndex: 'textName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return (
          <div>
            <Tooltip placement="topLeft" title={row.textOneName}>
              <div className={style['btn']}>{row.textOneName}</div>
            </Tooltip>
            <Tooltip placement="topLeft" title={row.textTwoName}>
              <div className={style['btn']}>{row.textTwoName}</div>
            </Tooltip>
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
              <Button type="link" disabled={row.handleStatus == 2 ? true : false}>
                合并到本项
              </Button>
              <Button type="link" disabled={row.handleStatus == 2 ? true : false}>
                合并到本项
              </Button>
            </div>
            <Button
              type="link"
              disabled={row.handleStatus == 2 ? true : false}
              style={{ marginLeft: '16px' }}
            >
              白名单
            </Button>
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
              <Button
                type="link"
                disabled={row.handleStatus == 2 ? true : false}
                onClick={() => {
                  openSelectFaqModal('textOneValue', row);
                }}
              >
                转移样本
              </Button>
              <Button
                type="link"
                disabled={row.handleStatus == 2 ? true : false}
                onClick={() => {
                  openSelectFaqModal('textTwoValue', row);
                }}
              >
                转移样本
              </Button>
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
        1: { text: '待处理', status: 'Error' },
        2: { text: '已处理', status: 'Success' },
      },
      // width: 200,
    },
  ];

  useEffect(() => {
    const query: any = history?.location?.state;
    console.log(query);
    setDetailInfo(query?.info);
  }, []);

  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = async (list: any[]) => {
    console.log(list);
  };

  // 打开选择FAQ/意图模态框
  const openSelectFaqModal = (num: any, row: any) => {
    console.log(row);

    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      selectedWishKeys: [], // 已选意图
      question: row?.[num],
    });
  };

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
          检测批次ID：{detailInfo?.id}
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
        headerTitle={
          <span>
            本次检测样本总量<span style={{ color: '#1890FF' }}>{detailInfo?.sampleTotal}</span>
            ，异常样本量
            <span style={{ color: '#1890FF' }}>{detailInfo?.abnormalSampleAmount}</span>，已复核
            <span style={{ color: '#1890FF' }}>{detailInfo?.reviewAmount}</span>
          </span>
        }
        // toolBarRender={() => []}
      />

      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        type={'radio'}
        min={1}
        max={1}
        readOnly={true}
      />
    </div>
  );
};

export default DetailList;
