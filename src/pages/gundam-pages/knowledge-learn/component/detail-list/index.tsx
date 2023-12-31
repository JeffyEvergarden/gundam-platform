import Tip from '@/components/Tip';
import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Popconfirm, Tabs, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailModel, useWhiteModel } from '../../model';
import style from './style.less';

const { TabPane } = Tabs;

const DetailList: React.FC = (props: any) => {
  const [detailInfo, setDetailInfo] = useState<any>();
  const { resData, list, totalPage, getList, sampleTransfer, loading, SLoading, unsimilarList } =
    useDetailModel();
  const { addWhite } = useWhiteModel();
  const DetailTableRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});
  const unSimilarTableRef = useRef<any>({});

  const [visible, setVisible] = useState<any>(false);
  const [selectInfo, setSelectInfo] = useState<any>();
  const [selectNum, setSelectNum] = useState<any>();
  const [tabkey, setTabKey] = useState<any>('1');
  const [paramsObj, setParamsObj] = useState<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const tType = {
    faq: '【FAQ】',
    similar: '【FAQ】',
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
      title: () => (
        <>
          {'所属标准问或意图'}
          <Tip
            title={
              '异常样本所属的标准问或意图，点击标头可以根据样本一所属的标准问/意图下，异常样本总量进行排序。默认倒序排列，可以统一处理异常样本较多的标准问/意图。'
            }
          />
        </>
      ),
      dataIndex: 'textRelationName',
      search: false,
      width: 200,
      ellipsis: true,
      sorter: true,
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
      title: () => (
        <>
          {'相似度'}
          <Tip title={'样本一和样本二之间的相似度，越高代表越相似，但也有可能计算错误。'} />
        </>
      ),
      sorter: true,
      dataIndex: 'score',
      search: false,
      width: 100,
    },
    {
      title: () => (
        <>
          {'样本对操作'}
          <Tip
            title={`合并到本项：点击将样本对的另一个样本，加入到本样本所属的标准问或意图，从而解决混淆问题。
            白名单：点击将此样本对加入检测白名单，后续的检测结果如果存在于白名单，则不展示。加入白名单认为，这个样本对所属的意图或FAQ是没问题的。`}
          />
        </>
      ),
      dataIndex: 'creator',
      search: false,
      width: 200,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            {tabkey == '1' && (
              <div className={style['tb']}>
                <Button
                  type="link"
                  disabled={
                    row.handleStatus == 2 || row.textTwoType == 'faq' || resData?.batchExpired
                      ? true
                      : false
                  }
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
                  disabled={
                    row.handleStatus == 2 || row.textOneType == 'faq' || resData?.batchExpired
                      ? true
                      : false
                  }
                  onClick={() => {
                    setVisible(true);
                    setSelectInfo(row);
                    setSelectNum(2);
                  }}
                >
                  合并到本项
                </Button>
              </div>
            )}
            <Popconfirm
              title="是否添加到白名单"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                addWhite({
                  ...row,
                  textOneType: row.textOneType == 'similar' ? 'faq' : row.textOneType,
                  textTwoType: row.textTwoType == 'similar' ? 'faq' : row.textTwoType,
                  detailId: row.id,
                  source: row.source,
                }).then((res: any) => {
                  if (res) {
                    if (tabkey == '1') {
                      DetailTableRef?.current?.reload();
                    }
                    if (tabkey == '2') {
                      unSimilarTableRef?.current?.reload();
                    }
                  }
                });
              }}
              disabled={row.handleStatus == 2 || resData?.batchExpired ? true : false}
            >
              <Button
                type="link"
                disabled={row.handleStatus == 2 || resData?.batchExpired ? true : false}
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
      title: () => (
        <>
          {'单样本操作'}
          <Tip title={'点击转移样本，将样本转移至指定的意图或FAQ下，以解决样本对混淆的问题。'} />
        </>
      ),
      dataIndex: 'creator',
      search: false,
      width: 150,
      render: (val: any, row: any) => {
        return (
          <div className={style['lf']}>
            <div className={style['tb']}>
              <Button
                type="link"
                disabled={
                  row.handleStatus == 2 || row.textOneType == 'faq' || resData?.batchExpired
                    ? true
                    : false
                }
                onClick={() => {
                  setSelectInfo(row);
                  setSelectNum(3);
                  openSelectFaqModal('textOneName', row);
                }}
              >
                转移样本
              </Button>
              <Button
                type="link"
                disabled={
                  row.handleStatus == 2 || row.textTwoType == 'faq' || resData?.batchExpired
                    ? true
                    : false
                }
                onClick={() => {
                  setSelectInfo(row);
                  setSelectNum(4);
                  openSelectFaqModal('textTwoName', row);
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
    if (tabkey == '1') {
      DetailTableRef?.current?.reload();
    }
    if (tabkey == '2') {
      unSimilarTableRef?.current?.reload();
    }
  }, []);

  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = async (list: any[], inputValue: any) => {
    console.log(list);
    console.log(inputValue);

    if (!list.length) {
      message.warning('请选择有效的标准问/意图');
      return false;
    }
    let res: any;
    if (selectNum == 3) {
      res = await sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textOneId,
        sampleType: selectInfo.textOneType,
        transferType: list?.[0]?.recommendType == 1 ? 'faq' : 'intent',
        transferId: list?.[0]?.recommendId,
        sample: inputValue,
        batchId: detailInfo?.batchId || resData?.batchId || history?.location?.query?.batchId,
        source: selectInfo?.source,
      });
    }
    if (selectNum == 4) {
      res = await sampleTransfer({
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textTwoId,
        sampleType: selectInfo.textTwoType,
        transferType: list?.[0]?.recommendType == 1 ? 'faq' : 'intent',
        transferId: list?.[0]?.recommendId,
        sample: inputValue,
        batchId: detailInfo?.batchId || resData?.batchId || history?.location?.query?.batchId,
        source: selectInfo?.source,
      });
    }
    if (res) {
      setVisible(false);
      if (tabkey == '1') {
        DetailTableRef?.current?.reload();
      }
      if (tabkey == '2') {
        unSimilarTableRef?.current?.reload();
      }
      return true;
    }
    return false;
  };

  // 打开选择FAQ/意图模态框
  const openSelectFaqModal = (num: any, row: any) => {
    console.log(row);

    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      disabledWishKeys: [num == 'textOneName' ? row.textOneValue : row.textTwoValue],
      disabledQuestionKeys: [num == 'textOneName' ? row.textOneValue : row.textTwoValue],
      selectedWishKeys: [], // 已选意图
      question: row?.[num],
    });
  };

  const handleOk = async () => {
    console.log(selectInfo);

    let res: any;
    if (selectNum == 1) {
      res = await sampleTransfer({
        batchId: detailInfo?.batchId || resData?.batchId || history?.location?.query?.batchId,
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textTwoId,
        sampleType: selectInfo.textTwoType,
        transferType: selectInfo.textOneType == 'similar' ? 'faq' : selectInfo.textOneType,
        transferId: selectInfo.textOneValue,
        sample: selectInfo.textTwoName,
        source: selectInfo?.source,
      });
    }
    if (selectNum == 2) {
      res = await sampleTransfer({
        batchId: detailInfo?.batchId || resData?.batchId || history?.location?.query?.batchId,
        robotId: info.id,
        detailId: selectInfo.id,
        sampleId: selectInfo.textOneId,
        sampleType: selectInfo.textOneType,
        transferType: selectInfo.textTwoType == 'similar' ? 'faq' : selectInfo.textTwoType,
        transferId: selectInfo.textTwoValue,
        sample: selectInfo.textOneName,
        source: selectInfo?.source,
      });
    }
    if (res) {
      setVisible(false);
      if (tabkey == '1') {
        DetailTableRef?.current?.reload();
      }
      if (tabkey == '2') {
        unSimilarTableRef?.current?.reload();
      }
    }
  };

  const tabsChange = (activeKey: any) => {
    setTabKey(activeKey);
  };

  // orderCode  '1'-所属标准问或意图  '2'-相似度得分
  //  orderType   '1'-升序 '2'-降序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp: any = { orderCode: undefined, orderType: undefined };
    if (sorter.columnKey === 'textRelationName' && sorter.order === 'ascend') {
      temp.orderCode = 1;
      temp.orderType = 1;
    }
    if (sorter.columnKey === 'textRelationName' && sorter.order === 'descend') {
      temp.orderCode = 1;
      temp.orderType = 2;
    }
    if (sorter.columnKey === 'score' && sorter.order === 'ascend') {
      temp.orderCode = 2;
      temp.orderType = 1;
    }
    if (sorter.columnKey === 'score' && sorter.order === 'descend') {
      temp.orderCode = 2;
      temp.orderType = 2;
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  return (
    <div className={`${style['machine-page']} list-page`}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <span>
            <ArrowLeftOutlined
              className={style['blue']}
              style={{ marginRight: '6px' }}
              onClick={() => {
                history.push('/gundamPages/knowledgeLearn/batchTest');
              }}
            />
            检测批次ID：
            {(detailInfo?.batchId || resData?.batchId || history?.location?.query?.batchId) ?? '-'}
          </span>
          <span>
            本次检测样本总量
            <span style={{ color: '#1890FF' }}>{resData?.sampleTotal ?? '-'}</span>
            ，异常样本量
            <span style={{ color: '#1890FF' }}>{resData?.abnormalSampleAmount ?? '-'}</span>
            ，已复核
            <span style={{ color: '#1890FF' }}>{resData?.reviewAmount ?? '-'}</span>
          </span>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        style={{ width: '100%', backgroundColor: '#fff', paddingLeft: '10px', marginBottom: 0 }}
        onChange={tabsChange}
      >
        <TabPane tab="相似检测" key="1">
          <ProTable<any>
            columns={columns}
            actionRef={DetailTableRef}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              // console.log(sort, filter);
              return getList({
                source: 0,
                robotId: info.id,
                page: params.current,
                batchId: detailInfo?.batchId || history?.location?.query?.batchId,
                ...params,
              });
              // return {};
            }}
            params={paramsObj}
            onChange={tableChange}
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
            toolBarRender={() => []}
          />
        </TabPane>
        <TabPane tab="不相似检测" key="2">
          <ProTable
            columns={columns}
            actionRef={unSimilarTableRef}
            scroll={{ x: columns.length * 200 }}
            request={async (params = {}, sort, filter) => {
              // console.log(sort, filter);
              return unsimilarList({
                source: 1,
                robotId: info.id,
                page: params.current,
                batchId: detailInfo?.batchId || history?.location?.query?.batchId,
                ...params,
              });
              // return {};
            }}
            params={paramsObj}
            onChange={tableChange}
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
            toolBarRender={() => []}
          />
        </TabPane>
      </Tabs>
      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        type={'radio'}
        min={1}
        max={1}
        readOnly={false}
        tableLoading={SLoading}
      />

      <Modal
        title={'样本归纳提示'}
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
        }}
        confirmLoading={SLoading}
      >
        {selectNum == 1
          ? `“${selectInfo?.textTwoName}”将归纳到${tType[selectInfo?.textOneType]}“${
              selectInfo?.textOneRelationName
            }”`
          : `“${selectInfo?.textOneName}”将归纳到${tType[selectInfo?.textTwoType]}“${
              selectInfo?.textTwoRelationName
            }”`}
      </Modal>
    </div>
  );
};

export default DetailList;
