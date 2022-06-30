import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  PlusCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined, // 删除图标
  UploadOutlined, // 上传图标
  DownloadOutlined, // 下载图标
  EditOutlined,
} from '@ant-design/icons';
import { Drawer, Button, Space, Select, Input, message, Popconfirm, Modal } from 'antd';

import {
  sampleRulesColumns,
  sampleRulesFakeDatas,
  featureWordColumns,
  featureWordTableFakeData,
} from './config';
import RuleSampleDetailModal from './rulesDetailModal';
import UploadModal from './uploadModal';
import AddCharactertic from './addCharacter';

const { Search } = Input;

export default (props: any) => {
  const { title, visible, onCancel } = props;
  const [loading, handleLoading] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>('1');
  const [editRuleColConfig, setShowEditRuleColConfig] = useState<any>({}); // 编辑可展开行

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>();
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: (keys: any, rows: any) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  const [ruleModalVisible, handleRuleModalVisible] = useState<boolean>(false); // 规则模版弹出框 是否可见
  const [ruleModalTitle, handleRuleModalTitle] = useState<string>(''); // 规则模版 标题
  const [ruleModalData, handleRuleModalData] = useState<any>({}); // 规则模版 点击行 的数据

  const [uploadModalVisible, handleUploadModalVisible] = useState<boolean>(false); // 导入 弹出框 是否可见

  const [addCharacterModalVisible, handleAddCharacterModalVisible] = useState<boolean>(false); // 新建特征词弹出框 是否可见
  const [addCharacterModalTitle, handleAddCharacterModalTitle] = useState<string>('');
  const [addCharacterData, handleAddCharacterData] = useState<any>({});

  const [expandedRowKeys, setExpandedRowKeys] = useState<string>(''); // 保存展开行的key值
  const [clickExpandedNum, setClickExpandedNum] = useState<number>(0); // 保存展开行 被点击 的次数

  // 模版内容选择框
  const selectFunc = (value: any) => {
    setSelectValue(value);
  };

  // 下载按钮
  const downLoad = () => {};

  // 上传按钮
  const upload = () => {
    handleUploadModalVisible(true);
  };

  const headNode = (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#eaeaea',
        alignItems: 'center',
        margin: '8px 24px 0',
        padding: '5px 16px',
      }}
    >
      <Space>
        <CaretUpOutlined />
        <span>上移</span>
      </Space>
      <Space style={{ margin: '0 8px' }}>
        <CaretDownOutlined />
        <span>下移</span>
      </Space>
      <Space style={{ margin: '0 8px' }}>
        <DeleteOutlined />
        <span>删除模版</span>
      </Space>

      <div style={{ width: 390 }}>
        <Input.Group compact>
          <Select value={selectValue} style={{ width: 130 }} size="middle" onChange={selectFunc}>
            <Select.Option value="1">模版片段内容</Select.Option>
          </Select>
          <Input style={{ width: '66%' }} defaultValue="搜索模版" maxLength={200} />
        </Input.Group>
      </div>
    </div>
  );

  // 操作规则模版的数据
  const operateRulesData = (data: any, type: string, index?: number) => {
    handleRuleModalData(data);
    handleRuleModalTitle(type);
    if (type == 'edit') {
      let index = clickExpandedNum;
      index++;
      setClickExpandedNum(index);
      if (index % 2) {
        setExpandedRowKeys(data.id);
      } else {
        setExpandedRowKeys('');
      }
    } else if (type == 'add') {
      handleRuleModalVisible(true);
      setShowEditRuleColConfig({});
    }
  };

  // 初始化 规则模版 table 数据
  const getInitRuleTables = async (p?: any) => {
    const [pageData] = p;
    let data: any = [];
    try {
      // const res = await
      handleLoading(true);
      return {
        data: sampleRulesFakeDatas,
        total: 1,
        pageSize: pageData.pageSize || 10,
        current: pageData.current || 1,
      };
    } catch {
      return {
        data: [],
        total: 1,
        pageSize: pageData.pageSize || 10,
        current: pageData.current || 1,
      };
    } finally {
      handleLoading(false);
    }
  };

  const getInitWordTables = async (p?: any) => {
    const [pageData] = p;
    let data: any = [];
    try {
      // const res = await
      return {
        data: featureWordTableFakeData,
        total: 1,
        pageSize: pageData.pageSize || 10,
        current: pageData.current || 1,
      };
    } catch {
      return {
        data: [],
        total: 1,
        pageSize: pageData.pageSize || 10,
        current: pageData.current || 1,
      };
    }
  };

  const onClose = () => {
    onCancel();
  };

  // 规则模版 确认
  const ruleModalSubmit = () => {
    handleRuleModalVisible(false);
  };

  // 规则模版 取消
  const ruleModalCancel = () => {
    handleRuleModalVisible(false);
  };

  const uploadSuccess = () => {
    handleUploadModalVisible(false);
  };

  const uploadCancel = () => {
    handleUploadModalVisible(false);
  };

  // 新建特征词
  const operateCharacter = (data: any, type: string) => {
    if (type !== 'delete') {
      handleAddCharacterModalTitle(type);
      handleAddCharacterData(data);
      handleAddCharacterModalVisible(true);
    } else {
    }
  };

  // 搜索特征词
  const searchFeatureWord = (value: any) => {
    console.log(value);
  };

  const addFeatureSuccess = () => {
    handleAddCharacterModalVisible(false);
  };

  const addFeatureCancel = () => {
    handleAddCharacterModalVisible(false);
  };

  const ruleOperateColumn = [
    {
      dataIndex: 'operation',
      title: '',
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <div onClick={() => operateRulesData(record, 'edit', index)}>
              <EditOutlined />
            </div>
            <a>置顶</a>
            <a>删除</a>
          </Space>
        );
      },
    },
  ];

  const wordOperateColumn = [
    {
      dataIndex: 'operation',
      title: '',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => operateCharacter(record, 'edit')}>编辑描述</a>
            <Popconfirm
              title="确认删除该条特征词吗？"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => operateCharacter(record, 'delete')}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Drawer title={title} width={'100%'} placement="right" onClose={onClose} visible={visible}>
        <div style={{ padding: '5px 24px', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <PlusCircleOutlined />
            <span onClick={() => operateRulesData({}, 'add')}>添加规则模版</span>
          </Space>
          <Space>
            <div>
              <UploadOutlined />
              <span onClick={upload}>导入</span>
            </div>
            <div>
              <DownloadOutlined />
              <span onClick={downLoad}>导出</span>
            </div>
          </Space>
        </div>
        {headNode}
        <ProTable
          rowKey="id"
          request={async (...params) => {
            return getInitRuleTables(params);
          }}
          loading={loading}
          search={false}
          options={false}
          columns={[...sampleRulesColumns, ...ruleOperateColumn]}
          rowSelection={rowSelection}
          tableAlertRender={false}
          tableAlertOptionRender={false}
          expandable={{
            expandedRowRender: (record) => (
              <RuleSampleDetailModal
                title={'edit'}
                modalData={ruleModalData}
                onSubmit={ruleModalSubmit}
                onCancel={ruleModalCancel}
              />
            ),
            showExpandColumn: false,
            expandedRowKeys: [expandedRowKeys], // 控制展开的行
            rowExpandable: (record) => true,
          }}
        />

        <ProTable
          headerTitle={<Button onClick={() => operateCharacter({}, 'add')}>新建特征词</Button>}
          rowKey="id"
          toolBarRender={() => [
            <Search
              key="0"
              placeholder="搜索特征词"
              onSearch={searchFeatureWord}
              style={{ width: 200 }}
            />,
          ]}
          request={async (...params) => {
            return getInitWordTables(params);
          }}
          loading={loading}
          search={false}
          options={false}
          columns={[...featureWordColumns, ...wordOperateColumn]}
          rowSelection={rowSelection}
          tableAlertRender={false}
          tableAlertOptionRender={false}
        />
      </Drawer>

      <Modal
        visible={ruleModalVisible}
        title={'新增'}
        footer={false}
        width={1000}
        onCancel={ruleModalCancel}
      >
        <RuleSampleDetailModal
          modalData={ruleModalData}
          onSubmit={ruleModalSubmit}
          onCancel={ruleModalCancel}
        />
      </Modal>

      {/* <RuleSampleDetailModal
        visible={ruleModalVisible}
        title={ruleModalTitle}
        modalData={ruleModalData}
        onSubmit={ruleModalSubmit}
        onCancel={ruleModalCancel}
      /> */}

      <UploadModal
        visible={uploadModalVisible}
        uploadUrl={'www.baidu.com'}
        onSubmit={uploadSuccess}
        onCancel={uploadCancel}
      />

      <AddCharactertic
        visible={addCharacterModalVisible}
        title={addCharacterModalTitle}
        modalData={addCharacterData}
        onSubmit={addFeatureSuccess}
        onCancel={addFeatureCancel}
      />
    </React.Fragment>
  );
};
