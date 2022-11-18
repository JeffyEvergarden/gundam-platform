import Condition from '@/components/Condition';
import { CaretUpOutlined, SettingOutlined } from '@ant-design/icons';
import { Form, Radio, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import HightformTemplate from './high-inner-config';
import styles from './style.less';

import Tip from '@/components/Tip';
import { useModel } from 'umi';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HighConfig = (props: any) => {
  const { form, wishList, bussinessList, type, config } = props;

  const { nodeConfig, flowList, originFlowList } = useModel('drawer' as any, (model: any) => ({
    nodeConfig: model._globalNodeList,
    flowList: model._flowList,
    originFlowList: model._originFlowList,
  }));
  const { info, drawType, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
    drawType: model.drawType, // 画布类型
  }));

  const [flag, setFlag] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);

  const onChange = (val: any) => {
    console.log(nodeConfig);
    let res = form.getFieldsValue();
    if (res.configType == 1) {
      res.allowFlows = nodeConfig?.highConfig?.allowFlows;
      setDisabled(true);
      form.setFieldsValue(res);
    } else if (res.configType == 2) {
      res.allowFlows = undefined;
      form.setFieldsValue(res);
      setDisabled(false);
    }
  };

  useEffect(() => {
    console.log(info);

    console.log(config);
    let res = form.getFieldsValue();

    if (res.configType == 1) {
      res.allowFlows = nodeConfig?.highConfig?.allowFlows;
      setDisabled(true);
      form.setFieldsValue(res);
    }
  }, []);

  const _flowdisabled = drawType === 'business';

  return (
    <>
      <Condition r-if={type == 'flow'}>
        <div>
          <div
            className={styles['title']}
            onClick={() => {
              setFlag(!flag);
            }}
          >
            高级配置
            <Tip title={'默认使用全局配置-节点配置的配置项，可切换自定义配置'} />
            <span style={{ color: '#1890ff', marginLeft: '24px', fontSize: '16px' }}>
              {!flag && <SettingOutlined />}
              {flag && <CaretUpOutlined />}
            </span>
          </div>
        </div>
      </Condition>

      <Condition r-show={flag || type == 'config'}>
        <div className={styles['antd-form']}>
          <Space align="baseline">
            <div
              className={styles['title_sp']}
              style={{ marginRight: '16px', marginBottom: '20px' }}
            >
              流程跳转
              <Tip
                title={
                  '当客户意图为允许跳转的业务流程，则跳转至对应的业务流程，判断优先级比节点后的连线条件高。'
                }
              />
            </div>
            <Condition r-if={type == 'flow'}>
              <Form.Item name="configType" initialValue={1}>
                <Radio.Group size="small" onChange={onChange}>
                  <Radio value={1}>默认配置</Radio>
                  <Radio value={2}>自定义配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Condition>
          </Space>
          <FormItem name="allowFlows" label="允许跳转至业务流程" style={{ width: '400px' }}>
            <Select
              placeholder="请选择允许跳转至业务流程"
              mode="multiple"
              disabled={disabled}
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              {originFlowList
                .filter?.((item: any) => {
                  return item.headIntent;
                })
                .map((item: any, index: number) => {
                  return (
                    <Option
                      key={index}
                      value={item.name}
                      opt={item}
                      disabled={_flowdisabled && item.name === businessFlowId}
                    >
                      {item.label}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </div>
        {/*文本不需要这两个  0文本 1语音 */}
        <Condition r-if={info?.robotType == 1}>
          <HightformTemplate form={form} name="silenceAction" title={'静默'} type={type} />
        </Condition>

        <HightformTemplate form={form} name="rejectAction" title={'拒识'} type={type} />

        <HightformTemplate form={form} name="clearAction" title={'澄清'} type={type} />

        {/*文本不需要这两个  0文本 1语音 */}
        <Condition r-if={info?.robotType == 1}>
          <HightformTemplate form={form} name="unclearAction" title={'客户未听清'} type={type} />
        </Condition>
      </Condition>
    </>
  );
};

export default HighConfig;
