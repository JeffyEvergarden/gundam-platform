import Tip from '@/components/Tip';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, Modal, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useTableModel } from './model';
import style from './style.less';

const { TextArea } = Input;

const FAQBlackList = (props: any) => {
  const { getTableList, tableLoading, deleteBlack, opLoading, addBlack, total } = useTableModel();

  const { info } = useModel('gundam', (model: any) => {
    return {
      info: model.info,
    };
  });

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  // 删除
  const deleteRow = async (row: any) => {
    let params: any = {
      id: row.id,
      robotId: info.id,
    };
    let res: any = await deleteBlack(params);
    if (res) {
      // 删除成功就刷新
      tableRef.current.reload();
    }
  };

  const columns: any[] = [
    {
      title: '客户问题',
      dataIndex: 'question',
      fixed: 'left',
      width: 400,
      fieldProps: {
        placeholder: '请输入问题查询内容',
        // onPressEnter: (e: any) => {
        //   console.log(e);
        //   let obj = { ...searchForm, robotName: e.target.value };
        //   // if (e.target.value == '') {
        //   //   delete obj.robotName;
        //   // }
        //   setSearchForm(obj);
        // },
      },
      ellipsis: true,
      render: (val: any, row: any) => {
        return (
          <Tooltip title={row.question} placement={'topLeft'}>
            <div className={style['qustion-label']}>{row.question}</div>
          </Tooltip>
        );
      },
    },
    // {
    //   title: '渠道',
    //   dataIndex: 'channelCode',
    //   search: false,
    //   render: (val: any) => {
    //     return formatChannel(val);
    //   },
    //   width: 180,
    // },
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
      width: 120,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Popconfirm
                title="删除操作将不可恢复，继续删除请按【确定】"
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

  // 弹窗相关
  // 打开弹窗
  const openModal = () => {
    form.resetFields();
    setVisible(true);
  };
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
  };
  // 确认弹窗
  const handleOk = async () => {
    // 校验填写
    let res: any = await form.validateFields().catch((err: any) => false);
    if (!res) {
      return;
    }
    // ------------
    let data: any = {
      robotId: info.id,
      ...res,
    };
    res = await addBlack(data);
    if (res) {
      // 成功刷新当前页面
      handleCancel();
      tableRef.current.reload();
    }
  };

  // -------------------

  useEffect(() => {
    tableRef.current.reload();
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
          return getTableList({
            page: params.current,
            ...params,
            robotId: info.id,
          });
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
        headerTitle={
          <>
            {total ? <div>黑名单总量: {total}</div> : <div>FAQ-黑名单</div>}
            <Tip
              title={
                '当客户输入的文本与配置的文本完全匹配时，触发拒识，机器人回复拒识话术（例如，没明白客户说什么）。可以针对特殊文本不予回复，例如一些敏感词、其他企业的知识等。'
              }
            />
          </>
        }
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              openModal();
            }}
          >
            添加
          </Button>,
        ]}
      />

      <Modal
        title={'新增FAQ-黑名单'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={opLoading}
        maskClosable={false}
      >
        <div className={style['modal-page']}>
          <div className={style['modal-form']}>
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} autoComplete="off">
              <Form.Item
                label="客户问题"
                name="question"
                rules={[
                  { required: true, message: '请输入问题名称' },
                  { max: 200, message: '不能超过200个文字' },
                ]}
              >
                <TextArea placeholder={'请输入问题名称'} maxLength={200} rows={3} />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FAQBlackList;
