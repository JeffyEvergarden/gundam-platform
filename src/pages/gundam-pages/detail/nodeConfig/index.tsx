import Tip from '@/components/Tip';
import config from '@/config/index';
import { Button, Form, InputNumber, message, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import HighConfig from '../../main-draw/drawerV2/child/high-config';
import { processForm } from '../../main-draw/drawerV2/formate';
import { useNodeModel } from '../model';
import style from './style.less';

const { Option } = Select;
const { Item: FormItem, List: FormList } = Form;

const NodeConfig: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [Nconfig, setNConfig] = useState<any>();

  const { getNodeConfig, saveNode, configLoading } = useNodeModel();

  const { info, businessFlowId, getGlobalValConfig, setDrawType } = useModel(
    'gundam' as any,
    (model: any) => ({
      info: model.info,
      businessFlowId: model.businessFlowId,
      getGlobalValConfig: model.getGlobalValConfig,
      setDrawType: model.setDrawType,
    }),
  );

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
    if (!res) {
      return;
    }
    console.log(res);

    let res1: any = await form2.validateFields();
    let _res = Nconfig.map((item: any) => {
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
      systemConfigList: _res,
    };
    if (res && res1) {
      await saveNode(params).then((res) => {
        if (res.resultCode == config.successCode) {
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
      setNConfig(res?.systemConfigList);
      let obj: any = {};
      res?.systemConfigList?.forEach((item: any) => {
        obj[item.configKey] = item.configValue;
      });

      form.setFieldsValue(res?.highConfig);
      form2.setFieldsValue({ systemConfigList: { ...obj } });
    });
  };

  useEffect(() => {
    setDrawType('');
    _getNodesConfig();
    getLabelList(info.id); // 获取话术标签
    getFlowList(info.id); // 获取业务流程列表
    getWishList(info.id); // 意图列表
    getWordSlotList(info.id); // 词槽列表
    getMessageList(info.id); // 短信
    getGlobalValConfig(info.id); // 获取全局变量列表
  }, []);

  const tipWishClearConfig = (title: any) => {
    if (title == '阈值') {
      return '当意图识别返回的结果得分低于阈值时，触发拒识，表示机器人没理解客户的问题。阈值的调整需要不断测试，过高可能导致机器人什么都听不懂，过低可能导致客户随便输入什么都有回复内容。';
    }
    if (title == '得分差值') {
      return (
        <>
          当意图识别返回的结果得分大于“阈值”，且大于阈值的候选项有多个，且候选项之间的差值小于“差值”时，触发澄清，即机器人无法确定客户具体的意图。例如，配置“忘记登录密码”和“忘记交易密码”两个意图，当客户询问“忘记密码”，通过配置差值可以实现“请问您想咨询的是{' '}
          <span style={{ color: 'red' }}> 忘记登录密码</span>还是
          <span style={{ color: 'red' }}>忘记交易密码</span>？”的效果。
        </>
      );
    }
  };

  return (
    <div className={style['machine-page']}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form form={form}>
          <HighConfig
            form={form}
            bussinessList={flowList}
            type={'config'}
            config={Nconfig}
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

            {Nconfig?.map((item: any) => {
              return (
                <FormItem label={item.configName} key={item.configName}>
                  <Space align="baseline">
                    <FormItem
                      // {...col}
                      noStyle
                      name={['systemConfigList', item.configKey]}
                      key={'systemConfigList' + item.configKey}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: 200 }}
                        min={0}
                        max={1}
                        step="0.01"
                        precision={2}
                      />
                    </FormItem>
                    <Tip title={tipWishClearConfig(item.configName)} />
                  </Space>
                </FormItem>
              );
            })}
          </div>
        </Form>
        <Button
          type="primary"
          onClick={submit}
          style={{ alignSelf: 'flex-end' }}
          loading={configLoading}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default NodeConfig;
