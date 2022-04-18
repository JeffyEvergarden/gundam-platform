import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import HighConfig from '../../main-draw/drawerV2/child/high-config';
import style from './style.less';
import { useModel } from 'umi';
import { useNodeModel } from '../model';
import { _saveNode } from '../model/api';

const { Option } = Select;
const { Item: FormItem, List: FormList } = Form;

const NodeConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [config, setConfig] = useState<any>();

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
    let res1: any = await form2.validateFields();
    console.log(config);
    let _res = config.map((item: any) => {
      Object.keys(res1.systemConfigList).forEach((v) => {
        console.log(item.configKey, v);
        if (item?.configKey == v) {
          item.configValue = res1.systemConfigList[v];
        }
      });
      return item;
    });

    let params = {
      robotId: info.id,
      highConfig: res,
      systemConfigList: _res,
    };

    await _saveNode(params);

    console.log(params);
  };

  const findValue = (data: any, val: any) => {
    return data?.systemConfigList?.find((item: any) => {
      return item[val] == val;
    })?.configValue;
  };

  const _getNodesConfig = async () => {
    await getNodeConfig({ robotId: info.id }).then((res) => {
      console.log(res);
      setConfig(res.systemConfigList);
      let obj: any = {};
      res.systemConfigList.forEach((item: any) => {
        obj[item.configKey] = item.configValue;
      });

      form.setFieldsValue(res?.highConfig);
      form2.setFieldsValue({ systemConfigList: { ...obj } });
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
          <HighConfig
            form={form}
            bussinessList={flowList}
            type={'config'}
            config={config}
          ></HighConfig>
        </Form>

        <Form form={form2}>
          <div className={style['antd-form']}>
            <Space align="baseline">
              <div
                className={style['title_sp']}
                style={{ marginRight: '16px', marginBottom: '20px' }}
              >
                意图澄清配置
              </div>
            </Space>

            {config?.map((item: any) => {
              return (
                <FormItem
                  // {...col}
                  label={item.configName}
                  name={['systemConfigList', item.configKey]}
                  key={'systemConfigList' + item.configKey}
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: 200 }} min={0} max={1} step="0.01" precision={2} />
                </FormItem>
              );
            })}
          </div>
        </Form>
        <Button type="primary" onClick={submit} style={{ alignSelf: 'flex-end' }}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default NodeConfig;
