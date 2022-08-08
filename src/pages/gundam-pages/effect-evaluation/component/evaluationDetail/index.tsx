import ProTable from '@ant-design/pro-table';
import { Button, Form, Modal, Select } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const EvaluationDetail: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;
  const TableRef = useRef<any>({});

  // const { addSample, editSample } = useSampleModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      robotId: info.id,
      ...values,
    };
  };

  const close = () => {
    form.resetFields();
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close,
    submit,
  }));

  const columns: any[] = [
    {
      title: '评估样本',
      dataIndex: 'id',
      fieldProps: {
        placeholder: '请输入评估样本',
      },
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '标注回复类型',
      dataIndex: 'sampleName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '标注FAQ/意图',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '识别回复类型',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '识别FAQ/意图',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '精准率',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '召回率',
      dataIndex: 'markProgress',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 150,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                // ModalRef.current?.open?.('edit', row);
              }}
            >
              查看详情
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      width={'80%'}
      title={`评估详情`}
      visible={visible}
      onCancel={() => {
        // form.resetFields();
        setVisible(false);
      }}
      footer={false}
    >
      <div className={style['info']}>评估集名称</div>
      <div className={`${style['machine-page']} list-page`}>
        <ProTable<any>
          columns={columns}
          actionRef={TableRef}
          scroll={{ x: columns.length * 200 }}
          request={async (params = {}, sort, filter) => {
            // return getList({
            //   robotId: info.id,
            //   page: params.current,
            //   ...params,
            // });
            return {};
          }}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-machine-list',
            persistenceType: 'localStorage',
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          form={{
            syncToUrl: (values: any, type: any) => {
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
          // headerTitle="模型评估列表"
          toolBarRender={() => []}
        />
      </div>
    </Modal>
  );
};

export default EvaluationDetail;
