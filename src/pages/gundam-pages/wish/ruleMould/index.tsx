import React, { useState, useEffect, useRef, Fragment } from 'react';
import ProTable from '@ant-design/pro-table';
import { Space, Button, Tooltip, Popconfirm, message, Card, Divider } from 'antd';
import { useRuleModule } from './model';
import { useModel, history } from 'umi';
import FeatureModal from './components/featureModal';
import RuleDrawer from './components/ruleDrawer';
import { QuestionCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import config from '@/config';
import styles from './index.less';

export default (props: any) => {
  const actionRef = useRef<any>();
  const actionRefFeature = useRef<any>();

  const {
    getRuleList,
    getFeatureList,
    ruleAdd,
    ruleEdit,
    deleteRule,
    moveRule,
    delFeatures,
    featuresAdd,
    featureEdit,
  } = useRuleModule();
  const [visibleFeatures, setFeaturesVisible] = useState<boolean>(false);
  const [pageTypeFeature, setPageTypeFeature] = useState<string>('');
  const [featureData, setFeatureData] = useState<any>({});

  const [visibleRule, setVisibleRule] = useState<boolean>(false);
  const [pageTypeRule, setPageTypeRule] = useState<string>('');
  const [ruleData, setRuleData] = useState<any>({});

  const [tableData, setTableData] = useState<any>([]);
  const [tableProps, setTableProps] = useState<any>({});

  useEffect(() => {
    let historyData = history?.location || {};
    setTableProps(historyData?.state?.info);
  }, []);

  const ruleList = async (payload: any) => {
    let oparams = {
      page: payload.current,
      pageSize: payload.pageSize,
      intentId: tableProps?.id,
    };
    let res = await getRuleList(oparams);
    setTableData(res?.res?.data?.list);
    return {
      data: res?.dataTableData || [],
      total: res?.totalPage,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const featureList = async (payload: any) => {
    let oparams = {
      page: payload.current,
      pageSize: payload.pageSize,
      intentId: tableProps?.id,
    };
    let res = await getFeatureList(oparams);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
      current: payload.current,
      pageSize: payload.pageSize,
    };
  };

  const addRule = () => {
    setVisibleRule(true);
    setPageTypeRule('add');
    setRuleData({
      intentRuleName: '',
      threshold: 0.7,
      robotIntentRuleDetailList: [{ fragment: '', orderNumber: null, required: '是' }],
    });
  };

  const editRule = (row: any) => {
    debugger;
    let temRuleDataItem = {};
    tableData.map((item: any) => {
      if (item.id === row.idFather) {
        temRuleDataItem = item;
      }
    });
    setVisibleRule(true);
    setPageTypeRule('edit');
    setRuleData(temRuleDataItem);
  };

  const cancelRule = () => {
    setVisibleRule(false);
  };

  const saveRule = async (values: any) => {
    let params = {
      id: ruleData?.id,
      robotId: tableProps?.robotId,
      intentId: tableProps?.id,
      intentRuleName: values?.intentRuleName,
      threshold: values?.threshold,
      robotIntentRuleDetailAddRequests: values?.ruleClips,
    };
    let res;
    if (pageTypeRule === 'add') {
      res = await ruleAdd(params);
    }
    if (pageTypeRule === 'edit') {
      res = await ruleEdit(params);
    }

    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      setVisibleRule(false);
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const delRule = async (row: any) => {
    let res = await deleteRule({ id: row.idFather });
    if (res?.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const move = async (row: any, type: boolean) => {
    let params = {
      id: row?.intentRuleId,
      intentId: tableProps?.id,
      robotId: row?.robotId,
      orderNumber: row?.orderNumber,
      move: type,
    };
    let res = await moveRule(params);
    if (res?.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const addFeatures = () => {
    setFeaturesVisible(true);
    setPageTypeFeature('add');
    setFeatureData({});
  };
  const editFeatures = (record: any) => {
    setFeaturesVisible(true);
    setPageTypeFeature('edit');
    setFeatureData(record);
  };

  const cancelFeature = () => {
    setFeaturesVisible(false);
  };

  const saveFeature = async (values: any) => {
    let res;
    if (pageTypeFeature === 'add') {
      let params = {
        intentId: tableProps?.id,
        ...values,
      };
      res = await featuresAdd(params);
    }
    if (pageTypeFeature === 'edit') {
      let params = {
        name: values.name,
        wordSet: values.wordSet,
        id: featureData?.id,
      };
      res = await featureEdit(params);
    }

    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      actionRefFeature?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }

    setFeaturesVisible(false);
  };

  const deleteFeatures = async (payload: any) => {
    let res = await delFeatures({ id: payload.id });
    if (res.resultCode === config.successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reload();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const ruleColumns: any = [
    {
      dataIndex: 'intentRuleName',
      title: '规则名称',
      ellipsis: true,
      // fixed: 'left',
      width: 200,
      render(_: any, row: any) {
        return {
          children: row.intentRuleName,
          props: {
            rowSpan: row.intentRuleNamerowSpan,
          },
        };
      },
    },
    {
      dataIndex: 'fragment',
      title: '规则内容',
      ellipsis: true,
      // fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'orderNumber',
      title: '片段排序',
      ellipsis: true,
      // fixed: 'left',
      width: 100,
    },
    {
      dataIndex: 'required',
      title: '必须匹配',
      ellipsis: true,
      // fixed: 'left',
      width: 100,
      valueEnum: {
        1: '是',
        0: '否',
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render(_: any, row: any, index: any) {
        return {
          children: (
            <div className={styles.optionSty}>
              <Space>
                <span onClick={() => move(row, true)}>上移</span>
                <span onClick={() => move(row, false)}>下移</span>
                <span onClick={() => editRule(row)}>编辑</span>
                <Popconfirm
                  title="确认删除该条规则吗?"
                  okText="是"
                  cancelText="否"
                  onCancel={() => {}}
                  onConfirm={() => delRule(row)}
                >
                  <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>
              </Space>
            </div>
          ),
          props: {
            rowSpan: row.intentRuleNamerowSpan,
          },
        };
      },
    },
  ];

  const featuresColumns: any = [
    {
      dataIndex: 'name',
      title: '特征',
      ellipsis: true,
      // fixed: 'left',
      width: 200,
    },
    {
      dataIndex: 'wordSet',
      title: '特征词集',
      ellipsis: true,
      // fixed: 'left',
      width: 400,
    },
    {
      dataIndex: 'updataBy',
      title: '更新人',
      ellipsis: true,
      // fixed: 'left',
      width: 120,
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'wordCount',
      title: '词汇量',
      ellipsis: true,
      // fixed: 'left',
      width: 150,
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => editFeatures(record)}>编辑</a>
            <Popconfirm
              title="确认删除该条特征吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => deleteFeatures(record)}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Card>
      <div className={styles.title}>
        <ArrowLeftOutlined
          style={{ marginRight: '6px', color: '#1890ff' }}
          onClick={() => {
            history?.goBack();
          }}
        />
        {tableProps?.intentName}
      </div>
      <ProTable
        headerTitle={
          <Fragment>
            <Divider
              type="vertical"
              style={{ width: '4px', height: '16px', backgroundColor: 'rgba(24,144,255,1)' }}
            />
            <span className={styles.table_title}>规则列表</span>
            <Tooltip title="通过配置一个或多个规则片段，组成用户表达意图的不同话术规则。可以插入词槽和特征词，当命中规则时，可以进行相应的填槽处理。序号表示规则片段在用户query中必须遵守从左到右的匹配顺序，同序号规则片段之间无视匹配顺序；0 代表任意位，对应的规则片段可以出现在query中任意位置。阈值表示，query中可识别部分占总query长度的比例达到多少时，该query可被识别为所标注的意图">
              <span className={styles.iconSty}>
                <QuestionCircleOutlined />
              </span>
              <span className={styles.explain}>配置说明</span>
            </Tooltip>
          </Fragment>
        }
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => addRule()}>
            添加规则
          </Button>,
        ]}
        rowKey={(record) => record?.id}
        scroll={{ x: ruleColumns.length * 200 }}
        actionRef={actionRef}
        columns={ruleColumns}
        pagination={{
          pageSize: 10,
        }}
        search={false}
        // options={false}
        request={async (params = {}) => {
          return ruleList(params);
        }}
      />
      <ProTable
        headerTitle={
          <Fragment>
            <Divider
              type="vertical"
              style={{ width: '4px', height: '16px', backgroundColor: 'rgba(24,144,255,1)' }}
            />
            <span className={styles.table_title}>关联特征</span>
          </Fragment>
        }
        toolBarRender={() => [
          <Button key="0" type="primary" onClick={() => addFeatures()}>
            新建特征
          </Button>,
        ]}
        rowKey={(record) => record?.id}
        scroll={{ x: featuresColumns.length * 200 }}
        actionRef={actionRefFeature}
        columns={featuresColumns}
        pagination={{
          pageSize: 10,
        }}
        search={false}
        // options={false}
        request={async (params = {}) => {
          return featureList(params);
        }}
      />
      <FeatureModal
        visible={visibleFeatures}
        type={pageTypeFeature}
        modalData={featureData}
        cancel={cancelFeature}
        save={saveFeature}
      />
      <RuleDrawer
        visible={visibleRule}
        type={pageTypeRule}
        modalData={ruleData}
        cancel={cancelRule}
        save={saveRule}
        tableProps={tableProps}
      />
    </Card>
  );
};
