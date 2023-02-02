import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from '../drawer/style.less';
import { useModel } from 'umi';

import { useNodeOpsModel } from '../model';
import RulesConfig from '../drawerV2/child/rule-config';

const { Item: FormItem } = Form;
const { TextArea } = Input;
import config from '@/config/index';
import { processRequest, parserBody } from './formate';
import ShuntConfig from '../drawerV2/child/shunt-config';
import Condition from '@/components/Condition';

const EdgeDrawerForm = (props: any) => {
  const { cref, confirm, type, wishList, wordSlotList } = props;

  const [form] = Form.useForm();

  // const [form2] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const recordInfo = useRef<any>({});

  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      form.resetFields();
      console.log('info:-----');
      info = parserBody(info);
      console.log(info);
      if (!info?.ruleSwitch && !info?.shuntSwitch) {
        info.ruleSwitch = 1;
      }
      form.setFieldsValue({
        ...info,
        priority: info.level || 1,
      });
      setVisible(true);
    },
    close: onClose,
  }));

  const { saveLine: _saveLine } = useNodeOpsModel();

  const saveLine = async () => {
    // console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => false);

    if (res === false) {
      return;
    } else {
      res = processRequest(res);
      console.log(res);

      if (res?.shuntSwitch) {
        //必须勾选一个做兜底
        let flag = res?.lineShuntInfoList?.some((item: any) => {
          return item.pocketBottom == 1;
        });
        if (!flag) {
          message.warning('请在分流配置-分流配比勾选一条线做兜底');
          return;
        }
        let num = res?.lineShuntInfoList?.reduce((pre: any, val: any) => {
          return pre + (val?.shuntProportion || 0);
        }, 0);
        if (num != 100) {
          message.warning('分流配置-分流配比总和必须等于100%');
          return;
        }
      }

      let result: any = await _saveLine({
        ...preParams,
        ...res,
        id: recordInfo.current.info?.id,
        frontId: recordInfo.current.info?.frontId,
        source: recordInfo.current.info?.source,
        target: recordInfo.current.info?.target,
        frontTarget: recordInfo.current.info?.frontTarget,
        frontSource: recordInfo.current.info?.frontSource,
        sourceAnchor: recordInfo.current.info?.sourceAnchor,
        targetAnchor: recordInfo.current.info?.targetAnchor,
        targetType: recordInfo.current.info?.targetType,
        sourceType: recordInfo.current.info?.sourceType,
      });
      let label;
      if (res?.name?.length > 10) {
        label = res?.name.slice(0, 10) + '...';
      }
      label = `${res.priority}.${label || res?.name}`;

      if (result !== false) {
        recordInfo.current?.callback?.(
          {
            label,
            _name: res?.name,
            level: res.priority || 1,
          },
          result?.data?.id,
        ); // 成功回调修改名称
        onClose();
      }
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveLine}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title="连线配置"
      width={800}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 40 }}
      footer={footer}
      destroyOnClose
    >
      <Form form={form}>
        <div className={styles['antd-form']}>
          <FormItem
            rules={[
              { required: true, message: '请输入连线名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="name"
            label="连线名称"
            style={{ width: '400px' }}
          >
            <Input placeholder="请输入连线名称" maxLength={200} autoComplete="off" />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请输入优先级' }]}
            name="priority"
            label="优先级"
            style={{ width: '400px' }}
          >
            <InputNumber
              placeholder="请输入优先级"
              precision={0}
              min={1}
              max={999}
              style={{ width: '140px' }}
            />
          </FormItem>
        </div>

        <RulesConfig
          form={form}
          title={'规则配置: '}
          formName={'ruleList'}
          type="edge"
          wishList={wishList || []}
          wordSlotList={wordSlotList || []}
          lineShuntNum={recordInfo?.current?.info?.lineShuntInfoList?.length}
        />

        <Condition r-if={config.robotTypeMap[info.robotType] == '语音'}>
          <ShuntConfig
            form={form}
            lineShuntNum={recordInfo?.current?.info?.lineShuntInfoList?.length}
          />
        </Condition>
      </Form>
    </Drawer>
  );
};

export default EdgeDrawerForm;
