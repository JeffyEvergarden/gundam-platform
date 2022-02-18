import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { Table, Button, Popconfirm, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './style.less';
import { PlusOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import InfoModal from './components/info-modal';
import { useOpModel, useLabelModel } from './model';

// 话术标签列表
const DetailPages: React.FC = (props: any) => {
  const { labelList, getLabelTableList, labelLoading } = useLabelModel();
  const { opLoading, deleteLabel, addNewLabel, editLabel } = useOpModel();
  const labelTableRef = useRef<any>({});
  const labelModalRef = useRef<any>({});

  const confirmInfo = async (info: any) => {
    let res: any = null;
    if (info._openType === 'new') {
      let params: any = {
        ...info?.form,
      };
      res = await addNewLabel(params);
      if (res.resultCode === '000000') {
        labelModalRef.current?.close?.();
        labelTableRef.current.reload();
      } else {
        message.error(res?.resultDesc || '未知系统异常');
      }
    } else if (info._openType === 'edit') {
      let params: any = {
        id: info?._originInfo?.id,
        ...info?.form,
      };
      res = await editLabel(params);
      if (res === true) {
        labelModalRef.current?.close?.();
        labelTableRef.current.reload();
      } else {
        message.error(res);
      }
    }
  };

  const deleteRow = async (row: any) => {
    let params: any = {
      id: row.id,
    };
    let res: any = await deleteLabel(params);
    if (res) {
      console.log('删除接口');
      // message.success('删除成功');
      labelTableRef.current.reload();
    } else {
      message.error(res);
    }
  };

  const columns: any[] = [
    {
      title: '标签名称',
      dataIndex: 'actionLabel',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入标签名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: '标签描述',
      dataIndex: 'labelDesc',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      search: false,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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
              <Button
                type="link"
                onClick={() => {
                  labelModalRef.current?.open?.(row);
                }}
              >
                编辑
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

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={labelTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return getLabelTableList(params);
          // return {};
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
        headerTitle="话术标签列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              labelModalRef.current?.open?.();
            }}
          >
            新建
          </Button>,
        ]}
      />

      <InfoModal
        cref={labelModalRef}
        confirm={confirmInfo}
        // loading={opLoading}
      />
    </div>
  );
};

export default DetailPages;
