import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Table, Button, Dropdown, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import Condition from '@/components/Condition';
import { PlusOutlined } from '@ant-design/icons';
import { useTableModel } from './model';
import DetailModal from '../components/detail-modal';
import SelectFaqModal from '../components/select-faq-modal';
import style from './style.less';

const FAQClearList = (props: any) => {
  const { tableList, getTableList, tableLoading } = useTableModel();

  const { info } = useModel('gundam', (model: any) => {
    return {
      info: model.info,
    };
  });

  const { getWishList, getTreeData } = useModel('drawer', (model: any) => {
    return {
      getWishList: model.getWishList,
      getTreeData: model.getTreeData,
    };
  });

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const tmpRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});

  // 删除
  const deleteRow = (row: any) => {};

  const openDetailModal = (row: any) => {
    console.log(row);
    (modalRef.current as any)?.open(row);
  };

  const openSelectFaqModal = (row: any) => {
    // console.log(row);
    tmpRef.current.row = row;
    (selectFaqModalRef.current as any)?.open(row);
  };

  const confirmUpdateSelect = (list: any[]) => {
    // 输出列表
    console.log(tmpRef.current.row);
    console.log(list);
  };

  const columns: any[] = [
    {
      title: '问题',
      dataIndex: 'question',
      fixed: 'left',
      width: 300,
      fieldProps: {
        placeholder: '请输入查询内容',
      },
      ellipsis: true,
    },
    {
      title: '标准问/意图',
      dataIndex: 'questionTypeList',
      search: false,
      width: 300,
      render: (arr: any, row: any) => {
        if (Array.isArray(arr)) {
          return (
            <div
              className={style['question-box']}
              onClick={() => {
                openSelectFaqModal(row);
              }}
            >
              {arr.map((item: any, i: number) => {
                return (
                  <div className={style['qustion-label']} key={i}>
                    {item.recommend}
                  </div>
                );
              })}
            </div>
          );
        } else {
          return '---';
        }
      },
    },
    {
      title: '咨询次数',
      dataIndex: 'adviceTime',
      search: false,
      width: 180,
    },
    {
      title: '澄清采用率',
      dataIndex: 'clearPercent',
      search: false,
      width: 180,
      sorter: true,
      render: (text: any) => {
        if (isNaN(text)) {
          return text;
        } else {
          text = text * 100;
          let str1 = Number(text.toFixed(0));
          let str2 = Number(text.toFixed(2));
          let str = Number(str1) === Number(str2) ? str1 : str2;
          return str + '%';
        }
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 180,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  openDetailModal(row);
                }}
              >
                查询明细
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
          </>
        );
      },
    },
  ];

  useEffect(() => {
    tableRef.current.reload(); // 刷新列表
    getWishList(info.id); // 获取意图列表
    getTreeData(info.id); // 获取faq列表
  }, []);

  return (
    <div className={`list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        loading={tableLoading}
        scroll={{ x: columns.length * 200 }}
        request={async (params: any, sort: any, filter: any) => {
          return getTableList({ page: params.current, ...params });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-faq-blacklist',
          persistenceType: 'localStorage',
        }}
        rowKey="index"
        search={{
          labelWidth: 'auto',
          // optionRender: false,
          // collapsed: false,
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
        headerTitle="FAQ-澄清"
        toolBarRender={() => []}
      />

      <DetailModal cref={modalRef} />

      <SelectFaqModal cref={selectFaqModalRef} confirm={confirmUpdateSelect} />
    </div>
  );
};

export default FAQClearList;
