import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from '../drawer/style.less';
import { useModel } from 'umi';

import { useNodeOpsModel } from '../model';
import RulesConfig from '../drawerV2/child/rule-config';

const { Item: FormItem } = Form;
const { TextArea } = Input;
import config from '@/config';
import { processRequest, parserBody } from './formate';

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
      // console.log(info);
      info = parserBody(info);
      form.setFieldsValue({
        ...info,
        level: info.level || 1,
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
      let label = `${res.level}.${res?.name}`;
      if (result !== false) {
        recordInfo.current?.callback?.(
          {
            label,
            _name: res?.name,
            level: res.level || 1,
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
            <Input placeholder="请输入连线名称" maxLength={10} autoComplete="off" />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请输入优先级' }]}
            name="level"
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
        />
      </Form>
    </Drawer>
  );
};

export default EdgeDrawerForm;
