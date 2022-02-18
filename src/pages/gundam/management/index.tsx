import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { useOpModel, useTableModel } from './model';
import useUpdateModel from '@/models';
import { Table, Button, Dropdown, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import Condition from '@/components/Condition';
import InfoModal from './components/info-modal';
import config from '@/config';
import { BUSSINESS_CODE, listToMap } from './model/const';

enum MACHINE_STATUS {
  RUNNING = 0,
  STOP = 1,
}

// 机器人列表
const MachineManagement: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  const { tableList, getTableList, tableLoading } = useTableModel();

  const { opLoading, changeStatus, deleteMachine, addNewMachine, editMachine } = useOpModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { updatePage } = useUpdateModel();

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  // 分页相关 ---
  // const [current, setCurrent] = useState<number>(1);

  // const onChange = (val: number) => {
  //   setCurrent(val);
  // };

  // 改变状态
  const _changeStatus = async (row: any) => {
    let params: any = {
      id: row.id,
      status: row.status,
    };
    let res: any = await changeStatus(params);
    // console.log(res);
    if (res) {
      console.log('修改状态');
      row.status = row.status === 0 ? 1 : 0;
      message.success('修改成功');
      updatePage();
    } else {
      message.error(res);
    }
  };

  // 下钻系统
  const goToNewSystem = (row: any) => {
    console.log(row);
    if (!row.id) {
      message.warning('获取不到机器人信息');
      return null;
    }
    setInfo(row);
    history.push(`/gundamPages/home?id=${row.id}`);
    localStorage.setItem('robot_id', row.id);
  };

  const deleteRow = async (row: any) => {
    if (row?.status == 0) {
      message.warning('请先停用该机器人');
      return;
    }

    let params: any = {
      id: row.id,
    };
    let res: any = await deleteMachine(params);
    if (res) {
      console.log('删除接口');
      message.success('删除成功');
      tableRef.current.reload();
    } else {
      message.error(res);
    }
  };

  const confirmInfo = async (info: any) => {
    let res: any = null;
    if (info._openType === 'new') {
      let params: any = {
        ...info?.form,
      };
      res = await addNewMachine(params);
      if (res.resultCode === config.successCode) {
        modalRef.current?.close?.();
        goToNewSystem({ ...res.data });
      } else {
        message.error(res?.resultDesc || '未知系统异常');
      }
    } else if (info._openType === 'edit') {
      let params: any = {
        id: info?._originInfo?.id,
        ...info?.form,
      };
      res = await editMachine(params);
      if (res === true) {
        modalRef.current?.close?.();
        tableRef.current.reload();
      } else {
        message.error(res);
      }
    }
  };

  const columns: any[] = [
    {
      title: '机器人名称',
      dataIndex: 'robotName',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入机器人名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: '机器人描述',
      dataIndex: 'robotDesc',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '业务场景',
      dataIndex: 'businessCode',
      fieldProps: {
        placeholder: '请选择业务场景',
      },
      valueType: 'select',
      initialValue: undefined,
      valueEnum: {
        ...listToMap(BUSSINESS_CODE),
      },
      width: 120,
    },
    {
      title: '机器人类型',
      dataIndex: 'robotType',
      fieldProps: {
        placeholder: '请选择机器人类型',
      },
      valueEnum: {
        0: { text: '语音' },
        1: { text: '文本' },
      },
      width: 120,
    },
    {
      title: '机器人状态',
      dataIndex: 'status',
      fieldProps: {
        placeholder: '请选择机器人状态',
      },
      valueEnum: {
        0: { text: '启用', status: 'Success' },
        1: { text: '停用', status: 'Default' },
      },
      width: 120,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      search: false,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'onlineTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 130,
      render: (val: any, row: any, index: number) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <Condition r-if={row.status === MACHINE_STATUS.RUNNING}>
                <Button
                  type="text"
                  className={style['btn-disable']}
                  onClick={() => {
                    _changeStatus(row);
                  }}
                >
                  停用
                </Button>
              </Condition>

              <Condition r-if={row.status === MACHINE_STATUS.STOP}>
                <Button
                  type="link"
                  className={style['btn-success']}
                  onClick={() => {
                    _changeStatus(row);
                  }}
                >
                  启用
                </Button>
              </Condition>

              <Button
                type="link"
                onClick={() => {
                  modalRef.current?.open?.(row);
                }}
              >
                编辑
              </Button>
            </div>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  goToNewSystem(row);
                }}
              >
                配置
              </Button>

              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  deleteRow(row);
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={tableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return getTableList(params);
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="index"
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
        headerTitle="机器人列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              modalRef.current?.open?.();
            }}
          >
            新建
          </Button>,
        ]}
      />

      {/* <Table
        pagination={{ current, onChange }}
        dataSource={tableList}
        columns={columns}
        rowKey="index"
        loading={tableLoading}
      /> */}

      <InfoModal cref={modalRef} confirm={confirmInfo} loading={opLoading} />
    </div>
  );
};

export default MachineManagement;
