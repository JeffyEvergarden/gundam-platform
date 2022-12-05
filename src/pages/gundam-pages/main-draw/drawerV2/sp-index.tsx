import { Button, Drawer, Form, Input, message, Modal, Select } from 'antd';
import { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from './style.less';

import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { useEffect } from 'react';
import { useNodeOpsModel } from '../model';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref, type } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [autoCloseTipsFlag, setAutoCloseTipsFlag] = useState<boolean>(false);
  const onValuesChange = () => {
    setAutoCloseTipsFlag(true);
  };

  const [nodetype, setNodetype] = useState<string>('');

  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  const { flowList, wishList } = useModel('drawer' as any, (model: any) => ({
    flowList: model._originFlowList, // 业务流程列表
    wishList: model._wishList,
  }));

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };
  const recordInfo = useRef<any>({});

  const { saveNode: _saveNode } = useNodeOpsModel();

  const onClose = () => {
    if (autoCloseTipsFlag) {
      Modal.confirm({
        title: '温馨提示',
        content: '已对内容进行修改,若不保存将丢失编辑信息',
        onOk: () => {
          setVisible(false);
        },
      });
    } else {
      setVisible(false);
    }
  };

  const onChange = (val: any, opt: any) => {
    console.log(opt);
    let headIntent: any = opt?.opt.headIntent || '';
    form.setFieldsValue({
      headIntent: headIntent,
    });
  };

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      console.log(info);
      setAutoCloseTipsFlag(false);
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      setNodetype(info._nodetype || 'normal');
      const config: any = info.config || {};
      let nodeFlowId: any = config.nodeFlowId;
      let headIntent: any =
        flowList.find((item: any) => {
          return item.name === nodeFlowId;
        })?.headIntent || '';
      form.resetFields();
      form.setFieldsValue({
        ...config,
        headIntent: headIntent || undefined,
        name: config.nodeName || info.name,
      });
      setVisible(true);
    },
    close: onClose,
  }));

  const saveNode = async () => {
    // console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (res === false) {
      return;
    } else {
      const businessName: any = flowList.find((item: any) => {
        return res.nodeFlowId === item.name;
      })?.label;

      const wishName: any =
        wishList.find((item: any) => {
          return res.headIntent === item.name;
        })?.label || res.headIntent;
      let name, label;
      if (nodetype == 'business') {
        name =
          (businessName ? '流程:' + businessName : '业务流程节点') +
          (wishName ? '\n' + '意图:' + wishName : '');
        label =
          (businessName
            ? '流程:' +
              (businessName.length > 10 ? businessName.slice(0, 10) + '...' : businessName)
            : '业务流程节点') +
          (wishName
            ? '\n' + '意图:' + (wishName.length > 10 ? wishName.slice(0, 10) + '...' : wishName)
            : '');
      } else {
        name = recordInfo.current.info?.name || '转人工排队';
      }

      let result: any = await _saveNode({
        ...res,
        name,
        nodeName: name,
        ...preParams,
        id: recordInfo.current.info?.id,
        nodeType: recordInfo.current.info?.nodeType,
      });
      if (result === true) {
        setAutoCloseTipsFlag(false);
        recordInfo.current?.callback?.({ label: label || name, _name: name }); // 成功回调修改名称
        setVisible(false);
      }
    }
  };

  useEffect(() => {}, []);

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveNode}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title={
        <>
          {'节点配置'}
          <Tip
            title={
              <>
                用于配置节点的处理逻辑，包括关联词槽、对话回应、高级配置模块。首先会执行{' '}
                <b>关联词槽</b> ，主动询问客户词槽相关信息，关联词槽可能会有产生多轮对话。然后执行{' '}
                <b> 对话回应</b>，根据规则拿到回复话术及动作（包括跳转动作和发送短信）。
                <br />
                如果一个节点既没有词槽配置、也没有对话回应，代表这个节点没有意义，发布时会失败。
                <br />
                如果经过一个节点仍然没拿到回复话术，例如配置的词槽是来自于接口（这种情况会调接口填槽，没有话术），流程会根据后续的连线继续往后进入下一个节点，直至拿到响应文本，结束一次请求。
                <br />
                高级配置用于配置一些特殊情况时的跳转及回复，例如拒识、客户未听清等。
              </>
            }
          />
        </>
      }
      width={1000}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <div className={styles['antd-form']}>
          <div className={styles['title']} style={{ marginTop: 0 }}>
            基本信息
          </div>
          {/* <FormItem
            rules={[
              { required: true, message: '请输入节点名称' },
              {
                pattern: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/g,
                message: '请输入汉字、字母、下划线、数字、横杠',
              },
            ]}
            name="name"
            label="节点名称"
            style={{ width: '400px' }}
          >
            <Input
              placeholder="请输入节点名称"
              maxLength={150}
              disabled={nodetype === 'start'}
              autoComplete="off"
            />
          </FormItem> */}

          {/* 业务节点 */}
          <Condition r-if={nodetype === 'business'}>
            <div className={styles['antd-form']}>
              <FormItem
                label="业务流程"
                name="nodeFlowId"
                style={{ width: '400px' }}
                rules={[{ required: true, message: '请选择业务流程' }]}
              >
                <Select placeholder="请选择业务流程" onChange={onChange}>
                  {flowList.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>

              <FormItem label="意图名称" name="headIntent" style={{ width: '400px' }}>
                <Select placeholder="请选择意图名称" disabled={true}>
                  {wishList.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </div>
          </Condition>

          <FormItem
            // rules={[{ required: true, message: '请输入节点描述' }]}
            name="nodeDesc"
            label="节点描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入节点描述" maxLength={150} />
          </FormItem>

          <Condition r-if={nodetype === 'sp_business'}>
            <FormItem
              name="agentGroup"
              label="坐席技能组"
              style={{ width: '400px' }}
              rules={[{ required: true, message: '请输入坐席技能组' }]}
            >
              <Input placeholder="请输入坐席技能组"></Input>
            </FormItem>
          </Condition>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
