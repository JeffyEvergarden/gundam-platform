import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowLeftOutlined, InfoCircleFilled } from '@ant-design/icons';
import styles from './index.less';
import ProTable from '@ant-design/pro-table';
import { history, useModel } from 'umi';
import { Space, Divider, Tooltip, Dropdown, Button, Menu, Modal } from 'antd';
import { useStandard } from './model';
import { useSimilarModel, useSampleModel } from '@/pages/gundam-pages/sample/model';
import { DownOutlined } from '@ant-design/icons';
import SessionRecord from './../component/sessionRecord';
import AnswerView from '@/pages/gundam-pages/FAQ-module/components/answerView-modal';
export default () => {
  const actionRef = useRef<any>();
  const answerViewRef = useRef<any>(null);

  const { getListUnknown } = useStandard();
  const { getSimilarList } = useSimilarModel();
  const { getList } = useSampleModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);
  const [selectRow, setSelectRow] = useState<any>(null);
  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});
  const [menulabel, setMenuLabel] = useState<string>('批量处理');
  const [rowInfo, setRowInfo] = useState<any>({});
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '1', orderType: '2' });
  const [visible, setVisible] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<any>({});

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  useEffect(() => {
    let historyData = history?.location || {};
    let rowInfo = historyData?.state?.rowInfo || {};
    setRowInfo(rowInfo);
  }, [history]);

  const getInitTable = async (payload: any) => {
    let params = {
      page: payload.page,
      pageSize: payload.pageSize,
      robotId: info.id,
      recommenId: rowInfo.recommendId,
      recommenType: rowInfo.recommendType,
      orderType: payload.orderType,
      orderCode: payload.orderCode,
    };
    let res = await getListUnknown(params);
    setPageInfo(res?.data);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const handleMenuClick = (item: any) => {
    if (item.key == '1') {
      setMenuLabel('批量加入黑名单');
    }
    if (item.key == '2') {
      setMenuLabel('批量添加');
    }
  };

  const openSession = (r: any) => {
    setVisibleSession(true);
    setModalData(r);
  };

  const cancelSession = () => {
    setVisibleSession(false);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: '批量转移',
          key: '1',
        },
        {
          label: '批量通过',
          key: '2',
        },
      ]}
    />
  );

  // orderCode  '1'-分类  '2'-时间
  //  orderType   '1'-升序 '2'-降序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '1', orderType: '2' };
    if (sorter.columnKey === 'createTime' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'createTime' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  const viewAnswer = () => {
    answerViewRef?.current?.open(rowInfo);
  };

  const viewFAQOrIntent = async () => {
    setVisible(true);
  };

  const getListFAQOrIntent = async (payload: any) => {
    let res;
    if (rowInfo.recommendType == '1') {
      //相似问
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        faqId: rowInfo?.recommendId,
        robotId: info.id,
      };
      res = await getSimilarList(params);
    } else if (rowInfo.recommendType == '2') {
      // 意图
      let params = {
        page: payload.current,
        pageSize: payload.pageSize,
        intentId: rowInfo?.recommendId,
      };
      res = await getList(params);
    }
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const columns: any = [
    {
      dataIndex: 'question',
      title: '客户问题',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'askNum',
      title: '咨询次数',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'channelCode',
      title: '渠道',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'source',
      title: '问题来源',
      ellipsis: true,
      valueType: 'select',
      width: 100,
      valueEnum: {
        1: '澄清',
        2: '拒识',
      },
    },
    {
      dataIndex: 'createTime',
      title: '日期时间',
      search: false,
      ellipsis: true,
      width: 200,
      sorter: true,
    },
    {
      title: '操作',
      key: 'option',
      width: 300,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="record" onClick={() => openSession(record)}>
              会话记录
            </a>
            <a key="edit">编辑通过</a>
            <a key="remove">转移</a>
            <a key="addStandar">新增标准问</a>
            <a key="clarify">澄清</a>
            <a key="black">黑名单</a>
          </Space>
        );
      },
    },
  ];

  const columnsFAQOrIntent: any = [
    {
      dataIndex: 'question',
      title: '序号',
      ellipsis: true,
      width: 100,
      render: (t: any, r: any, i: any) => {
        return (Number(pageInfo.page) - 1) * Number(pageInfo.pageSize) + Number(i) + 1;
      },
    },
    {
      dataIndex: 'Similar',
      title: '相似问',
      ellipsis: true,
      render: (t: any, r: any, i: any) => {
        return <span>{rowInfo.recommendType == '1' ? r.similarText : r.corpusText}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <div className={styles.stardard}>
        <div className={styles.topBox}>
          <div>
            <ArrowLeftOutlined
              style={{ marginRight: '6px', color: '#1890ff' }}
              onClick={() => {
                history.goBack();
              }}
            />
            问题: {rowInfo?.recommendName}
          </div>
          <div>
            <Space>
              {rowInfo?.recommendType == '1' && (
                <Fragment>
                  <a onClick={viewAnswer}>查看答案</a>
                  <Divider type="vertical" />
                </Fragment>
              )}
              <a onClick={viewFAQOrIntent}>
                现有{rowInfo.recommendType == '1' ? '相似问' : '样本'}
              </a>
            </Space>
          </div>
        </div>
        <ProTable
          headerTitle={'未知问题列表'}
          rowKey={'id'}
          actionRef={actionRef}
          onChange={tableChange}
          params={paramsObj}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          search={false}
          pagination={{
            pageSize: 10,
          }}
          tableAlertRender={false}
          tableAlertOptionRender={false}
          toolBarRender={() => [
            <Dropdown overlay={menu} key="Dropdown">
              <Button type="primary">
                <Space>
                  {menulabel}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={async (params) => {
            return getInitTable(params);
          }}
          rowSelection={rowSelection}
        />
      </div>{' '}
      <SessionRecord visible={visibleSession} onCancel={cancelSession} modalData={modalData} />
      <AnswerView cref={answerViewRef} />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
        title={rowInfo.recommendType == '1' ? '相似问' : '样本'}
        footer={null}
        width={600}
      >
        <ProTable
          rowKey={(record: any) => record.id}
          headerTitle={false}
          toolBarRender={false}
          bordered
          // actionRef={actionRefFAQOrIntent}
          pagination={{
            pageSize: 10,
          }}
          search={false}
          columns={columnsFAQOrIntent}
          request={async (params = {}) => {
            return getListFAQOrIntent(params);
          }}
        />
      </Modal>
    </Fragment>
  );
};
