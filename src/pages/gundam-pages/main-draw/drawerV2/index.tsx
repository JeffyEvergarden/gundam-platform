//版本2
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useNodeOpsModel } from '../model';
import ActionConfig from './child/action-config';
import ConversationConfig from './child/conversation-config';
import HighConfig from './child/high-config';
import RuleConfig from './child/rule-config';
import { parserBody, processRequest } from './formate';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

import WordSlotTable from './components/wordslot-table-select';

const DrawerForm = (props: any) => {
  const { cref, type, wishList, wordSlotList } = props;

  const [autoCloseTipsFlag, setAutoCloseTipsFlag] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [nodetype, setNodetype] = useState<string>('');

  const { info, businessFlowId } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    businessFlowId: model.businessFlowId,
  }));

  const { flowList, selectBody } = useModel('drawer' as any, (model: any) => ({
    flowList: model._flowList, // 业务流程列表
    selectBody: model.selectBody,
  }));

  useEffect(() => {
    console.log('flowList:');
    console.log(flowList);
  }, []);

  // 前置参数
  const preParams: any = {
    robotId: info.id, // 机器人id,
    flowId: type === 'main' ? info.flowId : businessFlowId, //流程id
  };
  const recordInfo = useRef<any>({});

  const { saveNode: _saveNode } = useNodeOpsModel();

  const onValuesChange = () => {
    setAutoCloseTipsFlag(true);
  };

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

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      // console.log(info);
      setAutoCloseTipsFlag(false);
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      setNodetype(info._nodetype || 'normal');
      const _info: any = parserBody(info.config);
      console.log(_info);

      form.resetFields();
      form.setFieldsValue({
        ..._info,
        name: _info.nodeName || info.name,
      });
      form2.setFieldsValue(_info?.highConfig);

      setVisible(true);
    },
    close: onClose,
  }));

  // 保存节点
  const saveNode = async () => {
    // console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });

    let res2: any = await form2.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });

    if (res === false || res2 === false) {
      return;
    } else {
      let body: any = processRequest(res, res2);
      let result: any = await _saveNode({
        ...body,
        nodeName: res.name,
        ...preParams,
        id: recordInfo.current.info?.id,
        nodeType: recordInfo.current.info?.nodeType,
      });
      if (result === true) {
        setAutoCloseTipsFlag(false);
        recordInfo.current?.callback?.(res?.name); // 成功回调修改名称
        setVisible(false);
      }
    }
  };

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
      title="节点配置"
      width={850}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      <div ref={selectBody}>
        <Form form={form} onValuesChange={onValuesChange}>
          {/* 基础信息 */}
          <div className={styles['antd-form']}>
            <div className={styles['title']} style={{ marginTop: 0 }}>
              基本信息
            </div>
            <FormItem
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
            </FormItem>
            <FormItem
              // rules={[{ required: true, message: '请输入节点描述' }]}
              name="nodeDesc"
              label="节点描述"
              style={{ width: '400px' }}
            >
              <TextArea rows={4} placeholder="请输入节点描述" maxLength={150} />
            </FormItem>
          </div>

          <div className={styles['antd-form']}>
            {/* 词槽 */}
            <FormItem name="nodeSlots">
              <WordSlotTable list={wordSlotList} />
            </FormItem>

            {/* 回应策略 */}
            <FormList name="strategyList">
              {(outFields, { add: _add, remove: _remove }) => {
                const addOutNew = () => {
                  // console.log(fields);
                  let length = outFields.length;
                  _add(
                    {
                      ruleList: [],
                    },
                    length,
                  );
                };

                return (
                  <div>
                    <div className={styles['zy-row']}>
                      <div className={styles['title']}>对话回应</div>
                      <Button
                        type="link"
                        icon={<AppstoreAddOutlined />}
                        style={{ marginLeft: '10px' }}
                        onClick={addOutNew}
                      >
                        新增回应策略
                      </Button>
                    </div>
                    <div>
                      {outFields.map((outFields: any, i: number) => {
                        return (
                          <div key={outFields.key} className={styles['module-box']}>
                            <div style={{ paddingLeft: '12px' }}>
                              <div className={styles['zy-row']} style={{ paddingBottom: '6px' }}>
                                <span
                                  className={styles['del-bt']}
                                  onClick={() => {
                                    _remove(i);
                                  }}
                                >
                                  <MinusCircleOutlined />
                                </span>
                                <div className={styles['num-circle']}>{i + 1}</div>
                                <span className={styles['title_sec']}>回应策略</span>
                              </div>

                              <div style={{ paddingLeft: '16px', paddingTop: '8px' }}>
                                {/* 规则组 */}
                                <div>
                                  <RuleConfig
                                    form={form}
                                    formName={['strategyList', i, 'ruleList']}
                                    name={[outFields.name, 'ruleList']}
                                    type="node"
                                    wishList={wishList || []}
                                    wordSlotList={wordSlotList || []}
                                  />
                                </div>

                                {/* 内容组 */}
                                <div style={{ paddingTop: '8px' }}>
                                  <ConversationConfig
                                    form={form}
                                    name={[outFields.name, 'conversationList']}
                                    formName={'strategyList'}
                                    deep={true}
                                  />
                                </div>

                                {/* 动作组 */}
                                <div style={{ paddingTop: '8px' }}>
                                  <ActionConfig
                                    name={outFields.name}
                                    form={form}
                                    formName={['strategyList', i]}
                                    deep={false}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            </FormList>
          </div>
        </Form>

        <Form form={form2} onValuesChange={onValuesChange}>
          {/* 高级配置 */}
          <HighConfig form={form2} bussinessList={flowList} type={'flow'} />
        </Form>
      </div>
    </Drawer>
  );
};

export default DrawerForm;
