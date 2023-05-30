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

import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import SelectConfig from './child/select-config';
import WordslotOperationModal from './components/wordslot-operation-modal';
import WordSlotTable from './components/wordslot-table-select';

const DrawerForm = (props: any) => {
  const { cref, type, wishList, wordSlotList, getWordSlotList } = props;

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
      console.log(info);
      setAutoCloseTipsFlag(false);
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      setNodetype(info._nodetype || 'normal');
      if (info._nodetype == 'operation') {
        form.setFieldsValue({
          ...info?.config,
          name: info.nodeName || info.name,
          operations: info?.config?.operations?.length ? info?.config?.operations : [{}],
        });
      } else {
        const _info: any = parserBody(info.config);
        console.log(_info);

        form.resetFields();
        form.setFieldsValue({
          ..._info,
          name: _info.nodeName || info.name,
        });
        form2.setFieldsValue(_info?.highConfig);
      }

      setVisible(true);
    },
    close: onClose,
  }));

  // 保存节点
  const saveNode = async () => {
    console.log(form.getFieldsValue());
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });

    let res2: any = await form2?.validateFields?.()?.catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });

    console.log(res);

    if (nodetype == 'operation') {
      if (res === false) {
        return;
      } else {
        let result: any = await _saveNode({
          ...res,
          nodeName: res.name,
          ...preParams,
          id: recordInfo.current.info?.id,
          nodeType: recordInfo.current.info?.nodeType,
        });

        let label;
        if (res?.name?.length > 10) {
          label = res?.name.slice(0, 10) + '...';
        } else {
          label = res?.name;
        }

        if (result === true) {
          setAutoCloseTipsFlag(false);
          recordInfo.current?.callback?.({ label, _name: res?.name }); // 成功回调修改名称
          setVisible(false);
        }
      }
    } else {
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

        let label;
        if (res?.name?.length > 10) {
          label = res?.name.slice(0, 10) + '...';
        } else {
          label = res?.name;
        }

        if (result === true) {
          setAutoCloseTipsFlag(false);
          recordInfo.current?.callback?.({ label, _name: res?.name }); // 成功回调修改名称
          setVisible(false);
        }
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
            <Condition r-if={nodetype != 'operation' && nodetype != 'select'}>
              <FormItem
                // rules={[{ required: true, message: '请输入节点描述' }]}
                name="nodeDesc"
                label="节点描述"
                style={{ width: '400px' }}
              >
                <TextArea rows={4} placeholder="请输入节点描述" maxLength={150} />
              </FormItem>
            </Condition>
          </div>

          {/* 运算节点 */}
          <Condition r-if={nodetype == 'operation'}>
            <WordslotOperationModal
              name="operations"
              form={form}
              title="词槽变量运算"
              wordSlotList={wordSlotList}
            />
          </Condition>

          <Condition r-if={nodetype != 'operation' && nodetype != 'select'}>
            <div className={styles['antd-form']}>
              {/* 词槽 */}
              <FormItem name="nodeSlots">
                <WordSlotTable list={wordSlotList} getList={getWordSlotList} />
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
                                  <span className={styles['title_sec']}>
                                    回应策略
                                    <Tip
                                      title={
                                        '一个节点内可以配置多个回应策略，对话时从上至下判断回应策略的规则，满足时返回客户对应的话术。'
                                      }
                                    />
                                  </span>
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
          </Condition>

          <Condition r-if={nodetype == 'select'}>
            <SelectConfig form={form} type={'select'} wordSlotList={wordSlotList} />
          </Condition>
        </Form>

        <Condition r-if={nodetype != 'operation'}>
          <Form form={form2} onValuesChange={onValuesChange}>
            {/* 高级配置 */}
            <HighConfig form={form2} bussinessList={flowList} type={'flow'} />
          </Form>
        </Condition>
      </div>
    </Drawer>
  );
};

export default DrawerForm;
