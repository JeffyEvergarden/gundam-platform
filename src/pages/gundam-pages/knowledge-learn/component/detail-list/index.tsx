import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailModel, useWhiteModel } from '../../model';
import style from './style.less';

const DetailList: React.FC = (props: any) => {
  const [detailInfo, setDetailInfo] = useState<any>();
  const { resData, list, totalPage, getList, sampleTransfer, loading } = useDetailModel();
  const { addWhite } = useWhiteModel();
  const DetailTableRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});

  const [visible, setVisible] = useState<any>(false);
  const [selectInfo, setSelectInfo] = useState<any>();
  const [selectNum, setSelectNum] = useState<any>();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const tType = {
    faq: 'FAQ',
    similar: '【相似问】',
    intent: '【意图】',
  };

  const columns: any[] = [
    {
      title: '样本',
      dataIndex: 'textName',
      fixed: 'left',
      search: false,
      ellipsis: true,
      width: 180,
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
      title: '所属标准问或意图',
      dataIndex: 'textRelationName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return (
          <div>
            <Tooltip placement="topLeft" title={row.textOneRelationName}>
              <div className={style['btn']}>{row.textOneRelationName}</div>
            </Tooltip>
            <Tooltip placement="topLeft" title={row.textTwoRelationName}>
              <div className={style['btn']}>{row.textTwoRelationName}</div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '相似度',
      dataIndex: 'score',
      search: false,
      width: 100,
    },
    {
      title: '样本对操作',
      dataIndex: 'creator',
      search: false,
      width: 200,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            <div className={style['tb']}>
              <Button
                type="link"
                disabled={row.handleStatus == 2 || row.textTwoType == 'faq' ? true : false}
                onClick={() => {
                  setVisible(true);
                  setSelectInfo(row);
                  setSelectNum(1);
                }}
              >
                合并到本项
              </Button>
              <Button
                type="link"
                disabled={row.handleStatus == 2 || row.textOneType == 'faq' ? true : false}
                onClick={() => {
                  setVisible(true);
                  setSelectInfo(row);
                  setSelectNum(2);
                }}
              >
                合并到本项
              </Button>
            </div>
            <Popconfirm
              title="是否添加到白名单"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                addWhite(row).then((res: any) => {
                  if (res) {
                    DetailTableRef?.current?.reload();
                  }
                });
              }}
              disabled={row.handleStatus == 2 ? true : false}
            >
              <Button
                type="link"
                disabled={row.handleStatus == 2 ? true : false}
                style={{ marginLeft: '16px' }}
              >
                白名单
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: '单样本操作',
      dataIndex: 'creator',
      search: false,
      width: 150,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            <div className={style['tb']}>
              <Button
                type="link"
                disabled={row.handleStatus == 2 || row.textOneType == 'faq' ? true : false}
                onClick={() => {
                  setSelectInfo(row);
                  setSelectNum(3);
                  openSelectFaqModal('textOneValue', row);
                }}
              >
                转移样本
              </Button>
              <Button
                type="link"
                disabled={row.handleStatus == 2 || row.textTwoType == 'faq' ? true : false}
                onClick={() => {
                  setSelectInfo(row);
                  setSelectNum(4);
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
      fieldProps: {
        placeholder: '请选择',
      },
      valueEnum: {
        1: { text: '待处理', status: 'Error' },
        2: { text: '已处理', status: 'Success' },
      },
      width: 150,
    },
  ];

  useEffect(() => {
    const query: any = history?.location?.state;
    console.log(history);
    setDetailInfo(query?.info);
    DetailTableRef?.current?.reload();
  }, []);

  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = async (list: any[]) => {
    console.log(list);
    let res: any;
    if (selectNum == 3) {
      res = sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textOneId,
        sampleType: selectInfo.textOneType,
        transferType: list?.[0]?.recommendType == 1 ? 'faq' : 'intent',
        transferId: list?.[0]?.recommendId,
        sample: selectInfo.textOneName,
      });
    }
    if (selectNum == 4) {
      res = sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textTwoId,
        sampleType: selectInfo.textTwoType,
        transferType: list?.[0]?.recommendType == 1 ? 'faq' : 'intent',
        transferId: list?.[0]?.recommendId,
        sample: selectInfo.textTwoName,
      });
    }
    if (res) {
      setVisible(false);
      DetailTableRef?.current?.reload();
    }
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

  const handleOk = () => {
    console.log(selectInfo);

    let res: any;
    if (selectNum == 1) {
      res = sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textTwoId,
        sampleType: selectInfo.textTwoType,
        transferType: selectInfo.textOneType,
        transferId: selectInfo.textOneValue,
        sample: selectInfo.textTwoName,
      });
    }
    if (selectNum == 2) {
      res = sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textOneId,
        sampleType: selectInfo.textOneType,
        transferType: selectInfo.textTwoType,
        transferId: selectInfo.textTwoValue,
        sample: selectInfo.textOneName,
      });
    }
    if (res) {
      setVisible(false);
      DetailTableRef?.current?.reload();
    }
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
          检测批次ID：{(detailInfo?.id || resData?.id || history?.location?.query?.id) ?? '-'}
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
            batchId: detailInfo?.id || history?.location?.query?.id,
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
        search={{
          labelWidth: 'auto',
        }}
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
            本次检测样本总量
            <span style={{ color: '#1890FF' }}>
              {(detailInfo?.sampleTotal || resData?.sampleTotal) ?? '-'}
            </span>
            ，异常样本量
            <span style={{ color: '#1890FF' }}>
              {(detailInfo?.abnormalSampleAmount || resData?.abnormalSampleAmount) ?? '-'}
            </span>
            ，已复核
            <span style={{ color: '#1890FF' }}>
              {(detailInfo?.reviewAmount || resData?.reviewAmount) ?? '-'}
            </span>
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

      <Modal
        title={'样本归纳提示'}
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
        }}
      >
        {selectNum == 1
          ? `“${selectInfo?.textTwoName}”将归纳到${tType[selectInfo?.textOneType]}“${
              selectInfo?.textOneName
            }”`
          : `“${selectInfo?.textOneName}”将归纳到${tType[selectInfo?.textTwoType]}“${
              selectInfo?.textTwoName
            }”`}
      </Modal>
    </div>
  );
};

export default DetailList;
