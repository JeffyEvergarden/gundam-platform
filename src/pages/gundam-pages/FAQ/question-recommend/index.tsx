import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Collapse, Row, Col, Form, message } from 'antd';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import style from './style.less';
import Recommend from '../question-board/components/recommend-modal';
import { history, useModel } from 'umi';
import { editQuestion, getRecommend } from '../FAQ-manage/model/api';
import config from '@/config';

const { Panel } = Collapse;
const { Option } = Select;

const RecommendPage: React.FC<any> = (props: any) => {
  const query: any = history.location.query;
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

  const save = () => {
    console.log(form.getFieldsValue());
    let reqData = { ...form.getFieldsValue() };
    reqData.questionRecommend = reqData?.questionRecommend ? 1 : 0;
    editRecommend({ ...reqData });
  };

  const editRecommend = async (params: any) => {
    let reqData = {
      id: query?.faqId,
      robotId: info.id,
      faqTypeId: query?.treeId,
      ...params,
    };
    await editQuestion(reqData).then((res) => {
      if (res.resultCode == config.successCode) {
        message.success(res.resultDesc);
        if (query?.recycle == 0) {
          history.push('/gundamPages/faq/main');
        } else if (query?.recycle == 1) {
          history.push('/gundamPages/faq/recycle');
        }
        return true;
      } else {
        message.error(res.resultDesc);
        return false;
      }
    });
  };

  const getRecommendList = async () => {
    await getRecommend({ faqId: query?.faqId }).then((res) => {
      if (res.resultCode == config.successCode) {
        let formData = {
          requestionRecommend: query.recommend ? true : false,
          recommendList: res?.data || [],
        };
        form.setFieldsValue(formData);
      } else {
        message.error(res.resultDesc);
      }
    });
  };

  useEffect(() => {
    getFlowList(info.id);
    getTreeData(info.id);
    getRecommendList();
  }, []);
  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              if (query?.recycle == 0) {
                history.push('/gundamPages/faq/main');
              } else if (query?.recycle == 1) {
                history.push('/gundamPages/faq/recycle');
              }
            }}
          />
          推荐问设置
        </div>
      </div>
      <div className={style['label']}>
        <Form form={form} labelAlign={'right'} labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="标准问:" style={{ marginTop: '24px' }}>
            {query?.question}
          </Form.Item>
          <Recommend form={form} faqTypeId={query?.faqId} />
        </Form>
        <div className={style['board-btn']}>
          {query?.recycle == 0 && (
            <Button type="primary" onClick={save}>
              确定
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendPage;
