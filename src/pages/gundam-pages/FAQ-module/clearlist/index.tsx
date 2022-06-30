import { MonitorOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, Modal, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DetailModal from '../components/detail-modal';
import SelectFaqModal from '../components/select-faq-modal';
import FaqSelect from './FaqSelect';
import { useTableModel } from './model';
import style from './style.less';

const { TextArea } = Input;

const FAQClearList = (props: any) => {
  const {
    getTableList,
    tableLoading,
    opLoading,
    deleteClearItem,
    addClearItem,
    updateClearItem,
    total,
    questionTotal,
  } = useTableModel();

  const { info } = useModel('gundam', (model: any) => {
    return {
      info: model.info,
    };
  });

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const tmpRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});

  //排序
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '', orderType: '' });

  // 删除
  const deleteRow = async (row: any) => {
    let params: any = {
      robotId: info.id,
      id: row.id,
    };
    let res: any = await deleteClearItem(params);
    if (res) {
      // 删除成功就刷新
      tableRef.current.reload();
    }
  };

  // 打开查看聊天记录
  const openDetailModal = (row: any) => {
    // console.log(row);
    (modalRef.current as any)?.open(row);
  };
  // 打开选择FAQ/意图模态框
  const openSelectFaqModal = (row: any) => {
    // console.log(row);
    // selectlist  (recommendType、recommendId、recommend)
    // disabledWishKeys    禁止选择的意图
    // disabledQuestionKeys  禁止选择的问题
    // selectedQuestionKeys  已选择的问题
    // selectedWishKeys 已选择的意图
    tmpRef.current.row = row;
    let questionTypeList: any[] = row.clarifyDetail || [];
    questionTypeList = Array.isArray(questionTypeList) ? [...questionTypeList] : [];
    let selectedQuestionKeys: any[] = questionTypeList
      .filter((item: any) => {
        return item.recommendType == '1';
      })
      .map((item: any) => {
        return item.recommendId;
      });
    let selectedWishKeys: any[] = questionTypeList
      .filter((item: any) => {
        return item.recommendType == '2';
      })
      .map((item: any) => {
        return item.recommendId;
      });
    (selectFaqModalRef.current as any)?.open({
      question: row.question || '',
      selectList: questionTypeList, //被选中列表
      selectedQuestionKeys, // 已选问题
      selectedWishKeys, // 已选意图
    });
  };
  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = async (list: any[]) => {
    // 输出列表
    let row: any = tmpRef.current.row;
    let questionTypeList: any[] = row?.clarifyDetail || [];
    let needUpdate = false;
    const keys: any[] = list?.map((item: any) => item.recommendId) || [];
    // 判断是否需要调接口更新
    if (questionTypeList.length !== list.length) {
      // 数量不等
      needUpdate = true;
    } else {
      let i = questionTypeList.findIndex((item: any) => {
        return !keys.includes(item.recommendId);
      });
      if (i > -1) {
        // 找到新增的
        needUpdate = true;
      }
    }
    if (!needUpdate) {
      return;
    }

    let data: any = {
      clarifyId: row?.id,
      clarifyDetailList: list,
    };
    let res: any = await updateClearItem(data);
    if (res) {
      tableRef.current.reload();
    }
  };

  // 列名
  const columns: any[] = [
    {
      title: (...args: any[]) => {
        if (args[1] === 'table') {
          return '客户问题';
        }
        // console.log(args);
        return '客户问题/标准问';
      },
      dataIndex: 'searchText',
      fixed: 'left',
      width: 300,
      fieldProps: {
        placeholder: '请输入客户问题/标准问',
      },
      ellipsis: true,
      render: (val: any, row: any) => {
        return row.question;
      },
    },
    {
      title: '标准问/意图',
      dataIndex: 'clarifyDetail',
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
                  <Tooltip title={item.recommendName} placement={'topLeft'} key={i}>
                    <div className={style['qustion-label']} key={i}>
                      {item.recommendType == '1' ? (
                        <QuestionCircleOutlined className={style['icon']} />
                      ) : (
                        <MonitorOutlined className={style['icon']} />
                      )}
                      {item.recommendName}
                    </div>
                  </Tooltip>
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
      dataIndex: 'consultNum',
      search: false,
      width: 160,
    },
    {
      title: '澄清采用率',
      dataIndex: 'clarifyAdoptionRate',
      search: false,
      width: 160,
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
      title: '时间',
      dataIndex: 'createTime',
      search: false,
      sorter: true,
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
                查看聊天记录
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

  // 新增模态框相关

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();
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
    res = await addClearItem(data);
    if (res) {
      // 成功刷新当前页面
      handleCancel();
      tableRef.current.reload();
    }
  };

  //排序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '', orderType: '' };
    if (sorter.columnKey === 'clarifyAdoptionRate' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'clarifyAdoptionRate' && sorter.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }
    if (sorter.columnKey === 'createTime' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'createTime' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  useEffect(() => {
    tableRef.current.reload(); // 刷新列表
  }, []);

  return (
    <div className={`list-page`}>
      <ProTable<any>
        // params={searchForm}
        columns={columns}
        actionRef={tableRef}
        loading={tableLoading}
        bordered={true}
        scroll={{ x: columns.length * 200 }}
        request={async (params: any, sort: any, filter: any) => {
          return getTableList({ page: params.current, ...params, robotId: info.id, ...paramsObj });
        }}
        editable={{
          type: 'multiple',
        }}
        onChange={tableChange}
        columnsState={{
          persistenceKey: 'pro-table-faq-clearlist',
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
          <div>
            澄清样本问题 {total} 条, 标准问 {questionTotal} 条
          </div>
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

      <DetailModal cref={modalRef} />

      <SelectFaqModal cref={selectFaqModalRef} confirm={confirmUpdateSelect} />

      <Modal
        title={'新增FAQ-澄清'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={opLoading}
        maskClosable={false}
        width={600}
      >
        <div className={style['modal-page']}>
          <div className={style['modal-form']}>
            <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} autoComplete="off">
              <Form.Item
                label="客户问题/标准问"
                name="question"
                rules={[
                  { required: true, message: '请输入客户问题/标准问' },
                  { max: 200, message: '不能超过200个文字' },
                ]}
              >
                <TextArea placeholder={'请输入客户问题/标准问'} maxLength={200} rows={3} />
              </Form.Item>

              <Form.Item
                label="标准问/意图"
                name="clarifyDetailList"
                rules={[{ required: true, message: '请选择标准问/意图' }]}
              >
                <FaqSelect />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FAQClearList;
