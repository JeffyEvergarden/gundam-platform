import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Input, Radio, Select, Button, message } from 'antd';
import RobotChatText from './chatText';
import { useChatModel } from './model';
import { useModel } from 'umi';
import styles from './style.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

export default (props: any) => {
  const { chatVisible = false, robotInfo } = props;
  const [form] = Form.useForm();
  const [beginFlag, setBeginFlag] = useState<boolean>(false); // 初始化文本框标识, 只判断第一次
  const [eventType, setEventType] = useState<string>('begin'); // 事件类型
  const [runNum, setRunNum] = useState<number>(0); // 运行次数
  const [envirValue, setEnvirValue] = useState<string>('');

  const [robotChatData, setRobotChatData] = useState<any>({}); // 保存机器人form表单数据
  const [robotFormList, setRobotFormList] = useState<any>([]);
  const { getRobotChatData } = useChatModel();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  // 获取环境值
  const getEnvirmentValue = (value: any) => {
    setEnvirValue(value);
  };

  const showChatText = async () => {
    console.log('info', info);
    let newDay = new Date().toLocaleDateString();
    let occurDay = newDay.replace(/\//g, '-');
    let newTime = new Date().toLocaleTimeString('en-GB');

    const values = await form.validateFields();
    const data = form.getFieldsValue();
    let newData = { ...data };
    let params = {
      requestId: '1234',
      occurTime: occurDay + ' ' + newTime,
      systemCode: '5678',
      data: { ...newData },
      customerId: '9012',
      // validity: '',
      robotId: envirValue == 'prod' ? info.id : 'test-' + info.id,
      businessCode: info.businessCode,
    };
    console.log('params', params);
    const res: any = await getRobotChatData(params);
    message.info(res?.resultDesc || '正在处理');
    if (res?.resultCode == 100) {
      setRobotChatData(res);
      setBeginFlag(true);
      let a = runNum;
      a++;
      if (a > 0) {
        setEventType('dialogue');
      }
      setRunNum(a);
    }
  };

  const fieldValueChange = () => {};

  useEffect(() => {
    setRobotChatData({});
    setRobotFormList(robotInfo); // 表单信息
    console.log('formList', robotInfo);
    showChatText();
  }, [chatVisible]);

  return (
    <React.Fragment>
      <Row gutter={24}>
        <Col span={10}>
          <div className={styles['box-title']}>变量配置</div>
          <div className={styles['variable-box']}>
            <Form form={form} {...layout} onFieldsChange={fieldValueChange}>
              {robotFormList?.map((item: any) => {
                return (
                  <React.Fragment key={item.name}>
                    <Form.Item
                      name={item?.configName || item?.name}
                      label={item?.configValue || item?.label}
                    >
                      <Input placeholder={item?.placeholder} />
                    </Form.Item>
                  </React.Fragment>
                );
              })}
              <Form.Item>
                <Button onClick={showChatText}>开始对话</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={14}>
          <RobotChatText
            modalData={robotChatData}
            beginFlag={beginFlag}
            eventType={eventType}
            getEnvirmentValue={getEnvirmentValue}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
