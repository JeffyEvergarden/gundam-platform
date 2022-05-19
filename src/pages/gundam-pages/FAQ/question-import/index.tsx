import React, { useState, useEffect, useRef } from 'react';
import { useModel, useLocation, history } from 'umi';
import { Table, Button, Upload } from 'antd';
import ProTable from '@ant-design/pro-table';
import style from './style.less';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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

  const columns: any[] = [
    {
      title: '文件名称',
      dataIndex: 'importFileName',
      fixed: 'left',
      search: false,
      ellipsis: true,
      width: 180,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '答案导入统计',
      children: [
        {
          title: '上传数量',
          dataIndex: 'answerNum',
          key: 'answerNum',
          search: false,
          width: 100,
        },
        // {
        //   title: '成功数量',
        //   dataIndex: 'answer',
        //   key: '',
        //   search: false,
        //   width: 200,
        // },
        {
          title: '失败数量',
          dataIndex: 'failAnswerNum',
          key: 'failAnswerNum',
          search: false,
          width: 100,
        },
      ],
    },
    {
      title: '相似问导入统计',
      children: [
        {
          title: '上传数量',
          dataIndex: 'similarQuestionNum',
          key: 'similarQuestionNum',
          search: false,
          width: 100,
        },
        // {
        //   title: '成功数量',
        //   dataIndex: 'answer',
        //   key: '',
        //   search: false,
        //   width: 200,
        // },
        {
          title: '失败数量',
          dataIndex: 'failSimilarQuestionNum',
          key: 'failSimilarQuestionNum',
          search: false,
          width: 100,
        },
      ],
    },
    {
      title: '操作',
      key: 'op',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 80,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  // _changeStatus(row);
                  console.log(`${config.basePath}/robot/file/getFile?path=${row.failFilePath}`);

                  window.open(`${config.basePath}/robot/file/getFile?path=${row.failFilePath}`);
                }}
              >
                结果下载
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    // _getImportList({
    //   robotId: info.id,
    // });
  }, []);

  return (
    <div className={style['machine-page']}>
      <ProTable<any>
        columns={columns}
        actionRef={labelTableRef}
        bordered
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
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
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
        headerTitle={
          <div>
            <div style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '400' }}>
              <ArrowLeftOutlined
                className={style['blue']}
                style={{ marginRight: '6px' }}
                onClick={() => {
                  history?.goBack();
                }}
              />
              批量导入
            </div>
            <div style={{ display: 'flex' }}>
              <Upload
                name="file"
                action={`${config.basePath}/robot/faqImport/upload`}
                showUploadList={false}
                data={{ robotId: info.id }}
              >
                <Button
                  icon={<PlusOutlined />}
                  style={{ marginRight: '8px' }}
                  type="primary"
                  // onClick={() => {
                  //   labelModalRef.current?.open?.();
                  // }}
                >
                  问题导入
                </Button>
              </Upload>

              <Button
                icon={<DownloadOutlined />}
                type="primary"
                onClick={() => {
                  window.open(
                    `${config.basePath}/robot/file/getLocalFile?fileName=模板_问题导入.xlsx`,
                  );
                }}
              >
                下载模板
              </Button>
            </div>
          </div>
        }
        // toolBarRender={() => [
        //   <Button
        //     key="button"
        //     icon={<PlusOutlined />}
        //     type="primary"
        //     // onClick={() => {
        //     //   labelModalRef.current?.open?.();
        //     // }}
        //   >
        //     问题导入
        //   </Button>,
        //   <Button
        //     key="button"
        //     icon={<DownloadOutlined />}
        //     type="primary"
        //     // onClick={() => {
        //     //   labelModalRef.current?.open?.();
        //     // }}
        //   >
        //     下载模板
        //   </Button>,
        // ]}
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
