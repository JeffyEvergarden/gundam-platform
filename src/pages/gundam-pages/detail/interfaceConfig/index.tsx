import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import {
  Form,
  Row,
  Col,
  Space,
  Input,
  Select,
  Divider,
  InputNumber,
  Popconfirm,
  Table,
  Button,
} from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import InfoModal from './components/infoModal';
import { useInterfaceModel } from '../model';

const InterfaceConfig: React.FC = (props: any) => {
  const { getTableList, configLoading } = useInterfaceModel();

  const interfaceTableRef = useRef<any>({});
  const interfaceModalRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const columns: any[] = [
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入接口名称',
      },

      width: 180,
      render: (val: any, row: any, index: number) => {
        return (
          <a
            type="link"
            onClick={() => {
              interfaceModalRef.current?.open?.(row);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: '接口URL',
      dataIndex: 'interfaceUrl',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '接口类型',
      dataIndex: 'interfaceType',
      search: false,
      width: 200,
      ellipsis: true,
      valueEnum: {
        0: { text: 'POST' },
        1: { text: 'GET' },
      },
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      search: false,
      width: 200,
    },
    {
      title: '请求报文体',
      dataIndex: 'requestBody',
      search: false,
      width: 200,
    },
    {
      title: '接口描述',
      dataIndex: 'interfaceDesc',
      search: false,
      width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'creater',
      search: false,
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
      width: 200,
    },
  ];

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={interfaceTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getTableList({ robotId: info.id, ...params });
          return {};
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-interface-list',
          persistenceType: 'localStorage',
        }}
        rowKey={(record) => record.id}
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
        headerTitle="接口管理列表"
        // toolBarRender={() => [
        //   <Button
        //     key="button"
        //     icon={<PlusOutlined />}
        //     type="primary"
        //     onClick={() => {
        //       interfaceModalRef.current?.open?.();
        //     }}
        //   >
        //     新建
        //   </Button>,
        // ]}
      />

      <InfoModal
        cref={interfaceModalRef}
        // confirm={confirmInfo}
        loading={configLoading}
      />
    </div>
  );
};

export default InterfaceConfig;
