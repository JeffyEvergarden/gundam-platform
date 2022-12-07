import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import {
  MinusCircleOutlined,
  MinusSquareOutlined,
  MonitorOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Form, Input, message, Modal, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DetailModal from '../components/detail-modal';
import SelectFaqModal from '../components/select-faq-modal';
import FaqSelect from './FaqSelect';
import { useTableModel } from './model';
import style from './style.less';

const { TextArea } = Input;
const { Item: FormItem, List: FormList } = Form;

const FAQClearList = (props: any) => {
  const {
    getTableList,
    tableLoading,
    opLoading,
    deleteClearItem,
    deleteGroup,
    addClearItem,
    addGroup,
    updateClearItem,
    total,
    questionTotal,
  } = useTableModel();

  const { info } = useModel('gundam', (model: any) => {
    return {
      info: model.info,
    };
  });
  const robotTypeMap = config.robotTypeMap;
  const robotType: any = robotTypeMap[info.robotType] || '语音';

  const formItemLayout = {
    labelCol: {
      xs: { span: 7 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 15 },
      sm: { span: 15 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 15, offset: 7 },
      sm: { span: 15, offset: 7 },
    },
  };

  const tableRef = useRef<any>({});

  const modalRef = useRef<any>({});

  const tmpRef = useRef<any>({});
  const selectFaqModalRef = useRef<any>({});

  //排序
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '', orderType: '' });
  const [openList, setOpenList] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>({});

  // 删除
  const deleteRow = async (row: any) => {
    let params: any = {
      robotId: info.id,
      id: row?.id,
    };
    let res: any = await deleteClearItem(params);
    if (res) {
      // 删除成功就刷新
      tableRef.current.reload();
    }
  };

  const batchDelete = async (row: any) => {
    let params: any = {
      robotId: info.id,
      clarifyGroupId: row?.clarifyGroupId,
    };
    let res: any = await deleteGroup(params);
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
    let questionTypeList: any[] = row?.[0].clarifyDetail || [];
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
      questionList: row || [],
      operation: 'batch',
      selectList: questionTypeList, //被选中列表
      selectedQuestionKeys, // 已选问题
      selectedWishKeys, // 已选意图
    });
  };
  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = async (list: any[], a: any) => {
    console.log(list);

    // 输出列表
    let row: any = tmpRef.current.row;
    console.log(row);

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
      clarifyGroupId: row?.[0]?.clarifyGroupId,
      clarifyDetailList: list,
    };
    let res: any = await updateClearItem(data);
    if (res) {
      tableRef.current.reload();
      return true;
    }
    return false;
  };

  const formatRate = (text: any) => {
    if (isNaN(text)) {
      return text;
    } else {
      text = text * 100;
      let str1 = Number(text.toFixed(0));
      let str2 = Number(text.toFixed(2));
      let str = Number(str1) === Number(str2) ? str1 : str2;
      return str + '%';
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
      render: (val: any, row: any, index: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Condition r-if={row?.robotClarifyListDTOS?.length > 1}>
              <Button
                type="link"
                onClick={() => {
                  let arr = JSON.parse(JSON.stringify(openList));
                  arr[index] = !arr[index];
                  setOpenList(arr);
                }}
              >
                {openList[index] ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
              </Button>
            </Condition>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {/* <div> */}
              {openList[index] ? (
                row?.robotClarifyListDTOS?.map((item: any, idx: any) => (
                  <div key={idx}>
                    <Tooltip title={item.question}>
                      <div className={style['qustion-label']}>{item.question}</div>
                    </Tooltip>

                    {idx != row?.robotClarifyListDTOS?.length - 1 && (
                      <Divider style={{ margin: '2px 0' }}></Divider>
                    )}
                  </div>
                ))
              ) : (
                <Tooltip title={row?.robotClarifyListDTOS?.[0]?.question}>
                  <div className={style['qustion-label']} style={{ paddingLeft: '32px' }}>
                    {row?.robotClarifyListDTOS?.[0]?.question}
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        );

        return row.question;
      },
    },

    {
      title: '咨询次数',
      dataIndex: 'consultNum',
      search: false,
      width: 120,
      render: (val: any, row: any, index: any) => {
        return (
          <>
            {openList[index] ? (
              row?.robotClarifyListDTOS?.map((item: any, idx: any) => (
                <div key={idx}>
                  <div>{item.consultNum}</div>
                  {idx != row?.robotClarifyListDTOS?.length - 1 && (
                    <Divider style={{ margin: '2px 0' }}></Divider>
                  )}
                </div>
              ))
            ) : (
              <div>{row?.robotClarifyListDTOS?.[0]?.consultNum}</div>
            )}
          </>
        );
      },
    },
    {
      title: () => (
        <>
          {'澄清采用率'}
          <Tip
            title={
              '当客户输入命中了FAQ-澄清，且用户选择了提供的澄清内容，则视为澄清采用。澄清采用率=（澄清采用次数/FAQ-澄清次数）*100%'
            }
          />
        </>
      ),
      dataIndex: 'clarifyAdoptionRate',
      search: false,
      width: 120,
      sorter: true,
      render: (val: any, row: any, index: any) => {
        return (
          // <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {openList[index] ? (
              row?.robotClarifyListDTOS?.map((item: any, idx: any) => (
                <div key={idx}>
                  <div>{formatRate(item?.clarifyAdoptionRate)}</div>
                  {idx != row?.robotClarifyListDTOS?.length - 1 && (
                    <Divider style={{ margin: '2px 0' }}></Divider>
                  )}
                </div>
              ))
            ) : (
              <div>{formatRate(row?.robotClarifyListDTOS?.[0]?.clarifyAdoptionRate)}</div>
            )}
          </div>
          // </div>
        );
      },
    },
    {
      title: '标准问/意图',
      dataIndex: 'clarifyDetail',
      search: false,
      width: 300,
      render: (arr: any, row: any) => {
        if (Array.isArray(row?.robotClarifyListDTOS?.[0]?.clarifyDetail)) {
          return (
            <div
              className={style['question-box']}
              onClick={() => {
                openSelectFaqModal(row?.robotClarifyListDTOS);
              }}
            >
              {row?.robotClarifyListDTOS?.[0]?.clarifyDetail?.map((item: any, i: number) => {
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
      title: '时间',
      dataIndex: 'createTime',
      search: false,
      sorter: true,
      width: 180,
      render: (val: any, row: any) => {
        return row?.robotClarifyListDTOS?.[0]?.createTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 230,
      render: (val: any, row: any, index: any) => {
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {openList[index] ? (
                <div>
                  {row?.robotClarifyListDTOS?.map((item: any, idx: any) => (
                    <div key={idx}>
                      <div style={{ display: 'flex' }}>
                        <Button
                          type="link"
                          onClick={() => {
                            openDetailModal(row?.robotClarifyListDTOS?.[idx]);
                          }}
                        >
                          查看聊天记录
                        </Button>

                        <Popconfirm
                          title="删除将不可恢复，确认删除？"
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => {
                            deleteRow(row?.robotClarifyListDTOS?.[idx]);
                          }}
                        >
                          <Button type="link" danger>
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                      {idx != row?.robotClarifyListDTOS?.length - 1 && (
                        <Divider style={{ margin: '0' }}></Divider>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex' }}>
                  <Button
                    type="link"
                    onClick={() => {
                      openDetailModal(row?.robotClarifyListDTOS?.[0]);
                    }}
                  >
                    查看聊天记录
                  </Button>

                  <Popconfirm
                    title="删除将不可恢复，确认删除？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                      deleteRow(row?.robotClarifyListDTOS?.[0]);
                    }}
                  >
                    <Button type="link" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              )}
              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  batchDelete(row);
                }}
              >
                <Button type="link" danger>
                  删除组
                </Button>
              </Popconfirm>
              <Button
                type="link"
                onClick={() => {
                  setSelectRow(row);
                  openModal();
                }}
                style={{ color: '#19be6b' }}
              >
                加入组
              </Button>
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
    const _item = form.getFieldsValue();
    if (!_item?.['questionList']?.length) {
      _item.questionList = [''];
      form.setFieldsValue(_item);
    }
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
      message.warning('表单校验不通过');
      return;
    }
    // ------------

    if (selectRow?.clarifyGroupId) {
      let data: any = {
        ...res,
        robotId: info.id,
        clarifyGroupId: selectRow?.clarifyGroupId,
        clarifyDetailList: selectRow?.robotClarifyListDTOS?.[0]?.clarifyDetail,
      };
      res = await addGroup(data);
    } else {
      let data: any = {
        robotId: info.id,
        ...res,
      };
      res = await addClearItem(data);
    }

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
          onChange: () => {
            setOpenList([]);
          },
        }}
        dateFormatter="string"
        headerTitle={
          <div>
            澄清样本问题 {total} 条, 标准问 {questionTotal} 条
            <Tip
              title={
                '当客户输入的文本与配置的文本完全匹配时，触发澄清，澄清的内容为配置的标准问/意图。用于对特定文本回复澄清内容。'
              }
            />
          </div>
        }
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setSelectRow({});
              openModal();
            }}
          >
            添加
          </Button>,
        ]}
      />

      <DetailModal cref={modalRef} />

      <SelectFaqModal
        cref={selectFaqModalRef}
        confirm={confirmUpdateSelect}
        max={robotType == '语音' ? 2 : 5}
        deleteQuestion={false}
      />

      <Modal
        title={'新增FAQ-澄清'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={opLoading}
        maskClosable={false}
        width={600}
        destroyOnClose={true}
      >
        <div className={style['modal-page']}>
          <div className={style['modal-form']}>
            <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} autoComplete="off">
              <FormList name={'questionList'}>
                {(fields, { add, remove }) => {
                  const addNew = () => {
                    let length = fields.length;
                    console.log(length);
                    // if (length >= maxRecommendLength) {
                    //   message.warning('推荐设置不能超过faq全局配置限制数量');
                    //   return;
                    // }
                    add('', length);
                  };

                  return (
                    <div className={style['questionList']}>
                      {fields.map((field: any, index: number) => {
                        return (
                          <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={
                              index === 0 ? (
                                <span>
                                  <span style={{ color: 'red' }}>*</span> 客户问题
                                  <Tip
                                    title={
                                      <>
                                        输入的文本与 <b>FAQ-黑名单</b>{' '}
                                        一样，位于最高优先级，直接触发问题澄清。假设配置的标准问/意图为A和B，文本机器人会询问客户：{' '}
                                        <b>您是想咨询以下哪个问题？A B</b> 语音机器人则会说：{' '}
                                        <b>您是想咨询A还是B</b>
                                      </>
                                    }
                                  />
                                </span>
                              ) : (
                                ''
                              )
                            }
                            className={style['faq_zy-row_sp']}
                            // rules={[{ required: true, message: '请选择' }]}
                            key={field.key}
                          >
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className={style['del-bt']}
                                onClick={() => {
                                  remove(index);
                                }}
                              />
                            ) : null}
                            <Form.Item
                              name={[field.name]}
                              fieldKey={[field.fieldKey]}
                              rules={[
                                { required: true, message: '请输入客户问题' },
                                { max: 200, message: '不能超过200个文字' },
                              ]}
                            >
                              <TextArea
                                style={{ width: '100%' }}
                                placeholder={'请输入客户问题'}
                                maxLength={200}
                                rows={1}
                              />
                            </Form.Item>
                          </Form.Item>
                        );
                      })}

                      <div className={style['recommend-box']}>
                        <Button
                          type="link"
                          icon={<PlusCircleOutlined />}
                          onClick={addNew}
                          style={{ paddingLeft: '161px' }}
                        >
                          新增客户问题
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </FormList>
              <Condition r-if={!selectRow?.clarifyGroupId}>
                <Form.Item
                  label="标准问/意图"
                  name="clarifyDetailList"
                  rules={[{ required: true, message: '请选择标准问/意图' }]}
                >
                  <FaqSelect />
                </Form.Item>
              </Condition>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FAQClearList;
