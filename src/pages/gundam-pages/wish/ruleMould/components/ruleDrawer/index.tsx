import React, { useState, Fragment, useEffect } from 'react';
import { Drawer, Button, Space, Form, Input, InputNumber, Select, message, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './../index.less';
import { useRuleModule } from './../../model';

const { Option } = Select;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

export default (props: any) => {
  const { visible, type, tableProps, cancel, save, modalData } = props;
  const [form] = Form.useForm();

  const { slotInfo, getFeatureListAll } = useRuleModule();

  const [slotList, setSlotList] = useState<any>([]);
  const [featureList, setFeatureList] = useState<any>([]);

  const [currTempClipsIndex, setCurrTempClipsIndex] = useState<number>(0);
  const [startPos, setStartPos] = useState<number>(-1);

  useEffect(() => {
    visible &&
      form.setFieldsValue({
        intentRuleName: modalData?.intentRuleName,
        threshold: modalData?.threshold,
        ruleClips: modalData.robotIntentRuleDetailList,
      });
    visible && getSlotList();
    visible && getFeature();
  }, [visible]);

  const getSlotList = async () => {
    let res = await slotInfo({ robotId: tableProps?.robotId });
    setSlotList(res?.data);
  };

  const getFeature = async () => {
    let res = await getFeatureListAll({ intentId: tableProps?.id });
    setFeatureList(res?.data);
  };
  const templateFocus = (key: any, name: any) => {
    let data = form.getFieldValue('ruleClips');
    if (!data?.[key]) {
      data[key] = {
        fragment: '',
      };
      form.setFieldsValue({
        ...data,
      });
    }
    setCurrTempClipsIndex(key);
  };

  const insetWordTemp = (value: any, type: string) => {
    console.log('startPos', startPos);
    const data = form.getFieldValue('ruleClips');
    if (currTempClipsIndex > -1) {
      let newValue = data?.[currTempClipsIndex]?.fragment || '';
      let content = '';
      if (type === 'slot') {
        content = '${' + value + '}';
      }
      if (type === 'feature') {
        content = '%{' + value + '}';
      }
      if (startPos >= -1) {
        let pre = newValue.slice(0, startPos);
        let last = newValue.slice(startPos);
        newValue = pre + content + last;
        if (newValue.length > 200) {
          message.warning(`字符不能超过200个字`);
          newValue = newValue;
        }
      } else {
        newValue = newValue + content;
      }
      if (type === 'feature') {
        data[currTempClipsIndex].fragment = newValue;
        form.setFieldsValue({
          ruleClips: [...data],
        });
      } else if (type === 'slot') {
        let formval = form.getFieldValue('ruleClips');
        let currentVal = formval?.[currTempClipsIndex]?.fragment || '';
        if (!currentVal.includes(content)) {
          data[currTempClipsIndex].fragment = newValue;
          form.setFieldsValue({
            ruleClips: [...data],
          });
        } else {
          message.warning('模版片段已存在该词槽');
        }
      }
    } else {
      message.warning('请先新增并且选择一个规则片段进行插入内容');
    }
  };

  const onClose = () => {
    cancel();
  };

  const submit = async () => {
    const values = await form.validateFields();
    save(values);
  };

  return (
    <Drawer
      visible={visible}
      title={type === 'edit' ? '编辑规则' : '添加规则'}
      onClose={onClose}
      width={850}
      footer={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={submit} type="primary">
            确定
          </Button>
        </Space>
      }
      footerStyle={{ textAlign: 'right' }}
    >
      <Form form={form} {...layout} autoComplete="off" className={styles.ruleDrawer}>
        <span className={styles.ruleName}>
          <Form.Item
            name={'intentRuleName'}
            label={'规则名称'}
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder={'请输入规则名称'} disabled={type === 'edit'} maxLength={200} />
          </Form.Item>
        </span>
        <span className={styles.ruleSome}>
          <Form.Item name={'ruleSome'} label={'规则片段'}>
            <div className={styles.formItem_box}>
              <span className={styles.isNeedText}>必须匹配</span>
              <span className={styles.ruleText}>
                <Space>
                  规则片段
                  <Tooltip title="可插入词槽、特征词、普通文本或者三者的任意组合，每行模板片段不能超过200字">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              </span>
              <span className={styles.sortText}>
                <Space>
                  排序
                  <Tooltip title="序号表示规则片段在用户query中必须遵守从左到右的匹配顺序，同序号模板片段之间无视匹配顺序；0 代表任意位、对应的模板片段可以出现在query中任意位置">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              </span>
            </div>
          </Form.Item>
        </span>
        <Form.List name="ruleClips">
          {(fields, { add, remove }) => (
            <Fragment>
              {fields.map((field) => (
                <div key={field.key} className={styles.listFormBox}>
                  <span>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </span>
                  <span className={styles.isNeed}>
                    <Form.Item
                      label={''}
                      name={[field.name, 'required']}
                      initialValue={1}
                      rules={[{ required: true, message: '请选择是否匹配' }]}
                    >
                      <Select>
                        <Option key={1} value={1}>
                          是
                        </Option>
                        <Option key={0} value={0}>
                          否
                        </Option>
                      </Select>
                    </Form.Item>
                  </span>
                  <span className={styles.rule}>
                    <Form.Item
                      label=""
                      labelCol={{ span: 0 }}
                      wrapperCol={{ span: 22 }}
                      name={[field.name, 'fragment']}
                      rules={[{ required: true, message: '请输入规则片段' }]}
                    >
                      <Input
                        maxLength={200}
                        onBlur={(e) => {
                          let num: any = e.target.selectionStart;
                          setStartPos(isNaN(num) ? -1 : num);
                          templateFocus(field?.key, field?.name);
                        }}
                      />
                    </Form.Item>
                  </span>
                  <span className={styles.isNeed}>
                    <Form.Item
                      label=""
                      name={[field.name, 'orderNumber']}
                      rules={[{ required: true, message: '请输入排序' }]}
                    >
                      <InputNumber min={0} step={1} precision={0} />
                    </Form.Item>
                  </span>
                </div>
              ))}
              <span className={styles.ruleSome}>
                <Form.Item label={''}>
                  <div
                    onClick={() => add()}
                    style={{
                      color: 'rgba(24,144,255,1)',
                      cursor: 'pointer',
                      paddingLeft: '100px',
                      width: '200px',
                    }}
                  >
                    <Space>
                      <PlusCircleOutlined />
                      <span>新增一行</span>
                    </Space>
                  </div>
                </Form.Item>
              </span>
            </Fragment>
          )}
        </Form.List>
        <div className={styles.slotBox}>
          <div className={styles.slotTxt}>插入词槽</div>
          <div className={styles.slotList}>
            {slotList?.map((item: any) => {
              return (
                <span key={item.id} onClick={() => insetWordTemp(item.slot, 'slot')}>
                  {item.slotName}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.slotBox}>
          <div className={styles.slotTxt}>插入特征词</div>
          <div className={styles.slotList}>
            {featureList?.map((item: any) => {
              return (
                <span key={item.key} onClick={() => insetWordTemp(item.key, 'feature')}>
                  {item.name}
                </span>
              );
            })}
          </div>
        </div>
        <Form.Item name={'threshold'} label={'阈值'} initialValue={0.7}>
          <InputNumber min={0.0} max={1} step={0.01} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
