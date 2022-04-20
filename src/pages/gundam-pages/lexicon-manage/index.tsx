import React, { useState, useEffect, useRef, Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import { useLexiconModel } from './model';
import { Space, Button, Tabs, Popconfirm, message } from 'antd';
import OperateModal from './components/modalCompo';
const { TabPane } = Tabs;

const LexiconManage: React.FC = (props: any) => {
  const { getLexiconList, deleteLexicon, addLexicon, editLexicon } = useLexiconModel();
  const actionRef = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [pageType, setPagetype] = useState<string>('');
  const [editObj, setEditObj] = useState<any>({});

  const getInitTable = async (payload: any) => {
    let params = {
      page: payload.current,
      pageSize: payload.pageSize,
      robotId: localStorage.getItem('robot_id'),
    };
    let res: any = await getLexiconList(params);
    return {
      data: res?.data?.list || [],
      total: res?.data.totalPage || res?.data?.list?.length,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const add = () => {
    setVisible(true);
    setPagetype('add');
    setEditObj({});
  };

  const editable = (row: any) => {
    setVisible(true);
    setPagetype('edit');
    setEditObj(row);
  };

  const deleteRow = async (record: any) => {
    let datas = { id: record.id, robotId: record.robotId };
    const res: any = await deleteLexicon(datas);
    if (res.resultCode === '0000') {
      message.success(res.resultDesc);
      actionRef.current.reloadAndRest();
    } else {
      message.warning(res.resultDesc);
    }
  };

  const cancel = () => {
    setVisible(false);
  };

  const save = async (para: any, operateType: string) => {
    let res: any;
    let params = {
      ...para,
      entityType: 1, //0-枚举实体  1-正则实体
    };
    if (pageType === 'add') {
      res = await addLexicon({ ...params });
    } else if (pageType === 'edit') {
      params.id = editObj.id;
      res = await editLexicon({ ...params });
    }
    if (res.resultCode === '0000') {
      message.success(res.resultDesc);
      actionRef.current.reloadAndRest();
      cancel();
    } else {
      message.warning(res.resultDesc);
    }
  };

  const tableList: any = [
    {
      dataIndex: 'entityName',
      title: '正则实体',
      ellipsis: true,
      fixed: 'left',
      width: 200,
    },
    {
      dataIndex: 'entityValueNameStr',
      title: '规则',
      ellipsis: true,
      fixed: 'left',
      width: 200,
    },
    { dataIndex: 'entityDesc', title: '说明', ellipsis: true, fixed: 'left', width: 260 },
    { dataIndex: 'creator', title: '创建人', search: false, ellipsis: true, width: 120 },
    { dataIndex: 'createTime', title: '创建时间', search: false, ellipsis: true, width: 120 },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => editable(record)}>编辑</a>
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
    <Fragment>
      <Tabs type="card" defaultActiveKey="1" size={'small'} style={{ marginBottom: 32 }}>
        <TabPane tab="正则实体" key="1">
          <ProTable
            headerTitle={
              <Space>
                <Button onClick={() => add()}>新增正则实体</Button>
              </Space>
            }
            rowKey={(record) => record?.id}
            scroll={{ x: tableList.length * 200 }}
            actionRef={actionRef}
            columns={tableList}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            options={false}
            request={async (params = {}) => {
              return getInitTable({ page: params.current, ...params });
            }}
          />
        </TabPane>
      </Tabs>
      <OperateModal
        visible={visible}
        type={pageType}
        editObj={editObj}
        save={save}
        onCancel={cancel}
      />
    </Fragment>
  );
};
export default LexiconManage;
