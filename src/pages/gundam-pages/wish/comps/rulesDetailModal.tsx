import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Space,
  Button,
  Radio,
  Collapse,
  message,
} from 'antd';
import AddWordModal from './addFeatureWordModal';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 18 },
};

const wordSlot = [
  {
    value: '词槽1',
    name: 'word1',
  },
  {
    value: '词槽2',
    name: 'word2',
  },
  {
    value: '词槽3',
    name: 'word3',
  },
];

export default (props: any) => {
  const { visible, title, modalData, onSubmit, onCancel } = props;
  const [form] = Form.useForm();
  const [currTempClipsIndex, setCurrTempClipsIndex] = useState<number>(0);
  const [wordVisible, handleWordVisible] = useState<boolean>(false);
  const [featureWord, setFeatureWord] = useState<any>([
    {
      value: '特征词1',
    },
    {
      value: '特征词1',
    },
    {
      value: '特征词3',
    },
  ]);

  useEffect(() => {
    if (title == 'add') {
      if (visible) {
        form.resetFields();
      }
    } else if (title == 'edit') {
      form.resetFields();
      form.setFieldsValue({ ...modalData });
    }
  }, [title]);

  // 整个modal的确认方法
  const onOk = () => {
    onSubmit();
  };

  // 整个modal的取消方法
  const onClose = () => {
    onCancel();
  };

  // 模版片段，获取聚焦的模版片段
  const templateFocus = (key: any, name: any) => {
    let data = form.getFieldValue('ruleClips');
    if (!data?.[key]) {
      data[key] = {
        content: '',
      };
      form.setFieldsValue({
        ...data,
      });
    }
    setCurrTempClipsIndex(key);
  };

  // 插入词槽
  const insertSlotToTemp = (value: any) => {
    const data = form.getFieldValue('ruleClips');
    let newValue = data?.[currTempClipsIndex]?.content || '';
    let content = '[' + value + ']';
    if (!newValue.includes(content)) {
      data[currTempClipsIndex].content = newValue + content;
      form.setFieldsValue({
        ruleClips: [...data],
      });
    } else {
      message.info('模版片段已存在该词槽');
    }
  };

  // 插入特征值
  const insertWordToTemp = (value: any) => {
    const data = form.getFieldValue('ruleClips');
    let newValue = data[currTempClipsIndex].content;
    let content = '[' + value + ']';
    if (!newValue.includes(content)) {
      data[currTempClipsIndex].content = newValue + content;
      form.setFieldsValue({
        ruleClips: [...data],
      });
    } else {
      message.info('模版片段已存在该特征词');
    }
  };

  // 新建特征词
  const addFeatureWord = () => {
    handleWordVisible(true);
  };

  const addFeatureSubmit = (value: any) => {
    let newList = [...featureWord];

    let flag = newList.every((item: any) => {
      return item.value != value;
    });
    if (flag) {
      newList.push({
        value: value,
      });
      setFeatureWord(newList);
      handleWordVisible(false);
    } else {
      message.info('该特征词已存在，请重新输入');
    }
  };

  const addFeatureCancel = () => {
    handleWordVisible(false);
  };

  return (
    <React.Fragment>
      {/* <Modal
        onCancel={onClose}
        footer={false}
        visible={visible}
        width={1000}
        title={title == 'add' ? '新增' : '编辑'}
      > */}
      <Form form={form} {...layout}>
        <Form.Item name="intentName" label="意图">
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item label="模版片段">
          <Form.List name="ruleClips">
            {(fields, { add, remove }) => (
              <React.Fragment>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                    }}
                    align="baseline"
                  >
                    <Form.Item {...restField} name={[name, 'matched']} label="必须匹配">
                      <Select style={{ width: 80 }}>
                        <Select.Option value="0">是</Select.Option>
                        <Select.Option value="1">否</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'content']} label="模版内容">
                      <Input onFocus={() => templateFocus(key, name)} width={300} maxLength={200} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'number']} label="顺序">
                      <InputNumber min={0} />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                    新增一行
                  </Button>
                </Form.Item>
                <Form.Item label="插入词槽">
                  <Space>
                    {wordSlot?.map((item: any) => {
                      return (
                        <Button key={item.value} onClick={() => insertSlotToTemp(item.value)}>
                          {item.value}
                        </Button>
                      );
                    })}
                  </Space>
                </Form.Item>
                <Form.Item label="插入特征词">
                  <Space>
                    <Button onClick={addFeatureWord}>新建特征词</Button>
                    {featureWord?.map((item: any) => {
                      return (
                        <Button key={item.value} onClick={() => insertWordToTemp(item.value)}>
                          {item.value}
                        </Button>
                      );
                    })}
                  </Space>
                </Form.Item>
              </React.Fragment>
            )}
          </Form.List>
        </Form.Item>
        {/* <Collapse style={{ marginLeft: 48 }} bordered={false} ghost>
            <Panel header="高级选项" key="1">
              <Form.Item name="blackList" label="词表黑名单">
                <Input />
              </Form.Item>
            </Panel>
          </Collapse> */}

        <Form.Item name="threshold" label="阈值">
          <InputNumber step={0.1} max={1} min={0} />
        </Form.Item>
        <Form.Item name="blackList" label="词表黑名单">
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item name="intentDesc" label="描述">
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" onClick={onOk}>
              确认
            </Button>
            <Button onClick={onClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
      {/* </Modal> */}

      <AddWordModal visible={wordVisible} onSubmit={addFeatureSubmit} onCancel={addFeatureCancel} />
    </React.Fragment>
  );
};
