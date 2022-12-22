import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { Checkbox, Form, Input, Modal, Radio, Select, Space } from 'antd';
import { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import ActionConfig from '../child/action-config';
import ConversationConfig from '../child/conversation-config';
import styles from '../style.less';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const WordSlotModal: React.FC<any> = (props: any) => {
  const { cref, confirm, list } = props;

  const { businessFlowId, drawType } = useModel('gundam' as any, (model: any) => {
    return {
      businessFlowId: model.businessFlowId,
      drawType: model.drawType, // 画布类型
    };
  });
  const { flowList } = useModel('drawer' as any, (model: any) => ({
    flowList: model._originFlowList || [],
  }));

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [show, setShow] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: (obj: any) => {
      console.log(drawType);

      if (!obj.slotId) {
        form.resetFields();
        form.setFieldsValue({
          required: true,
        });
        // form.setFieldsValue({
        // required: false,
        // });
        setShow(true);
      } else {
        obj = obj || {};
        form.resetFields();
        form.setFieldsValue({
          ...obj,
          config: {
            action: obj?.action || {},
            messageList: obj?.messageList || [],
          },
          required: obj.required === 1,
        });
        setShow(obj.required === 1);
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = async () => {
    try {
      const formValue: any = await form.validateFields();
      console.log(formValue);
      const slotId = formValue['slotId'];
      const curItem = list.find((item: any) => {
        return item.id === slotId;
      });

      console.log(formValue);
      // 表单配置
      const newForm: any = {
        ...formValue,
        ...formValue.config,
        required: formValue.required ? 1 : 0,
      };
      delete newForm.config;

      const newFormValue: any = {
        ...newForm,
        slot: curItem?.slot,
        slotName: curItem?.slotName,
        slotDesc: curItem?.slotDesc,
        slotSource: curItem?.slotSource,
      };

      confirm?.(newFormValue);
      setVisible(false);
    } catch (e) {}
  };

  const onChange = (val: any) => {
    setShow(val.target.checked);
  };

  return (
    <Modal
      width={800}
      title={'选择词槽'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={'确定'}
      onOk={submit}
    >
      <div className={styles['antd-form']}>
        <Form form={form}>
          <FormItem label="词槽名称">
            <Space align={'baseline'}>
              <FormItem rules={[{ required: true, message: '请选择词槽' }]} name="slotId" noStyle>
                <Select placeholder="请选择词槽名称" style={{ width: '220px' }}>
                  {list?.map((item: any, index: number) => {
                    if (
                      flowList?.find((f: any) => f?.id == businessFlowId)?.flowName == '知识问答' &&
                      drawType == 'business'
                    ) {
                      console.log('图谱');

                      if (item.slotSource == 9) {
                        return (
                          <Option key={index} value={item.id} opt={item}>
                            {item.label}
                          </Option>
                        );
                      }
                    } else {
                      if (item.slotSource != 9) {
                        return (
                          <Option key={index} value={item.id} opt={item}>
                            {item.label}
                          </Option>
                        );
                      }
                    }
                  })}
                </Select>
              </FormItem>
              <Tip title={'选择”词槽管理“中提前配置的词槽，词槽将会在当前节点尝试填充。'} />
            </Space>
          </FormItem>
          <FormItem label="词槽是否必填">
            <Space align={'baseline'}>
              <FormItem
                name="required"
                noStyle
                valuePropName="checked"
                // style={{ width: '400px' }}
                rules={[{ required: true, message: '请选择词槽' }]}
                initialValue={true}
              >
                <Checkbox onChange={onChange}>必填</Checkbox>
              </FormItem>

              <Tip
                title={
                  '必填词槽如果在当前节点没有填充，则会使用“澄清话术”进行询问，客户回复时尝试将客户文本进行填槽操作；如果填槽失败则使用下一条“澄清话术”进行询问；若词槽在之前已填充，则跳过当前词槽不进行询问。非必填词槽不会主动询问。'
                }
              />
            </Space>
          </FormItem>
          <FormItem label="生命周期">
            <Space align={'baseline'}>
              <FormItem
                name="lifeCycle"
                noStyle
                // style={{ width: '400px' }}
                rules={[{ required: true, message: '请选择' }]}
                initialValue={'dialogue'}
              >
                <Radio.Group>
                  <Radio value={'dialogue'}>整轮对话有效</Radio>
                  <Radio value={'node'}>节点跳转后清空</Radio>
                  <Radio value={'flow'}>流程跳转后清空</Radio>
                </Radio.Group>
              </FormItem>

              <Tip
                title={
                  '“整轮对话有效”表示词槽的值在整通对话中均可使用；“节点跳转后清空”表示流程进入下一节点时当前词槽清空；“流程跳转后情况”表示流程跳出当前流程时当前词槽清空。'
                }
              />
            </Space>
          </FormItem>
          <FormItem label="词槽是否预填充">
            <Space align={'baseline'}>
              <FormItem
                name="preFill"
                noStyle
                // style={{ width: '400px' }}
                rules={[{ required: true, message: '请选择' }]}
                initialValue={1}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </FormItem>

              <Tip
                title={
                  <>
                    {' '}
                    当配置”是“，流程在当前词槽的上一个节点时会尝试填充当前词槽，当流程流转至当前词槽时则不需要再次询问。
                    <br />
                    例如，当前节点配置了“城市”词槽，在上一个节点客户描述“我想订一张去北京的机票”时，可以将“目的地”词槽填充为“北京”，此时词槽已填充则不再询问客户的目的地。
                  </>
                }
              />
            </Space>
          </FormItem>

          <Condition r-if={show}>
            <div style={{ paddingTop: '8px' }}>
              <ConversationConfig
                form={form}
                name={'clearList'}
                title="澄清话术"
                placeholder="话术"
                required={true}
                formName={'clearList'}
              />
            </div>
            <Condition r-if={config.robotTypeMap[info?.robotType] === '文本'}>
              <div style={{ paddingTop: '8px' }}>
                <ConversationConfig
                  form={form}
                  name={'selectButtonList'}
                  title="按钮选项"
                  placeholder="内容"
                  required={true}
                  formName={'selectButtonList'}
                  showLabel={false}
                />
              </div>
            </Condition>
          </Condition>
          <div style={{ paddingTop: '8px' }}>
            <ActionConfig
              form={form}
              title={
                <>
                  {'执行动作'}
                  <Tip
                    title={
                      '当必填词槽澄清次数达到配置的次数，仍未填充成功时，触发执行动作，可跳转特定业务流程、转人工、转IVR及发短信。'
                    }
                  />
                </>
              }
              formName={'config'}
              name={'config'}
              titleType={2}
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default WordSlotModal;
