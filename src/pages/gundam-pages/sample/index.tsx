import { Input, Button, Row, Col, Space, Popconfirm } from 'antd';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { useModel, history } from 'umi';
import { useSampleModel } from './model';
import SimilarCom from './components/similarCom';
import RemoveCom from './components/removeCom';
import SameModal from './components/sameModal';
import styles from './index.less';

const { Search } = Input;

export default () => {
  const actionRef = useRef<any>();

  const [similar, setSimmilar] = useState<boolean>(false);
  const [columns, setcolumns] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getList } = useSampleModel();

  useEffect(() => {
    let historyData = history?.location || {};
    let pageType = historyData?.state?.pageType || '';
    if (pageType === 'wish') {
      setcolumns(tableListWish);
    }
    if (pageType === 'FAQ') {
      setcolumns(tableListFAQ);
    }
  }, []);

  const getInitTable = async (payload: any) => {
    let params = {
      page: payload.current,
      pageSize: payload.pageSize,
      robotId: info.id,
    };
    let res: any = await getList(params);
    return {
      data: res?.data?.list || [],
      total: res?.data.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const onSearch = (value: string) => {
    let params = {};
    getInitTable(params);
  };

  const add = () => {
    setSimmilar(true);
  };

  const stillAdd = () => {};

  const cancelAdd = () => {
    setSimmilar(false);
  };

  const edit = (action: any, record: any) => {
    action?.startEditable?.(record.id);
  };

  const removeWish = (record: any) => {
    setVisible(true);
    setModalData(record);
  };

  const close = () => {
    setVisible(false);
  };

  const closeSame = () => {
    setSimmilar(false);
  };

  const save = () => {
    actionRef?.current?.reloadAndRest();
  };

  const saveSame = () => {
    setSimmilar(false);
  };
  const removeFAQ = (record: any) => {};

  const deleteRow = (record: any) => {};

  const saveRow = async (record: any) => {};

  const tableListWish: any = [
    {
      dataIndex: 'entityName',
      title: '语料文本',
      ellipsis: true,
      fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'creator',
      title: '更新人',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      dataIndex: 'createTime',
      title: '添加时间',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="editable" onClick={() => edit(action, record)}>
              编辑
            </a>
            <a key="editable" onClick={() => removeWish(record)}>
              转移
            </a>
            <Popconfirm
              title="确认删除该条词槽吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => deleteRow(record)}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const tableListFAQ: any = [
    {
      dataIndex: 'entityName',
      title: '相似问法',
      ellipsis: true,
      fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'creator',
      title: '浏览次数',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      dataIndex: 'createTime',
      title: '添加时间',
      search: false,
      ellipsis: true,
      width: 120,
      editable: (t: any, r: any, i: any) => {
        return false;
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <a key="editable" onClick={() => edit(action, record)}>
              编辑
            </a>
            <a key="editable" onClick={() => removeFAQ(record)}>
              转移
            </a>
            <Popconfirm
              title="确认删除该条词槽吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => deleteRow(record)}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.sample}>
      <div className={styles.sample_flex}>
        <div className={styles.left_box}>
          <div className={styles.title}>意图名称</div>
          <Row className={styles.search_box}>
            <Col span={14}>
              <Input placeholder="输入语料意图" allowClear maxLength={200} />
            </Col>
            <Col span={3}>
              <Space>
                <Button type="primary" onClick={add}>
                  添加
                </Button>
                {/* {similar && (
                  <Button type="primary" onClick={stillAdd}>
                    仍然添加
                  </Button>
                )}
                {similar && <Button onClick={cancelAdd}>取消</Button>} */}
              </Space>
            </Col>
            <Col span={6}>
              {!similar && <Search placeholder="搜索相似语料" onSearch={onSearch} />}
            </Col>
          </Row>
          <ProTable
            rowKey={(record) => record?.id}
            scroll={{ x: columns.length * 200 }}
            actionRef={actionRef}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            options={false}
            editable={{
              type: 'single',
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
              onSave: (key: any, row: any, originRow: any, newLine?: any) => {
                return saveRow(row);
              },
            }}
            request={async (params = {}) => {
              return getInitTable(params);
            }}
          />
        </div>
        {similar && <SimilarCom />}
      </div>
      <RemoveCom visible={visible} modalData={modalData} close={close} save={save} />
      <SameModal visible={similar} cancel={closeSame} saveSame={saveSame} />
    </div>
  );
};
