import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';

import IntentOperModal from './comps/addIntentModal';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Card, Form, Row, Col, Button, Input, Select, Space, Popconfirm } from 'antd';
import { searchFormList, tableList, fakeData } from './comps/config';
const { Option } = Select;
// 机器人列表
const DetailPages: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [loading, handleLoading] = useState<boolean>(false);
  const [intentOperVisible, handleIntentOperVisible] = useState<boolean>(false); // 控制意图操作弹出层是否可见
  const [intentOperTitle, handleIntentOperTitle] = useState<string>(''); // 控制意图操作弹出层标题
  const [intentOperData, handleIntentOperData] = useState<any>({}); // 控制意图操作弹出层数据

  const operation = [
    {
      dataIndex: 'trainData',
      title: '训练数据',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => ruleTemplate(record)}>规则模版</a>
            <a onClick={() => samples(record)}>样板</a>
          </Space>
        );
      },
    },
    {
      dataIndex: 'operation',
      title: '操作',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a onClick={() => operIntent(record, 'edit')}>编辑</a>
            <Popconfirm
              title="确认删除此意图吗?"
              okText="是"
              cancelText="否"
              onCancel={() => {}}
              onConfirm={() => deleteIntent(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {}, []);

  const search = () => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  };

  const getTables = (p?: any) => {
    const [pageData] = p;
    let data: any = [];
    const values = form.getFieldsValue();
    try {
      handleLoading(true);
      // const res = await
      return {
        data: fakeData,
        pageSize: 10,
        current: 1,
        total: 1,
      };
    } catch {
      return {
        data: data,
        pageSize: 10,
        current: 1,
        total: 1,
      };
    } finally {
      handleLoading(false);
    }
  };

  // 规则模版
  const ruleTemplate = (data: any) => {};

  // 样板
  const samples = (data: any) => {};

  // 操作意图 新增、编辑
  const operIntent = (data: any, type: string) => {
    console.log('operIntentData', data);
    type == 'add' && handleIntentOperTitle('新增');
    type == 'edit' && handleIntentOperTitle('编辑');
    handleIntentOperData({ ...data });
    handleIntentOperVisible(true);
  };

  // 删除意图
  const deleteIntent = (data: any) => {};

  const operIntentSubmit = () => {
    handleIntentOperVisible(false);
  };

  const operIntentFail = () => {
    handleIntentOperVisible(false);
  };

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: '24px 24px 0' }}>
        <Form form={form}>
          <Row gutter={24}>
            {searchFormList.map((item: any) => {
              return (
                <Col span={6} key={item.name}>
                  {item.type == 'input' && (
                    <Form.Item name={item.name} label={item.label}>
                      <Input allowClear />
                    </Form.Item>
                  )}
                  {item.type == 'select' && (
                    <Form.Item name={item.name} label={item.label}>
                      <Select allowClear>
                        <Option key={'0'} value={0}>
                          是
                        </Option>
                        <Option key={'1'} value={1}>
                          否
                        </Option>
                        <Option key={'2'} value={2}>
                          全部
                        </Option>
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              );
            })}
            <Col span={6}>
              <Space>
                <Button type="primary" onClick={search}>
                  搜索
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <div style={{ backgroundColor: 'white', padding: 24, marginTop: 24 }}>
        <Row gutter={24}>
          <Col span={24}>
            <Button onClick={() => operIntent({}, 'add')}>新增</Button>
          </Col>
        </Row>
      </div>
      <ProTable
        loading={loading}
        rowKey={(record) => record?.id}
        columns={[...tableList, ...operation]}
        options={false}
        search={false}
        actionRef={actionRef}
        // dataSource={fakeData}
        request={async (...params) => {
          return getTables(params);
        }}
      />

      <IntentOperModal
        visible={intentOperVisible}
        title={intentOperTitle}
        modalData={intentOperData}
        submit={operIntentSubmit}
        cancel={operIntentFail}
      />
    </React.Fragment>
  );
};

export default DetailPages;
