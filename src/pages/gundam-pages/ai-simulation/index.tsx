import Condition from '@/components/Condition';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import RobotChatText from './chatText';
import { useChatModel } from './model';
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
  const { cref, chatVisible, robotInfo } = props;
  const [form] = Form.useForm();
  const [envirValue, setEnvirValue] = useState<string>('test'); // 环境值：生产、测试

  const [robotChatData, setRobotChatData] = useState<any>({}); // 保存机器人form表单数据
  const [robotFormList, setRobotFormList] = useState<any>([]); // 机器人form列表
  const [initRobotChat, setInitRobotChat] = useState<boolean>(false); // 初始化机器人聊天框

  const [beginTalking, handleBeginTalking] = useState<boolean>(false); // 是否开启会话功能,必须点击 ‘开始会话’按钮
  const [clearDialogFlag, handleClearDialog] = useState<boolean>(false); // 是否清理画布

  const [chartFormData, setChatFormData] = useState<any>({});

  const RobotChatTexRef = useRef<any>();

  const { getRobotChatData } = useChatModel();

  const { info, globalVarList, getGlobalValConfig } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    globalVarList: model.globalVarList,
    getGlobalValConfig: model.getGlobalValConfig,
  }));

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
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
    setChatFormData(values);
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
      message.error(res?.resultDesc || res?.message || '失败');
    }
  };

  // 重置会话
  const resetTalking = () => {
    handleBeginTalking(false); // 重置开始会话功能
  };

  const setChatVisible = (flag: any) => {
    RobotChatTexRef?.current?.setChatVisible(flag);
  };
  const fieldValueChange = () => {};

  useImperativeHandle(cref, () => ({
    setChatVisible,
  }));

  useEffect(() => {
    getChannelList(info.id);
    console.log('info', info);
  }, [info]);

  useEffect(() => {
    setRobotChatData({});
    console.log('globalVarList', globalVarList);
    setRobotFormList(globalVarList);
    // setRobotFormList(robotInfo); // 表单信息
    // showChatText(); // 初始化不开启会话功能
  }, [chatVisible, robotInfo]);

  useEffect(() => {
    console.log(1);

    getGlobalValConfig(info.id);
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
                    <Condition r-if={item.name != 'CHANNEL_CODE'}>
                      <Form.Item
                        name={item?.configName || item?.name}
                        label={item?.configValue || item?.label}
                      >
                        <Input placeholder={item?.placeholder} />
                      </Form.Item>
                    </Condition>
                    <Condition r-if={item.name == 'CHANNEL_CODE'}>
                      <Form.Item
                        name={item?.configName || item?.name}
                        label={item?.configValue || item?.label}
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select placeholder={item?.placeholder}>
                          {channelList?.map((item: any, index: any) => (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Condition>
                  </React.Fragment>
                );
              })}
              <Form.Item
                label="客户ID"
                name="customerId"
                rules={[{ required: true, message: '请输入客户ID' }]}
              >
                <Input maxLength={50} />
              </Form.Item>

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
            cref={RobotChatTexRef}
            modalData={robotChatData}
            formData={chartFormData}
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
