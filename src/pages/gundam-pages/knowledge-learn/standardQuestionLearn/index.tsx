import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.less';
import ProTable from '@ant-design/pro-table';
import { Space, Divider, Tooltip, Dropdown, Button, Menu } from 'antd';
import { useStandard } from './model';
import { DownOutlined } from '@ant-design/icons';
import SessionRecord from './../component/sessionRecord';

export default () => {
  const actionRef = useRef<any>();

  const { getList } = useStandard();

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);
  const [selectRow, setSelectRow] = useState<any>(null);
  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  const getInitTable = async (payload: any) => {
    let res = await getList();

    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const handleMenuClick = (r: any) => {
    setVisibleSession(true);
    setModalData(r);
  };

  const openSession = (r: any) => {
    setVisibleSession(true);
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
  return (
    <Fragment>
      <div className={styles.stardard}>
        <div className={styles.topBox}>
          <div>
            <ArrowLeftOutlined
              style={{ marginRight: '6px', color: '#1890ff' }}
              onClick={() => {}}
            />
            问题: {'贷款审批结果'}
          </div>
          <div>
            <Space>
              <a>查看答案</a>
              <Divider type="vertical" />
              <a>现有相似问</a>
            </Space>
          </div>
        </div>
        <ProTable
          headerTitle={'未知问题列表'}
          rowKey={'id'}
          actionRef={actionRef}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          search={false}
          pagination={{
            pageSize: 10,
          }}
          toolBarRender={() => [
            <Dropdown overlay={menu} key="Dropdown">
              <Button type="primary">
                <Space>
                  批量处理
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={async (params) => {
            return getInitTable({ params });
          }}
          rowSelection={rowSelection}
        />
      </div>{' '}
      <SessionRecord visible={visibleSession} onCancel={cancelSession} modalData={modalData} />
    </Fragment>
  );
};
