import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import HighConfig from '../../main-draw/drawerV2/child/high-config';
import style from './style.less';
import { useModel } from 'umi';
import { useNodeModel } from '../model';

const { Option } = Select;

const NodeConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();

  const { getNodeConfig, saveNode, configLoading } = useNodeModel();

  const { info, businessFlowId, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
    getGlobalValConfig: model.getGlobalValConfig,
  }));

  const { flowList, getMessageList, getWishList, getWordSlotList, getLabelList, getFlowList } =
    useModel('drawer' as any, (model: any) => ({
      flowList: model._flowList || [],
      wishList: model._wishList || [],
      wordSlotList: model._wordSlotList || [],
      getMessageList: model.getMessageList || [],
      getWishList: model.getWishList || [],
      getWordSlotList: model.getWordSlotList || [],
      getLabelList: model.getLabelList || [],
      getFlowList: model.getFlowList || [],
    }));

  const submit = async () => {
    let res: any = await form.validateFields();
    console.log(res);
  };

  const _getNodesConfig = async () => {
    await getNodeConfig({ robotId: info.id }).then((res) => {
      console.log(res);
      form.setFieldsValue(res);
    });
  };

  useEffect(() => {
    _getNodesConfig();
    getLabelList(info.id); // 获取话术标签
    getFlowList(info.id); // 获取业务流程列表
    getWishList(info.id); // 意图列表
    getWordSlotList(info.id); // 词槽列表
    getMessageList(info.id); // 短信
    getGlobalValConfig(info.id); // 获取全局变量列表
    // form.setFieldsValue({
    //   rejectAction: {
    //     responseList: [
    //       { actionText: '不好意思，能再说一遍吗？' },
    //       { actionText: '刚刚没听清楚，能再说一次吗？' },
    //       { actionText: '我刚刚没听明白，能再说一遍吗？' },
    //     ],
    //   },
    //   silenceAction: {
    //     responseList: [
    //       { actionText: '您好，您还在吗？' },
    //       { actionText: '您好，能听到我说话吗？' },
    //       { actionText: '您好，请问还在吗？' },
    //     ],
    //   },
    // });
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
