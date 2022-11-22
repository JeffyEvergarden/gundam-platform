import Tip from '@/components/Tip';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, InputNumber, message, Select, Space } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useRuleModule } from './../../model';
import styles from './../index.less';

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
    let res = await slotInfo({ robotId: tableProps?.robotId, slotSources: [0, 4] });
    setSlotList(res?.data);
  };

  const getFeature = async () => {
    let res = await getFeatureListAll({ intentId: tableProps?.id });
    setFeatureList(res?.data);
  };
  const templateFocus = (key: any, name: any, index: any) => {
    // let data = form.getFieldValue('ruleClips');
    // if (!data?.[key]) {
    //   data[key] = {
    //     fragment: '',
    //   };
    //   form.setFieldsValue({
    //     ...data,
    //   });
    // }

    setCurrTempClipsIndex(index);
  };

  const insetWordTemp = (value: any, type: string) => {
    console.log('startPos', startPos);
    const data = form.getFieldValue('ruleClips');
    if (currTempClipsIndex > -1) {
      let newValue = data?.[currTempClipsIndex]?.fragment || '';
      let content = '';
      if (type === 'slot') {
        content = '#{' + value + '}';
      }
      if (type === 'feature') {
        content = '%{' + value + '}';
      }
      if (startPos > -1) {
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
              <span className={styles.isNeedText}>
                必须匹配 <Tip title={<>表示当前片段是否必须包含于客户文本中。</>} />
              </span>
              <span className={styles.ruleText}>
                <Space>
                  规则片段
                  <Tip
                    title={
                      <>
                        用户文本需要匹配的规则，多条规则片段根据排序号，组装成正则表达式进行匹配，组装时片段中间可以匹配任意字符。例如，意图“协商还款”规则片段一{' '}
                        “<span style={{ color: 'red' }}>我现在没钱</span>”、规则片段二“
                        <span style={{ color: 'red' }}>要晚几天</span>
                        ”，当客户说“
                        <span style={{ color: 'red' }}>我现在没钱，都说了，要晚几天</span>
                        ”，也可以匹配规则模板，识别为“协商还款”意图。匹配通过才可识别为当前意图。
                      </>
                    }
                  />
                </Space>
              </span>
              <span className={styles.sortText}>
                <Space>
                  排序
                  <Tip
                    title={
                      <>
                        序号表示规则模板片段在用户文本中必须遵守从左到右的匹配顺序，同序号规则片段之间无视匹配顺序：0代表任意位，对应的规则片段可以出现在用户文本中任意位置
                      </>
                    }
                  />
                </Space>
              </span>
            </div>
          </Form.Item>
        </span>
        <Form.List name="ruleClips">
          {(fields, { add, remove }) => (
            <Fragment>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className={styles.listFormBox}>
                  <span>
                    <MinusCircleOutlined onClick={() => remove(index)} />
                  </span>
                  <span className={styles.isNeed}>
                    <Form.Item
                      label={''}
                      name={[name, 'required']}
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
                      name={[name, 'fragment']}
                      rules={[{ required: true, message: '请输入规则片段' }]}
                    >
                      <Input
                        maxLength={200}
                        onBlur={(e) => {
                          let num: any = e.target.selectionStart;
                          setStartPos(isNaN(num) ? -1 : num);
                          templateFocus(key, name, index);
                        }}
                      />
                    </Form.Item>
                  </span>
                  <span className={styles.isNeed}>
                    <Form.Item
                      label=""
                      name={[name, 'orderNumber']}
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
                    onClick={() =>
                      add(
                        {
                          fragment: '',
                          orderNumber: null,
                          required: 1,
                        },
                        fields.length,
                      )
                    }
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
          <div className={styles.slotTxt}>
            插入词槽
            <Tip
              title={
                <>
                  规则片段中可以插入枚举词槽、正则实体，当客户文本匹配规则模板，会自动将对应的词槽进行填充。例如意图“想旅游”的规则模板插入了城市实体即“{' '}
                  <span style={{ color: 'red' }}>我想去%{'{城市}'}旅游</span>
                  ”，当客户说“ <span style={{ color: 'red' }}>我想去广州旅游</span>
                  ”，则这句话的意图为“想旅游”，同时%{'{城市}'}
                  词槽的值填充为“广州”。
                </>
              }
            />
          </div>
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
          <div className={styles.slotTxt}>
            插入特征词
            <Tip
              title={
                <>
                  于插入词槽类似，特征词是一类描述的集合，例如“请问”、“问一下”、“请问一下”这种，可以新建为一个特征词，在此处插入规则中。
                </>
              }
            />
          </div>
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
        <Form.Item label={'阈值'}>
          <Space align="baseline">
            <Form.Item name={'threshold'} noStyle initialValue={0.7}>
              <InputNumber min={0.0} max={1} step={0.01} />
            </Form.Item>
          </Space>
          <Tip
            title={
              <>
                阈值表示，客户文本中可识别部分占文本总长度的比例，当比例大于阈值时，可被识别为所标注的意图。
              </>
            }
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
