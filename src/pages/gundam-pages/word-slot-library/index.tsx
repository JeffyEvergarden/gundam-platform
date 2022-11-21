import Tip from '@/components/Tip';
import config from '@/config/index';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
// import { wordSlotTableList } from './comps/config';
import OperateSlotModal from './comps/operateSlotModal';
import { useKeyWordModel } from './model';

// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [operModalVisible, handleOperModalVisible] = useState<boolean>(false);
  const [operModalData, handleOperModalData] = useState<any>({});
  const [operModalTitle, handleOperModalTitle] = useState<string>('');

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));
  const { getWordSlotTable, deleteWordSlot } = useKeyWordModel();

  const wordSlotTableList: any = [
    {
      dataIndex: 'slotName',
      title: '词槽名称',
      fixed: 'left',
    },
    {
      dataIndex: 'slotDesc',
      title: '描述',
      ellipsis: true,
    },
    {
      dataIndex: 'slotSource',
      title: () => (
        <>
          {'词槽来源'}
          <Tip
            title={
              '分别为枚举实体、正则实体、用户文本、接口，决定词槽的填充方式。例如来自“用户文本”，会将客户文本填充至词槽；“接口“则会调用配置的接口，将返回值填充至词槽。'
            }
          />
        </>
      ),
      valueEnum: {
        0: { text: '枚举实体', status: 0 },
        // 1: { text: '来自意图', status: 1 },
        2: { text: '用户文本', status: 2 },
        // 3: { text: '规则模版', status: 3 },
        4: { text: '正则实体', status: 4 },
        // 5: { text: '函数返回值', status: 5 },
        // 6: { text: '全局变量', status: 6 },
        7: { text: '接口', status: 7 },
        // 8: { text: '业务参数', status: 8 },
        9: { text: '图谱', status: 9 },
      },
    },
    // {
    //   dataIndex: 'nodeName',
    //   title: '所属节点',
    // },
    {
      dataIndex: 'connectTimes',
      title: '应用次数',
    },
    // {
    //   dataIndex: 'entity',
    //   title: '引用实体',
    // },
    {
      dataIndex: 'creator',
      title: '创建者',
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
    },
  ];

  const getInitTable = async (p?: any) => {
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');
    const [pageData] = p;
    let data: any = [];
    try {
      let params = {
        robotId: info.id,
        occurTime: occurDay + ' ' + newTime,
        page: pageData?.current,
        ...pageData,
      };
      delete params?.current;
      const res = await getWordSlotTable(params);
      return {
        data: res?.data.list || [],
        total: res?.data?.totalPage,
        current: pageData.current,
        pageSize: pageData.pageSize,
      };
    } catch {
      return {
        data: data,
        total: data?.length || 0,
        current: pageData.current || 1,
        pageSize: pageData.pageSize,
      };
    }
  };

  const operateSlotSuccess = () => {
    handleOperModalVisible(false);
    refreshTable();
  };

  const operateSlotCancel = () => {
    handleOperModalVisible(false);
    refreshTable();
  };

  const operate = (data: any, type: string) => {
    console.log(data);

    handleOperModalVisible(true);
    handleOperModalData(data);
    handleOperModalTitle(type);
  };

  const deleteSlot = async (data: any) => {
    const res: any = await deleteWordSlot({ robotId: info.id, id: data.id });
    if (res?.resultCode == config.successCode) {
      message.success(res?.resultDesc);
      refreshTable();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const operationList = {
    dataIndex: 'operation',
    title: '操作',
    fixed: 'right',
    render: (text: any, record: any) => {
      return (
        <Space>
          <a onClick={() => operate(record, 'edit')}>编辑</a>
          <Popconfirm
            title="确认删除该条词槽吗?"
            okText="是"
            cancelText="否"
            onCancel={() => {}}
            onConfirm={() => deleteSlot(record)}
            disabled={record.slotSource == 9}
          >
            <a style={{ color: record.slotSource == 9 ? 'rgba(0,0,0,.4)' : 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      );
    },
  };

  const refreshTable = () => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  };

  return (
    <React.Fragment>
      <ProTable
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => operate({}, 'add')}>
            新增词槽
          </Button>,
        ]}
        headerTitle={
          <>
            词槽管理
            <Tip
              title={
                <div>
                  {' '}
                  词槽是用于对话中存放关键信息的变量，可以从客户文本中获取（客户文本、枚举实体、正则实体），也可以调用预定义接口进行获取（来自接口）。词槽可以用于连线判断、插入话术文本中、作为接口的入参。
                  <br />
                  例如，新建一个来自“城市”实体（实体内容广州、深圳、北京）的词槽“目的地”，并在节点处设置关联。当对话进入该节点，机器人会进行询问“请问您想去哪里？”，当客户回复的文本“我想去广州”中带有枚举实体“城市”的内容，则将具体的城市“广州”填入“目的地”中。
                </div>
              }
            />
          </>
        }
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: wordSlotTableList.length * 200 }}
        rowKey={(record) => Math.random()}
        columns={[...wordSlotTableList, operationList]}
        // options={false}
        search={false}
        request={async (...params) => {
          return getInitTable(params);
        }}
      />

      <OperateSlotModal
        visible={operModalVisible}
        title={operModalTitle}
        modalData={{ ...operModalData, robotId: info.id }}
        onSubmit={operateSlotSuccess}
        onCancel={operateSlotCancel}
      />
    </React.Fragment>
  );
};

export default DetailPages;
