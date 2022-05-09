import React, { useState, useEffect, useRef } from 'react';
import { useModel, history, useLocation } from 'umi';
import { Table, Button, Popconfirm, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './style.less';
import { CloseOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';

import config from '@/config/index';
import { useImportModal } from './model';

// 话术标签列表
const ImportPages: React.FC = (props: any) => {
  const labelTableRef = useRef<any>({});
  const { loading, importList, totalPage, _getImportList } = useImportModal();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const deleteRow = async (row: any) => {
    // let params: any = {
    //   robotId: info.id,
    //   id: row.id,
    // };
    // let res: any = await deleteLabel(params);
    // if (res) {
    //   console.log('删除接口');
    //   // message.success('删除成功');
    //   labelTableRef.current.reload();
    // } else {
    //   message.error(res);
    // }
  };

  const columns: any[] = [
    {
      title: '问题',
      dataIndex: 'question',
      fixed: 'left',
      search: false,
      ellipsis: true,
      width: 180,
    },
    {
      title: '相似问法',
      dataIndex: 'similarQuestion',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '答案',
      dataIndex: 'answer',
      search: false,
      width: 200,
    },
    {
      title: '生效渠道',
      dataIndex: 'channel',
      search: false,
      width: 200,
      render: (arr: any) => {
        return arr.join(',');
      },
    },
    {
      title: '导入类型',
      dataIndex: 'inportType',
      search: false,
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'classify',
      search: false,
      width: 200,
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
      search: false,
      width: 200,
    },
    {
      title: '导入结果',
      dataIndex: 'importResult',
      search: false,
      width: 200,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[], obj: any) => {
      console.log(keys);
      console.log(obj);

      return setSelectedRowKeys(keys);
    },
  };
  useEffect(() => {
    _getImportList({
      robotId: info.id,
    });
  }, []);

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={labelTableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          // console.log(sort, filter);
          return _getImportList({
            robotId: info.id,
            page: params.current,
            ...params,
          });
          return {};
        }}
        tableAlertRender={false}
        rowSelection={rowSelection}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="question"
        search={false}
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
        headerTitle="批量导入"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            // onClick={() => {
            //   labelModalRef.current?.open?.();
            // }}
          >
            问题导入
          </Button>,
          <Button
            key="button"
            icon={<CloseOutlined />}
            type="primary"
            // onClick={() => {
            //   labelModalRef.current?.open?.();
            // }}
          >
            清空列表
          </Button>,
          <Button
            key="button"
            icon={<DownloadOutlined />}
            type="primary"
            // onClick={() => {
            //   labelModalRef.current?.open?.();
            // }}
          >
            下载模板
          </Button>,
          <Button
            key="button"
            icon={<DeleteOutlined />}
            type="primary"
            // onClick={() => {
            //   labelModalRef.current?.open?.();
            // }}
          >
            删除记录
          </Button>,
        ]}
      />

      {/* <InfoModal
        cref={labelModalRef}
        confirm={confirmInfo}
        // loading={opLoading}
      /> */}
    </div>
  );
};

export default ImportPages;
