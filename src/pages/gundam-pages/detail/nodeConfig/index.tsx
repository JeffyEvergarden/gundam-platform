import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import HighConfig from '../../main-draw/drawerV2/child/high-config';
import style from './style.less';
import { useModel } from 'umi';

const { Option } = Select;

const NodeConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();

  const { flowList, getLabelList, getFlowList } = useModel('drawer' as any, (model: any) => ({
    flowList: model._flowList, // 业务流程列表
    getLabelList: model.getLabelList,
    getFlowList: model.getFlowList,
  }));

  const submit = async () => {
    let res: any = await form.validateFields();
    console.log(res);
  };
  useEffect(() => {
    getLabelList(); // 获取话术标签
    getFlowList();
    form.setFieldsValue({
      rejectAction: {
        responseList: [
          { actionText: '不好意思，能再说一遍吗？' },
          { actionText: '刚刚没听清楚，能再说一次吗？' },
          { actionText: '我刚刚没听明白，能再说一遍吗？' },
        ],
      },
      silenceAction: {
        responseList: [
          { actionText: '您好，您还在吗？' },
          { actionText: '您好，能听到我说话吗？' },
          { actionText: '您好，请问还在吗？' },
        ],
      },
    });
  }, []);

  return (
    <div className={style['machine-page']}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form form={form}>
          <HighConfig form={form} bussinessList={flowList} type={'config'}></HighConfig>
        </Form>
        <Button type="primary" onClick={submit} style={{ alignSelf: 'flex-end' }}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default NodeConfig;
