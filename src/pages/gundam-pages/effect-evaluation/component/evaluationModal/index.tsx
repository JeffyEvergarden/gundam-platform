import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { Form, InputNumber, Modal, Select, Space, Tooltip } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { useEvaluationModel, useSampleModel } from '../../model';
import style from '../sampleModal/style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const EvaluationModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;

  const { tableList, getList } = useSampleModel();
  const { addEvaluation } = useEvaluationModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const robotTypeMap = config.robotTypeMap;
  const robotType: any = robotTypeMap[info.robotType] || '语音';

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      robotId: info.id,
      ...values,
    };
    await addEvaluation(reqData).then((res) => {
      if (res) {
        refresh();
        close();
      }
    });
  };

  const close = () => {
    form.resetFields();
    setShowTip(false);
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      getList({ page: 1, pageSize: 1000, robotId: info.id });
      setVisible(true);
    },
    close,
    submit,
  }));

  return (
    <Modal
      width={650}
      title={'提交评估'}
      visible={visible}
      onCancel={() => {
        close();
      }}
      okText={'提交'}
      onOk={submit}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '400px' }}>
          <FormItem
            rules={[{ required: true, message: '请选择样本集' }]}
            name="assessSampleId"
            label="样本集"
            style={{ width: '360px' }}
          >
            <Select
              placeholder={'请选择样本集'}
              onChange={(a: any, b: any) => {
                console.log(a, b);
                let list = b?.item?.tagProgress?.split('/');
                if (list?.[0] == list?.[1]) {
                  setShowTip(false);
                } else {
                  setShowTip(true);
                }
              }}
              showSearch
              filterOption={(input, option) =>
                (option?.item?.sampleSetName as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {tableList?.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id} item={item}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip title={item.sampleSetName}>
                        <span className={style['select_left']}>{item.sampleSetName}</span>
                      </Tooltip>

                      <span>{item.tagProgress}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem label="阈值" style={{ width: '360px' }}>
            <Space align="baseline">
              <FormItem
                rules={[{ required: true, message: '请输入阈值' }]}
                name="threshold"
                noStyle
                initialValue={0.9}
              >
                <InputNumber placeholder={'请输入'} min="0" max="1" step="0.01" precision={2} />
              </FormItem>
              <Tip
                title={
                  '控制模型评估时，调用NLU返回的结果类型，低于阈值为“拒识”，高于阈值且只有1个候选为“明确回复”，高于阈值且候选多于1个且差值小于得分差值时触发“澄清”。'
                }
              ></Tip>
            </Space>
          </FormItem>
          <FormItem label="得分差值" style={{ width: '360px' }}>
            <Space align="baseline">
              <FormItem
                rules={[{ required: true, message: '请输入得分差值' }]}
                name="difference"
                noStyle
                initialValue={0.01}
              >
                <InputNumber placeholder={'请输入'} min="0" max="1" step="0.01" precision={2} />
              </FormItem>
              <Tip
                title={
                  '模型评估时，调用NLU返回的结果类型，高于阈值且候选多于1个且差值小于得分差值时触发“澄清”。'
                }
              ></Tip>
            </Space>
          </FormItem>
          <FormItem label="澄清数量" style={{ width: '360px' }}>
            <Space align="baseline">
              <FormItem
                rules={[{ required: true, message: '请输入澄清数量' }]}
                name="clarifyNum"
                noStyle
                initialValue={robotType == '语音' ? 2 : 3}
              >
                <InputNumber
                  placeholder={'请输入'}
                  min={1}
                  max={99}
                  step="1"
                  precision={0}
                  disabled={robotType == '语音'}
                />
              </FormItem>
              <Tip
                title={'控制模型评估时，调用NLU返回的结果控制触发澄清时，选取多少个候选进行澄清。'}
              ></Tip>
            </Space>
          </FormItem>
          <Condition r-if={showTip}>
            <span style={{ color: 'red' }}>
              检测到存在待标注的样本，可能会影响最终的评估结果，建议标注后再进行评估
            </span>
          </Condition>
        </Form>
      </div>
    </Modal>
  );
};

export default EvaluationModal;
