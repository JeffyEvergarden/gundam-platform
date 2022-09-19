import Condition from '@/components/Condition';
import SelectFaqModal from '@/pages/gundam-pages/FAQ-module/components/select-faq-modal';
import { ArrowLeftOutlined, MonitorOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tooltip,
} from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailSampleModel } from '../../model';
import style from './style.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Item: FormItem } = Form;

const replyTypeList = [
  {
    key: '明确回复',
    value: 1,
  },
  {
    key: '澄清',
    value: 2,
  },
  {
    key: '拒识',
    value: 3,
  },
];

const tagStatusList = {
  1: '待标注',
  2: '待确认',
  3: '已标注',
};

const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<any>();
  const selectFaqModalRef = useRef<any>();
  const selectFaqModalRef1 = useRef<any>();
  const [form] = Form.useForm();

  const {
    editLoading,
    addLoading,
    btnLoading,
    result,
    getList,
    addDetailSample,
    deleteDetailSample,
    editDetailSample,
    confirmDetailSample,
    tagDetailSample,
  } = useDetailSampleModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);

  const [visible, setVisible] = useState<boolean>(false);

  const [paramsObj, setParamsObj] = useState<any>({});
  const [outRow, setOutRow] = useState<any>();
  const [searchText, setSearchText] = useState<string>('');
  const [addText, setAddText] = useState<string>('');
  const [editId, setEditId] = useState<string>('');

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  const confirmUpdateSelect = async (val: any, inputValue: any) => {
    console.log(val);
    // if (!val.length) {
    //   message.warning('请选择FAQ/意图');
    //   return false;
    // }

    let reqData = {
      robotId: info.id,
      id: editId,
      bizRelationList: val.map((item: any) => {
        return {
          bizId: item?.recommendId,
          bizType: item?.recommendType,
          bizName: item?.recommendName,
        };
      }),
      assessSampleId: (history?.location?.state as any)?.id,
    };
    let res: any = await editDetailSample(reqData);
    if (res) {
      actionRef?.current?.reload();
      return true;
    }
  };

  const columns: any = [
    {
      dataIndex: 'dialogueSample',
      title: '对话样本',
      ellipsis: true,
      search: false,
      width: 200,
    },
    {
      dataIndex: 'replyType',
      title: '回复类型',
      search: false,
      width: 150,
      render: (val: any, row: any, i: any) => {
        return (
          <Select
            key={row.replyType}
            defaultValue={row.replyType}
            // bordered={false}
            className={style['replyType']}
            onChange={(val) => {
              replyTypeChange(row, val);
            }}
            placeholder={'请选择'}
          >
            {replyTypeList.map((item: any) => {
              return (
                <Option key={item.key} value={item.value}>
                  {item.key}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      dataIndex: 'faqIntentList',
      title: '意图/FAQ',
      ellipsis: true,
      search: false,
      width: 200,
      render: (val: any, row: any) => {
        let arr = row?.faqIntentList;
        if (Array.isArray(arr) && arr?.length) {
          return (
            <div
              className={style['question-box']}
              onClick={() => {
                openSelectFaqModal(row);
              }}
            >
              {arr.map((item: any, i: number) => {
                return (
                  <Tooltip title={item.bizName} placement={'topLeft'} key={i}>
                    <div className={style['qustion-label']} key={i}>
                      {item.bizType == '1' ? (
                        <QuestionCircleOutlined className={style['icon']} />
                      ) : (
                        <MonitorOutlined className={style['icon']} />
                      )}
                      {item.bizName}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          );
        } else {
          return (
            <div
              className={row.replyType == 3 ? '' : style['question-box']}
              onClick={() => {
                openSelectFaqModal(row);
              }}
              style={{ color: '#52C41A' }}
            >
              {row.replyType == 3 ? '' : '请选择标准问/意图'}
            </div>
          );
        }
      },
    },
    {
      dataIndex: 'updateBy',
      title: '更新人',
      search: false,
      ellipsis: true,
      width: 100,
      render: (val: any, row: any, i: any) => {
        return row.updateBy || row.creator || '-';
      },
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      search: false,
      ellipsis: true,
      width: 200,
      sorter: true,
    },
    {
      dataIndex: 'tagStatus',
      title: '标注状态',
      width: 150,
      search: false,
      filters: [
        {
          text: '待标注',
          value: 1,
        },
        {
          text: '待确认',
          value: 2,
        },
        {
          text: '已标注',
          value: 3,
        },
      ],
      valueEnum: {
        1: { text: '待标注', status: 'Error' },
        2: {
          text: <span style={{ marginRight: '6px' }}>待确认</span>,
          status: 'Warning',
        },
        3: { text: '已标注', status: 'Success' },
      },
      filterMode: 'menu',
      render: (val: any, row: any) => {
        return (
          <span className={style['tagStatus']}>
            {val}
            <Condition r-if={row.tagStatus == 2}>
              <Button
                style={{ marginLeft: '6px' }}
                type="primary"
                onClick={() => {
                  confirm(row);
                }}
                size={'small'}
              >
                确认
              </Button>
            </Condition>
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 130,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                setEditId(record.id);
                form.setFieldsValue({ dialogueSample: record.dialogueSample });
                setVisible(true);
              }}
            >
              编辑样本
            </Button>

            <Popconfirm
              title={
                <div style={{ maxWidth: '150px' }}>
                  您是否确认要删除选中的对话样本？删除后将无法恢复
                </div>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await deleteDetailSample({ robotId: info.id, ids: [record.id] }).then((res) => {
                  if (res) {
                    actionRef?.current?.reloadAndRest();
                  }
                });
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 打开选择FAQ/意图模态框
  const openSelectFaqModal = (row: any) => {
    console.log(row);
    setEditId(row.id);
    let questionTypeList: any[] =
      row.faqIntentList.map((item: any) => {
        return {
          recommendId: item.bizId,
          recommendType: item.bizType,
          recommendName: item.bizName,
        };
      }) || [];
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
    if (row.replyType == 1) {
      (selectFaqModalRef1.current as any)?.open({
        selectList: questionTypeList, //被选中列表
        selectedQuestionKeys, // 已选问题
        selectedWishKeys, // 已选意图
      });
    } else if (row.replyType == 2) {
      (selectFaqModalRef.current as any)?.open({
        selectList: questionTypeList, //被选中列表
        selectedQuestionKeys, // 已选问题
        selectedWishKeys, // 已选意图
        // disabledWishKeys: selectedWishKeys,
        // disabledQuestionKeys: selectedQuestionKeys,
      });
    } else {
    }
  };

  const replyTypeChange = async (row: any, val: any) => {
    console.log(row, val);
    let reqData = {
      robotId: info.id,
      id: row.id,
      assessSampleId: (history?.location?.state as any)?.id,
      replyType: val,
    };
    await editDetailSample(reqData).then((res) => {
      actionRef?.current?.reload();
    });
  };

  const addDetailList = async () => {
    if (!addText) {
      message.warning('请输入对话样本后再按回车添加');
      return;
    }
    if (!addLoading) {
      return;
    }
    let reqData = {
      robotId: info.id,
      assessSampleId: outRow?.id,
      dialogueSample: addText,
    };
    await addDetailSample(reqData).then((res) => {
      if (res) {
        setAddText('');
        actionRef?.current?.reload();
      }
    });
  };

  const editDetail = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      robotId: info.id,
      id: editId,
      assessSampleId: (history?.location?.state as any)?.id,
      ...values,
    };
    await editDetailSample(reqData).then((res) => {
      if (res) {
        setVisible(false);
        actionRef?.current?.reload();
      }
    });
  };

  const confirm = async (row?: any) => {
    let reqData = {
      robotId: info.id,
      ids: row ? [row.id] : selectRow.map((item: any) => item.id),
    };

    await confirmDetailSample(reqData).then((res) => {
      if (res) {
        setSelectRow([]);
        setSelectedRowKeys([]);
        actionRef?.current?.reload();
      }
    });
  };

  const tag = async () => {
    let reqData = {
      robotId: info.id,
      ids: selectRow.map((item: any) => item.id),
    };
    await tagDetailSample(reqData).then((res) => {
      if (res) {
        setSelectRow([]);
        setSelectedRowKeys([]);
        actionRef?.current?.reload();
      }
    });
  };

  const tableChange = (pagination: any, filters: any, sorter: any) => {
    console.log(filters, sorter);
    let temp: any = { orderCode: undefined, orderType: undefined };
    if (sorter?.columnKey === 'updateTime' && sorter?.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter?.columnKey === 'updateTime' && sorter?.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }
    let filterList = filters?.tagStatus ? filters : { tagStatus: undefined };

    setParamsObj({ ...paramsObj, ...filterList, ...temp });
  };

  useEffect(() => {
    let historyData = history?.location?.state || {};
    setOutRow(historyData);
  }, []);

  return (
    <Fragment>
      <div className={`${style['machine-page']} list-page`}>
        <div className={style['page_top']}>
          <div className={style['page_top__left']}>
            <ArrowLeftOutlined
              className={style['blue']}
              style={{ marginRight: '6px' }}
              onClick={() => {
                if ((history?.location?.state as any)?.id) {
                  history.go(-1);
                } else {
                  history.push('/gundamPages/effectEvaluation/sampleManager');
                }
              }}
            />
            <Tooltip title={outRow?.sampleSetName || '-'}>
              <span className={style['title']}>{outRow?.sampleSetName || '-'}</span>
            </Tooltip>

            <span style={{ fontSize: '16px' }}>
              （共{<span className={style['blue']}>{result?.totalPage || '0'}</span>}条：已标注
              {<span className={style['blue']}>{result?.tagNum || '0'}</span>}条，待标注
              {<span className={style['blue']}>{result?.unTagNum || '0'}</span>}条，待确认
              {<span className={style['blue']}>{result?.stayConfirmNum || '0'}</span>}条）
            </span>
          </div>
          <Input.Search
            // bordered={false}
            style={{ width: '280px', padding: '4px' }}
            onSearch={(text: any) => {
              setParamsObj({ dialogueSample: text });
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            placeholder={'请输入'}
            allowClear
          />
        </div>
        <ProTable
          headerTitle={
            <Input
              style={{ width: '400px' }}
              placeholder="输入对话样本后按回车添加"
              value={addText}
              allowClear
              maxLength={200}
              onChange={(e) => {
                setAddText(e.target.value);
              }}
              onPressEnter={addDetailList}
            />
          }
          rowKey={'id'}
          actionRef={actionRef}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          pagination={{
            pageSize: 10,
          }}
          search={false}
          params={paramsObj}
          onChange={tableChange}
          rowSelection={rowSelection}
          toolBarRender={() => [
            <Popconfirm
              disabled={selectRow?.length < 1}
              title={
                <div style={{ maxWidth: '150px' }}>
                  您是否确认要删除选中的对话样本？删除后将无法恢复
                </div>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                let reqData = { robotId: info.id, ids: selectRow.map((item: any) => item.id) };
                await deleteDetailSample(reqData).then((res) => {
                  if (res) {
                    setSelectRow([]);
                    setSelectedRowKeys([]);
                    actionRef?.current?.reload();
                  }
                });
              }}
            >
              <Button disabled={selectRow?.length < 1} loading={btnLoading}>
                批量删除
              </Button>
            </Popconfirm>,
            <Button
              disabled={selectRow?.length < 1}
              onClick={() => {
                tag();
              }}
              loading={btnLoading}
            >
              批量预标注
            </Button>,
            <Button
              type="primary"
              disabled={selectRow?.length < 1}
              onClick={() => {
                confirm();
              }}
              loading={btnLoading}
            >
              批量确认
            </Button>,
          ]}
          request={async (params) => {
            return getList({
              robotId: info.id,
              page: params.current,
              ...params,
              assessSampleId: (history?.location?.state as any)?.id,
            });
          }}
        />
        <Modal
          width={650}
          title={'编辑样本'}
          visible={visible}
          onCancel={() => {
            form.resetFields();
            setVisible(false);
          }}
          okText={'提交'}
          onOk={editDetail}
        >
          <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
            <Form form={form} style={{ width: '400px' }}>
              <FormItem
                rules={[{ required: true, message: '请填写样本名称' }]}
                name="dialogueSample"
                label="样本名称"
                style={{ width: '360px' }}
              >
                <Input maxLength={200}></Input>
              </FormItem>
            </Form>
          </div>
        </Modal>

        <SelectFaqModal
          cref={selectFaqModalRef}
          confirm={confirmUpdateSelect}
          showQuestion={false}
          pageType={'sampleDetail'}
          tableLoading={editLoading}
        />

        <SelectFaqModal
          cref={selectFaqModalRef1}
          confirm={confirmUpdateSelect}
          type={'radio'}
          min={1}
          max={1}
          showQuestion={false}
          tableLoading={editLoading}
        />
      </div>
    </Fragment>
  );
};

export default DetailPages;
