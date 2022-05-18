import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Collapse, Row, Col, Form } from 'antd';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import style from './style.less';
import Recommend from '../question-board/components/recommend-modal';
import { history, useModel } from 'umi';

const { Panel } = Collapse;
const { Option } = Select;

const RecommendPage: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getFlowList, getTreeData, treeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeData,
    treeData: model.treeData,
  }));

  useEffect(() => {
    getFlowList(info.id);
    getTreeData(info.id);
  }, []);
  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.goBack();
            }}
          />
          推荐问设置
        </div>
      </div>
      <div className={style['label']}>
        <Form form={form} labelAlign={'right'} labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="标准问:" style={{ marginTop: '24px' }}>
            xxxx
          </Form.Item>
          <Recommend form={form} />
        </Form>
      </div>
    </div>
  );
};

export default RecommendPage;
