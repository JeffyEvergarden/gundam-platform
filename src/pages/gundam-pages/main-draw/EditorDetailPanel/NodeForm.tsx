import React, { useState } from 'react';
import { Card, Input, Select, Form, Button } from 'antd';
import { withPropsAPI } from 'gg-editor';
import { SettingOutlined } from '@ant-design/icons';
import style from './index.less';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { useNodeOpsModel } from '../model';
import { processType } from '../model/const';
import eventbus from '../flow/utils/eventbus';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;

const formatStr = (str: string) => {
  switch (str) {
    case 'node':
      return '节点';
    case 'edge':
      return '连线';
  }
  return '';
};

type DetailFormProps = {
  type: string;
  propsAPI?: any;
  openSetting?: any;
};

const NodeForm: React.FC<DetailFormProps> = (props: DetailFormProps) => {
  const { propsAPI, openSetting, type } = props;

  const [form] = Form.useForm();

  const [num, setNum] = useState<any>(0);

  const item = propsAPI.getSelected()[0];

  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };

  const { updateNode, loading } = useNodeOpsModel();

  const _type: any = item?.getModel()?._nodetype; // start / normal / business

  const _openSetting = () => {
    const model: any = item?.getModel();
    openSetting?.(model);
  };

  const refresh = () => {
    console.log('更新');
    setNum(num + 1);
  };

  // 保存修改节点
  const _save = async () => {
    const model: any = item?.getModel() || {};
    let valueObj: any = await form.validateFields().catch((e) => false);
    if (!valueObj) {
      return;
    }
    let params: any = {
      ...preParams,
      id: model._id || undefined, // 后端id,
      nodeType: processType(model._nodetype),
      nodeName: valueObj.label, // 节点名称
      name: valueObj.label,
      x: model.x, // 节点位置 横坐标
      y: model.y, // 节点位置 纵坐标
    };
    console.log(type);
    if (type === 'node') {
      // 节点做名称更新
      let res: any = await updateNode(params);
      if (res !== false) {
        propsAPI.update(model.id, {
          label: valueObj.label,
        });
      }
    } else {
      // 线的话不做保存限制
      propsAPI.update(model.id, {
        _name: valueObj.label,
        label: `${model.level || 1}.${valueObj.label}`,
      });
    }
  };

  // const getNodeConfig = async (node: any) => {};

  useEffect(() => {
    eventbus.$on('refresh', refresh); // 监听添加节点
    return () => {
      eventbus.$off('refresh', refresh);
    };
  }, []);

  useEffect(() => {
    const model: any = item?.getModel();
    console.log('item:', model);
    if (type === 'node') {
      form.setFieldsValue({
        label: model?.label || '',
      });
    } else {
      form.setFieldsValue({
        label: model?._name || model?.label || '',
      });
    }
  }, [item, num]);

  return (
    <Card type="inner" size="small" title={formatStr(type)} bordered={false}>
      <Form form={form}>
        <Item label={`${formatStr(type)}名称`} name="label">
          <Input placeholder={`请输入${formatStr(type)}名称`} autoComplete="off" />
        </Item>

        <div className={style['button-box']}>
          <Button type="primary" shape="round" size="small" onClick={_save} loading={loading}>
            保存
          </Button>

          <Button icon={<SettingOutlined />} type="link" onClick={_openSetting}>
            详细配置
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default withPropsAPI(NodeForm as any);
