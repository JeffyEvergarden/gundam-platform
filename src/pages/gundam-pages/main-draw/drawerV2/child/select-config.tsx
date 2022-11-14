import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from './style.less';

import { useModel } from 'umi';
import ActionConfig from './action-config';
import ConversationConfig from './conversation-config';

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
    console.log(type);

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
      <div className={styles['title']}>选择配置</div>
      <div style={{ paddingTop: '8px' }}>
        <ConversationConfig
          form={form}
          name={'questionList'}
          title="询问话术"
          placeholder="话术"
          required={true}
          formName={'questionList'}
        />
      </div>
      <div style={{ paddingTop: '8px' }}>
        <ConversationConfig
          form={form}
          name={'selectList'}
          title="选择内容"
          placeholder="内容"
          required={true}
          formName={'selectList'}
          showLabel={false}
        />
      </div>
      获取选择结果
      <div style={{ paddingTop: '8px' }}>
        <ActionConfig
          form={form}
          title={'执行动作'}
          formName={'config'}
          name={'config'}
          titleType={2}
        />
      </div>
    </>
  );
};

export default HighConfig;
