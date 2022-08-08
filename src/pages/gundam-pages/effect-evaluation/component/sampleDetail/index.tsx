import config from '@/config';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Dropdown, Input, Menu, message, Popconfirm, Space } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useDetailSampleModel } from '../../model';
import style from './style.less';

const { RangePicker } = DatePicker;

const DetailPages: React.FC = (props: any) => {
  const actionRef = useRef<any>();
  const selectFaqModalRef = useRef<any>();

  const { getList } = useDetailSampleModel();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [learnNum, setLearnNum] = useState<number>(0);
  const [standardNum, setStandardNum] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);
  const [menulabel, setMenuLabel] = useState<string>('批量处理');

  const [visibleSession, setVisibleSession] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({});
  // const [disaAbledData, setDisAbledData] = useState<any>();
  const [datasource, setDataSource] = useState<any>([]);
  const [operation, setOperation] = useState<string>('');
  const [paramsObj, setParamsObj] = useState<any>({ orderCode: '2', orderType: '2' });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };

  const handleMenuClick = async (item: any) => {
    if (selectRow.length > 0) {
      if (item.key == '2') {
        setMenuLabel('批量添加');
        setOperation('addBatch');
        (selectFaqModalRef.current as any)?.open({
          selectList: [], //被选中列表
          selectedQuestionKeys: [], // 已选问题
          selectedWishKeys: [], // 已选意图
          question: '批量添加',
          operation: 'batch',
          questionList: selectRow,
        });
      }
    } else {
      message.warning('至少选择一个问题');
    }
  };

  const onConfirm = async () => {
    setMenuLabel('批量加入黑名单');
    let temp: any = [];
    selectRow.map((item: any) => {
      temp.push({
        question: item.question,
        unknownId: item.id,
      });
    });
    let params = {
      robotId: info.id,
      blacklistQuestionList: temp,
    };
  };

  const cancelSession = () => {
    setVisibleSession(false);
  };

  const clarify = (r: any) => {
    (selectFaqModalRef.current as any)?.open({
      selectList: [], //被选中列表
      selectedQuestionKeys: [], // 已选问题
      selectedWishKeys: [], // 已选意图
      question: r.question,
    });
    setOperation('clarify');
    setModalData(r);
  };

  const confirmUpdateSelect = async (val: any, inputValue: any) => {
    if (!val.length) {
      message.warning('请选择FAQ/意图');
      return false;
    }
    if (!inputValue) {
      message.warning('请输入相似语料或者相似问');
      return false;
    }
    if (operation == 'addBatch' && inputValue.some((item: any) => item.question == '')) {
      message.warning('请输入相似语料或者相似问');
      return false;
    }
    let resAdd: any = {};
    // 澄清
    if (operation == 'clarify') {
      let addParams = {
        robotId: info.id,
        question: inputValue,
        unknownId: modalData.id,
        clarifyDetailList: val,
      };
      resAdd = await addClearItem(addParams);
      if (resAdd) {
        actionRef.current.reloadAndRest();
        return true;
      } else {
        return false;
      }
    } else if (operation == 'addBatch' || operation == '') {
      let params;
      if (operation == 'addBatch') {
        //批量添加
        let temp: any = [];
        inputValue.map((item: any) => {
          temp.push({
            question: item.question,
            unknownId: item.id,
          });
        });
        if (val?.[0]?.recommendType == 2) {
          // 意图
          params = {
            robotId: info.id,
            intentId: val?.[0]?.recommendId,
            corpusTextList: temp,
          };
          // resAdd = await intentAddBatch(params);
          // faq
        } else if (val?.[0]?.recommendType == 1) {
          params = {
            robotId: info.id,
            faqId: val?.[0]?.recommendId,
            similarList: temp,
          };
          // resAdd = await faqAddBatch(params);
        }
      }
      if (operation == '') {
        //非意图非标准问
        if (val?.[0]?.recommendType == 2) {
          // 意图
          params = {
            robotId: info.id,
            intentId: val?.[0]?.recommendId,
            corpusTextList: [
              {
                question: inputValue,
                unknownId: modalData.id,
              },
            ],
          };
          // resAdd = await intentAddBatch(params);
          // faq
        } else if (val?.[0]?.recommendType == 1) {
          params = {
            robotId: info.id,
            faqId: val?.[0]?.recommendId,
            similarList: [
              {
                question: inputValue,
                unknownId: modalData.id,
              },
            ],
          };
          // resAdd = await faqAddBatch(params);
        }
      }
      if (resAdd?.resultCode === config.successCode) {
        message.success(resAdd?.resultDesc || '添加成功');
        actionRef.current.reloadAndRest();
        return true;
      } else {
        message.error(resAdd?.resultDesc || '添加失败');
        return false;
      }
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {/* <Popconfirm
        title="确认要批量加入黑名单吗？"
        onConfirm={onConfirm}
        onCancel={() => {}}
        okText="确定"
        cancelText="取消"
      > */}
      <Menu.Item key={'1'}>确认当前所选样本</Menu.Item>
      {/* </Popconfirm> */}
      <Menu.Item key={'2'}>确认所有待确认样本</Menu.Item>
    </Menu>
  );

  // orderCode  '1'-分类  '2'-时间
  //  orderType   '1'-升序 '2'-降序
  const tableChange = (pagination: any, filters: any, sorter: any) => {
    let temp = { orderCode: '2', orderType: '2' };
    if (sorter.columnKey === 'faqTypeName' && sorter.order === 'ascend') {
      temp.orderCode = '1';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'faqTypeName' && sorter.order === 'descend') {
      temp.orderCode = '1';
      temp.orderType = '2';
    }
    if (sorter.columnKey === 'updateTime' && sorter.order === 'ascend') {
      temp.orderCode = '2';
      temp.orderType = '1';
    }
    if (sorter.columnKey === 'updateTime' && sorter.order === 'descend') {
      temp.orderCode = '2';
      temp.orderType = '2';
    }
    let tempParamsObj = JSON.parse(JSON.stringify(paramsObj));
    let tempObj = Object.assign(tempParamsObj, temp);
    setParamsObj(tempObj);
  };

  const disabledDate = (current: any) => {
    return current && current > moment().subtract(0, 'days').endOf('day');
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
      width: 200,
    },
    {
      dataIndex: 'faqIntentList',
      title: '意图/FAQ',
      ellipsis: true,
      search: false,
      width: 200,
      render: () => {
        return '';
      },
    },
    {
      dataIndex: 'updateBy',
      title: '更新人',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      search: false,
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'tagStatus',
      title: '标注状态',
      width: 200,
      search: false,
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
                // ModalRef.current?.open?.('edit', row);
              }}
            >
              编辑样本
            </Button>

            <Popconfirm
              title="
              您是否确认要删除选中的对话样本？删除后将无法恢复"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                // await deleteSample(row).then((res) => {
                //   if (res) {
                //      TableRef?.current?.reload();
                //   }
                // });
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
  return (
    <Fragment>
      <div className={`${style['machine-page']} list-page`}>
        <div className={style['page_top']}>
          <div className={style['page_top__left']}>
            <ArrowLeftOutlined
              className={style['blue']}
              style={{ marginRight: '6px' }}
              onClick={() => {
                history.push('/gundamPages/effectEvaluation/sampleManager');
              }}
            />
            <span>样本集名字</span>
            <span
              style={{ fontSize: '16px' }}
            >{` （共4条：已标注${'2'}条，未标注1条，待确认1条）`}</span>
          </div>
          <Input.Search
            // bordered={false}
            style={{ width: '280px', padding: '4px' }}
            onSearch={(text: any) => {
              // setSearchText(text);
            }}
            // onPressEnter={(e: any) => {
            // setSearchText(e.target.value);
            // }}
            placeholder={'请输入'}
            allowClear
          />
        </div>
        <ProTable
          headerTitle={
            <Input
              style={{ width: '400px' }}
              placeholder="输入对话样本后按回车添加"
              onPressEnter={() => {
                console.log(1);
              }}
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
          // tableAlertOptionRender={false}
          // tableAlertRender={false}
          toolBarRender={() => [
            <Button>批量删除</Button>,
            <Button>批量预标注</Button>,
            <Dropdown
              overlay={menu}
              key="Dropdown"
              // disabled={selectRow?.length < 1}
            >
              <Button type="primary">
                <Space>
                  批量确认
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={async (params) => {
            return getList({
              robotId: info.id,
              page: params.current,
              ...params,
            });
          }}
        />
      </div>
    </Fragment>
  );
};

export default DetailPages;
