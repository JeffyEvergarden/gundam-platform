import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Popconfirm, Table, Button, message } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import InfoModal from './components/infoModal';
import { useGlobalModel } from '../model';
import config from '@/config/index';

const InterfaceConfig: React.FC = (props: any) => {
  const { _deleteLabel, addGlobal, editGlobal, getTableList, configLoading } = useGlobalModel();
  const globalTableRef = useRef<any>({});
  const globalModalRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const columns: any[] = [
    {
      title: '变量ID',
      dataIndex: 'configKey',
      width: 180,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '变量名称',
      dataIndex: 'configName',
      width: 180,
      ellipsis: true,
      fixed: 'left',
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '变量类型',
      dataIndex: 'configType',
      search: false,
      width: 200,
      valueEnum: {
        0: { text: '系统配置' },
        1: { text: '变量配置' },
      },
    },
    {
      title: '变量说明',
      dataIndex: 'configDesc',
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
              <Button // 标签无法编辑
                type="link"
                onClick={() => {
                  globalModalRef.current?.open?.(row);
                }}
                disabled={!row.updateType}
              >
                编辑
              </Button>

              {!row.updateType ? (
                <Button type="link" danger disabled={true}>
                  删除
                </Button>
              ) : (
                <Popconfirm
                  title="确定要删除该变量吗？"
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
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const deleteRow = async (row: any) => {
    let params: any = {
      robotId: info.id,
      id: row.id,
    };
    let res: any = await _deleteLabel(params);
    if (res) {
      console.log('删除接口');
      // message.success('删除成功');
      globalTableRef.current.reload();
    } else {
      message.error(res);
    }
  };

  const confirmInfo = async (formData: any) => {
    let res: any = null;
    if (formData._openType === 'new') {
      let params: any = {
        robotId: info.id,
        configType: 1, //这里默认1
        ...formData?.form,
      };
      res = await addGlobal(params);
      if (res.resultCode === config.successCode) {
        globalModalRef.current?.close?.();
        globalTableRef.current.reload();
      } else {
        message.error(res?.resultDesc || '未知系统异常');
      }
    } else if (formData._openType === 'edit') {
      let params: any = {
        robotId: info.id,
        id: formData?._originInfo?.id,
        configType: 1, //这里默认1
        ...formData?.form,
      };
      res = await editGlobal(params);
      if (res === true) {
        globalModalRef.current?.close?.();
        globalTableRef.current.reload();
      } else {
        message.error(res);
      }
    }
  };

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={globalTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return getTableList({
            robotId: info.id,
            page: params.current,
            configType: 1,
            ...params,
          });
          return {};
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey={(record) => record.configKey}
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
        headerTitle="全局变量列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              globalModalRef.current?.open?.();
            }}
          >
            新建
          </Button>,
        ]}
      />

      <InfoModal
        cref={globalModalRef}
        confirm={confirmInfo}
        // loading={opLoading}
      />
    </div>
  );
};

export default InterfaceConfig;
