import Tip from '@/components/Tip';
import config from '@/config/index';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import EnumModal from './components/enumModal';
import OperateModal from './components/modalCompo';
import styles from './index.less';
import { useLexiconModel } from './model';
const { TabPane } = Tabs;

const LexiconManage: React.FC = (props: any) => {
  const { getLexiconList, deleteLexicon, addLexicon, editLexicon } = useLexiconModel();
  const actionRef = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [pageType, setPagetype] = useState<string>('');
  const [editObj, setEditObj] = useState<any>({});

  const [visibleEnum, setVisibleEnum] = useState<boolean>(false);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const getInitTable = async (payload: any, type: number) => {
    let params = {
      ...payload,
      robotId: info.id,
      entityType: type,
    };
    delete params.current;
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
    if (res.resultCode === config.successCode) {
      message.success(res.resultDesc);
      actionRef.current.reloadAndRest();
    } else {
      message.warning(res.resultDesc);
    }
  };

  const cancel = () => {
    setVisible(false);
    setVisibleEnum(false);
  };

  const save = async (para: any, entityType: string, operateType: string) => {
    let res: any;
    let params = {
      ...para,
      robotId: info.id,
      entityType: entityType, //0-枚举实体  1-正则实体
    };
    if (operateType === 'add') {
      res = await addLexicon({ ...params });
    } else if (operateType === 'edit') {
      params.id = editObj.id;
      res = await editLexicon({ ...params });
    }
    if (res.resultCode === config.successCode) {
      message.success(res.resultDesc);
      actionRef.current.reloadAndRest();
      cancel();
    } else {
      message.warning(res.resultDesc);
    }
  };

  const addEnum = () => {
    setVisibleEnum(true);
    setPagetype('add');
    setEditObj({});
  };

  const editEnum = (record: any) => {
    setVisibleEnum(true);
    setPagetype('edit');
    setEditObj(record);
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
      search: false,
    },
    {
      dataIndex: 'entityDesc',
      title: '说明',
      ellipsis: true,
      fixed: 'left',
      width: 260,
      search: false,
    },
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

  const tableListEnum: any = [
    {
      dataIndex: 'entityName',
      title: '实体名称',
      ellipsis: true,
      fixed: 'left',
      width: 200,
      search: true,
    },
    {
      dataIndex: 'entityValue',
      title: '实体值',
      ellipsis: true,
      fixed: 'left',
      width: 223,
      search: false,
    },
    {
      dataIndex: 'creator',
      title: '更新人',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      dataIndex: 'createTime',
      title: '更新时间',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      dataIndex: 'wordSet',
      title: '词汇量',
      ellipsis: true,
      // fixed: 'left',
      width: 100,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => editEnum(record)}>编辑</a>
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
    <div className={`${styles.lexiconManage} list-page`}>
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        style={{ width: '100%', backgroundColor: '#fff', paddingLeft: '10px', marginBottom: 0 }}
      >
        <TabPane
          tab={
            <>
              {'枚举实体'}
              <Tip
                title={
                  <>
                    {' '}
                    {
                      '枚举实体指实体值可枚举的实体，一个枚举实体可以具有多个实体值。词槽配置来源于枚举实体时，当客户文本中包含枚举值，则把枚举值填入词槽中。'
                    }
                    <br />
                    {`例如：“城市”实体的实体值可设置为“北京”、“上海”、“广州”、“深圳”等；
                    客户说“我想订去北京的机票”，设置“目的地”词槽，选择来自"枚举实体",选择城市，则自动将客户文本中的“北京”填充至“目的地”词槽中。`}
                  </>
                }
              />
            </>
          }
          key="1"
        >
          <ProTable
            toolBarRender={() => [
              <Button key="0" type="primary" onClick={() => addEnum()}>
                新增枚举实体
              </Button>,
            ]}
            rowKey={(record) => record?.id}
            scroll={{ x: tableListEnum.length * 200 }}
            actionRef={actionRef}
            columns={tableListEnum}
            pagination={{
              pageSize: 10,
            }}
            // search={false}
            // options={false}
            request={async (params = {}) => {
              return getInitTable({ page: params.current, ...params }, 0);
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <>
              {'正则实体'}
              <Tip
                title={
                  <>
                    {' '}
                    正则实体指利用正则表达式识别出用户消息中的片段，作为实体值。一个正则实体可以配置多个正则表达式，多个表达式之间是“或”关系，满足其一则把表达式匹配中的内容填充到词槽中。
                    以下为一些常用的正则表达式，可直接复制使用。
                    <br />
                    QQ号：{'[1-9][0-9]{4,}'}
                    <br />
                    手机号：
                    {
                      '(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])[ -]?(d{4})[ -]?(d{4})'
                    }
                    <br />
                    微信号：{'^[a-zA-Z][a-zA-Z0-9_-]{5,19}$'}
                    <br />
                    身份证号：{'^(d{6})(d{4})(d{2})(d{2})(d{3})([0-9]|X)$'}
                    <br />
                  </>
                }
              />
            </>
          }
          key="2"
        >
          <ProTable
            toolBarRender={() => [
              <Button key="0" type="primary" onClick={() => add()}>
                新增正则实体
              </Button>,
            ]}
            rowKey={(record) => record?.id}
            scroll={{ x: tableList.length * 200 }}
            actionRef={actionRef}
            columns={tableList}
            pagination={{
              pageSize: 10,
            }}
            search={false}
            // options={false}
            request={async (params = {}) => {
              return getInitTable({ page: params.current, ...params }, 1);
            }}
          />
        </TabPane>
      </Tabs>
      <EnumModal
        visible={visibleEnum}
        enumData={editObj}
        closeEnum={cancel}
        type={pageType}
        save={save}
      />
      <OperateModal
        visible={visible}
        type={pageType}
        editObj={editObj}
        save={save}
        onCancel={cancel}
      />
    </div>
  );
};
export default LexiconManage;
