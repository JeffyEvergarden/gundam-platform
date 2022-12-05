import { Form, Input, Select, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styles from './style.less';

import { useModel } from 'umi';
import ActionConfig from './action-config';
import ConversationConfig from './conversation-config';
import { VALUE_TYPE_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const SelectConfig = (props: any) => {
  const { form, wishList, bussinessList, type, config, wordSlotList } = props;

  const dataType = Form.useWatch(['selectResult', 'typeOne'], form);

  // const { nodeConfig, flowList, originFlowList } = useModel('drawer' as any, (model: any) => ({
  //   nodeConfig: model._globalNodeList,
  //   flowList: model._flowList,
  //   originFlowList: model._originFlowList,
  // }));
  const { info, drawType, businessFlowId, globalVarList } = useModel(
    'gundam' as any,
    (model: any) => ({
      info: model.info,
      businessFlowId: model.businessFlowId,
      drawType: model.drawType, // 画布类型
      globalVarList: model.globalVarList || [],
    }),
  );

  const _globalVarList: any[] = useMemo(() => {
    return globalVarList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [globalVarList]);

  const [disabled, setDisabled] = useState<boolean>(false);

  const formatOption = (type: any) => {
    //变量
    if (type == 1) {
      return (
        <Select
          style={{ width: '200px' }}
          placeholder="请选择变量名称"
          // size="small"
          optionFilterProp="children"
          showSearch
          onChange={(val: any, opt: any) => {
            // change(i, index, 2, opt);
          }}
          getPopupContainer={(trigger) => trigger.parentElement}
        >
          {_globalVarList?.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.id} opt={item}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      );
    } else if (type == 2) {
      //词槽
      return (
        <Select
          style={{ width: '200px' }}
          placeholder="请选择词槽名称"
          // size="small"
          optionFilterProp="children"
          showSearch
          onChange={(val: any, opt: any) => {
            // change(i, index, 2, opt);
          }}
          getPopupContainer={(trigger) => trigger.parentElement}
        >
          {wordSlotList?.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.id} opt={item}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      );
    } else {
      //自定义-3
      return (
        <Input
          style={{ width: '200px' }}
          placeholder="请输入"
          maxLength={200}
          autoComplete="off"
          // size="small"
        />
      );
    }
  };

  useEffect(() => {
    // console.log(info);
    // console.log(type);

    // console.log(config);
    // let res = form.getFieldsValue();

    // if (res.configType == 1) {
    //   res.allowFlows = nodeConfig?.highConfig?.allowFlows;
    //   setDisabled(true);
    //   form.setFieldsValue(res);
    // }

    console.log(dataType);
  }, [dataType]);

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

      <div style={{ paddingTop: '8px' }}>
        <div className={styles['title_sp']}> 获取选择结果</div>
        <FormItem name={'selectResult'} label={'赋值给'} style={{ marginLeft: '16px' }}>
          <Space align="baseline">
            <FormItem
              name={['selectResult', 'typeOne']}
              fieldKey={['selectResult', 'typeOne']}
              noStyle
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                style={{ width: '200px' }}
                onChange={(val) => {
                  // typeChange(val, index, 'acceptType');
                  let formData = form.getFieldsValue();
                  let dataRow = formData['selectResult'];
                  dataRow.oneValue = undefined;
                  dataRow['typeOne'] = val;
                  form.setFieldsValue({ ...formData });
                }}
                placeholder="请选择"
              >
                {VALUE_TYPE_LIST.filter((item) => item.name != 3)?.map((item: any, index) => {
                  return (
                    <Option key={item.name} value={item.name}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            <FormItem
              name={['selectResult', 'oneValue']}
              fieldKey={['selectResult', 'oneValue']}
              noStyle
              rules={[{ required: true, message: '请选择' }]}
            >
              {formatOption(dataType)}
            </FormItem>
          </Space>{' '}
        </FormItem>
      </div>

      <div style={{ paddingTop: '8px' }}>
        <ActionConfig
          form={form}
          // title={'执行动作'}
          formName={'config'}
          name={'config'}
          titleType={1}
        />
      </div>
    </>
  );
};

export default SelectConfig;
