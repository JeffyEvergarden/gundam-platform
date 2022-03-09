import React, { useState, useEffect, useRef } from 'react';
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

const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { chatVisible, robotInfo } = props;
  const [form] = Form.useForm();
  const [envirValue, setEnvirValue] = useState<string>('test'); // 环境值：生产、测试

  const [robotChatData, setRobotChatData] = useState<any>({}); // 保存机器人form表单数据
  const [robotFormList, setRobotFormList] = useState<any>([]); // 机器人form列表
  const [initRobotChat, setInitRobotChat] = useState<boolean>(false); // 初始化机器人聊天框

  const [beginTalking, handleBeginTalking] = useState<boolean>(false); // 是否开启会话功能,必须点击 ‘开始会话’按钮
  const [clearDialogFlag, handleClearDialog] = useState<boolean>(false); // 是否清理画布

  const { getRobotChatData } = useChatModel();

  const { info, globalVarList } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    globalVarList: model.globalVarList,
  }));

  // 从对话框获取环境值,会话重新开始
  const getEnvirmentValue = (value: any) => {
    setEnvirValue(value);
  };

  const showChatText = async () => {
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
      robotId: envirValue == 'prod' ? info.id : 'test_' + info.id,
      businessCode: info.businessCode,
    };
    const res: any = await getRobotChatData(params);
    if (res?.resultCode == '100') {
      let clearFlag = clearDialogFlag;
      handleClearDialog(!clearFlag); // 清理画布
      setRobotChatData(res);
      setInitRobotChat(true);
      handleBeginTalking(true); // 开始会话功能
    } else {
      message.info(res?.resultDesc || res?.message || '正在处理');
    }
  };

  // 重置会话
  const resetTalking = () => {
    handleBeginTalking(false); // 重置开始会话功能
  };

  const fieldValueChange = () => {};

  useEffect(() => {
    setRobotChatData({});
    console.log('globalVarList', globalVarList);
    setRobotFormList(globalVarList);
    // setRobotFormList(robotInfo); // 表单信息
    // showChatText(); // 初始化不开启会话功能
  }, [chatVisible, robotInfo]);

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
              <Form.Item {...tailLayout}>
                <Button type="primary" onClick={showChatText}>
                  开始对话
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={14}>
          <RobotChatText
            modalData={robotChatData}
            getEnvirmentValue={getEnvirmentValue}
            initRobotChat={initRobotChat}
            talkingFlag={beginTalking}
            resetTalking={resetTalking}
            clearDialogFlag={clearDialogFlag}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
