import { useState, useEffect } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber, message } from 'antd';
import HighConfig from '../../main-draw/drawerV2/child/high-config';
import style from './style.less';
import { useModel } from 'umi';
import { useNodeModel } from '../model';
import { _saveNode } from '../model/api';
import { processForm } from '../../main-draw/drawerV2/formate';

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
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写项目');
    });
    let res1: any = await form2.validateFields();
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
      highConfig: processForm(res),
      highConfig1: res,
      systemConfigList: _res,
    };
    if (res && res1) {
      await _saveNode(params).then((res) => {
        if (res.resultCode == '0000') {
          message.success(res.resultDesc);
          _getNodesConfig();
        } else {
          message.error(res.resultDesc);
        }
      });
    }

    console.log(params);
  };

  const _getNodesConfig = async () => {
    await getNodeConfig({ robotId: info.id }).then((res) => {
      console.log(res);
      setConfig(res?.systemConfigList);
      let obj: any = {};
      res?.systemConfigList?.forEach((item: any) => {
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
